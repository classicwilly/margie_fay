<#
.SYNOPSIS
  Check for GITHUB_TOKEN and GH_TOKEN across Process/User/Machine scopes and optionally remove them.

.DESCRIPTION
  This script:
    - Detects whether GITHUB_TOKEN and GH_TOKEN exist in Process/User/Machine scopes.
    - Displays a masked summary of any found tokens (no full tokens are printed).
    - Asks the user for confirmation before removing tokens from each scope.
    - Prompts the user before removing Machine-scope variables because elevated privileges are required.
    - Optionally relaunches elevated if the user approves (explicit prompt).
    - Optionally runs 'gh auth login --web' and 'gh auth status --show-token' to facilitate re-authentication and verification.

.NOTES
  - This script is idempotent.
  - It avoids logging tokens or sending any secrets to remote services.
  - Tested on PowerShell 7+ (cross-platform). On Windows, Machine-level changes require elevation.
#>

# Prevent accidental pipeline-breaking when script is dot-sourced
if ($MyInvocation.BoundParameters.ContainsKey('NoExit')) { }

# --- Utility functions ------------------------------------------------------

function Test-IsElevated {
    try {
        if ($PSVersionTable.PSVersion -and $env:OS -like "*Windows*") {
            $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
            $principal = New-Object Security.Principal.WindowsPrincipal($identity)
            return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
        } else {
            return $true
        }
    } catch {
        return $false
    }
}

function Convert-MaskedToken {
    param(
        [string]$token
    )
    if (-not $token) { return "(not set)" }
    $len = $token.Length
    if ($len -lt 8) {
        return ("*" * ($len - 2)) + $token.Substring($len - 2, 2)
    } else {
        $first = $token.Substring(0, 4)
        $last = $token.Substring($len - 4, 4)
        return "$first`****`$last (len=$len)"
    }
}

function Get-EnvFromScopes {
    param([string]$varName)
    $r = [ordered]@{}
    foreach ($scope in @("Process","User","Machine")) {
        try {
            $value = [System.Environment]::GetEnvironmentVariable($varName, $scope)
            $r[$scope] = $value
        } catch {
            $r[$scope] = $null
        }
    }
    return $r
}

function Confirm-Action {
    param(
        [string]$message,
        [bool]$defaultYes = $false
    )

    $prompt = if ($defaultYes) { "$message [Y/n]" } else { "$message [y/N]" }

    while ($true) {
        $input = Read-Host -Prompt $prompt
        if ([string]::IsNullOrWhiteSpace($input)) {
            return $defaultYes
        }
        $lc = $input.Trim().ToLowerInvariant()
        if ($lc -in @('y','yes')) { return $true }
        if ($lc -in @('n','no'))  { return $false }
        Write-Host "Please answer 'y' (yes) or 'n' (no)."
    }
}

function Remove-EnvVariable {
    param(
        [string]$name,
        [ValidateSet("Process","User","Machine")] [string]$scope
    )
    try {
        switch ($scope) {
            "Process" {
                Remove-Item -Path ("env:" + $name) -ErrorAction SilentlyContinue
                Write-Host "Removed $name from Process (current shell)."
            }
            "User" {
                [System.Environment]::SetEnvironmentVariable($name, $null, [System.EnvironmentVariableTarget]::User)
                Write-Host "Removed $name from User environment variables."
            }
            "Machine" {
                [System.Environment]::SetEnvironmentVariable($name, $null, [System.EnvironmentVariableTarget]::Machine)
                Write-Host "Removed $name from Machine environment variables."
            }
        }
        return $true
    } catch {
        Write-Warning "Failed to remove $name from $scope. Error: $_"
        return $false
    }
}

function Relaunch-Elevated {
    param(
        [string[]]$OriginalArgs
    )
    try {
        $pwshExe = $PSHOME + "\pwsh.exe"
        if (-not (Test-Path $pwshExe)) {
            $pwshExe = "powershell.exe"
        }

        $argsList = @("-NoProfile", "-ExecutionPolicy", "Bypass", "-File", "`"$($MyInvocation.MyCommand.Path)`"")
        if ($OriginalArgs) {
            $argsList += $OriginalArgs
        }

        $restart = Confirm-Action "Elevation required to modify Machine-level env vars. Relaunch elevated now?" $false
        if (-not $restart) {
            Write-Host "Skipping Machine-level modifications. You can run this script in an elevated shell to proceed."
            return $false
        }

        Write-Host "Requesting elevation to re-run the script..."
        Start-Process -FilePath $pwshExe -ArgumentList ($argsList -join ' ') -Verb RunAs
        exit
    } catch {
        Write-Warning "Could not relaunch with elevation: $_"
        return $false
    }
}

function Test-GhCli {
    $cmd = Get-Command gh -ErrorAction SilentlyContinue
    return ($cmd -ne $null)
}

# --- Script behavior --------------------------------------------------------

$tokenNames = @("GITHUB_TOKEN","GH_TOKEN")
$found = [System.Collections.Generic.List[psobject]]::new()

Write-Host "Checking for GITHUB_TOKEN and GH_TOKEN in Process/User/Machine scopes..."
Write-Host "Note: Token values will be masked for safety; no tokens will be displayed in full."

foreach ($name in $tokenNames) {
    $scopes = Get-EnvFromScopes -varName $name
    foreach ($scope in $scopes.Keys) {
        $val = $scopes[$scope]
        if ($val) {
            $found.Add([pscustomobject]@{
                Name  = $name
                Scope = $scope
                Mask  = Convert-MaskedToken $val
            })
        }
    }
}

if ($found.Count -eq 0) {
    Write-Host "No tokens named GITHUB_TOKEN or GH_TOKEN found in Process/User/Machine scopes."
    if (Test-GhCli) {
        $chk = Confirm-Action "No tokens found in environment variables. Would you like to run 'gh auth status --show-token' to check GH CLI auth status?" $false
        if ($chk) { gh auth status --show-token }
    } else {
        Write-Host "GH CLI not detected. Skipping GH auth check. Install gh CLI to perform CLI authentication checks if desired."
    }
    exit 0
}

Write-Host ""
Write-Host "Found tokens:"
foreach ($entry in $found) {
    Write-Host (" - {0} (scope: {1}) => {2}" -f $entry.Name, $entry.Scope, $entry.Mask)
}

$groupedByScope = $found | Group-Object -Property Scope

$removedOps = [System.Collections.Generic.List[string]]::new()

foreach ($grp in $groupedByScope) {
    $scope = $grp.Name
    $items = $grp.Group

    Write-Host ""
    Write-Host "Scope: $scope"
    foreach ($it in $items) {
        Write-Host ("   - {0} => {1}" -f $it.Name, $it.Mask)
    }

    $doRemove = Confirm-Action "Do you want to remove these variables from the $scope scope?" $false
    if (-not $doRemove) { Write-Host "Skipping removal for $scope."; continue }

    if ($scope -eq "Machine") {
        if (-not (Test-IsElevated)) {
            Write-Host ""
            Write-Host "Machine-level changes require elevated privileges (Administrator)."
            $relaunch = Confirm-Action "Would you like to attempt to relaunch this script as Administrator to apply Machine-level changes?" $false
            if ($relaunch) { Relaunch-Elevated -OriginalArgs @(); Write-Warning "Could not relaunch elevated. Please run this script from an elevated PowerShell prompt manually to remove Machine-level env vars."; continue } else { Write-Host "Skipping Machine-level removal. Run this script as an Administrator if you need to remove Machine-level env vars."; continue }
        } else {
            Write-Host "Confirmed: Running with Administrator privileges; proceeding with Machine-level removals."
        }
    }

    foreach ($it in $items) {
        $name = $it.Name
        $success = Remove-EnvVariable -name $name -scope $scope
        if ($success) { $removedOps.Add("$($name):$($scope)") }
    }
}

if ($removedOps.Count -gt 0) {
    Write-Host ""
    Write-Host "Removal summary (masked):"
    foreach ($op in $removedOps) { Write-Host " - $op removed." }

    if (Test-GhCli) {
        if (Confirm-Action "Would you like to re-authenticate with GitHub CLI now (run 'gh auth login --web')?" $false) {
            Write-Host "Launching 'gh auth login --web'..."
            try { gh auth login --web } catch { Write-Warning "Failed to run 'gh auth login --web'. Error: $_" }

            if (Confirm-Action "Would you like to verify GH auth status now (runs 'gh auth status --show-token')?" $true) {
                try { gh auth status --show-token } catch { Write-Warning "Failed to run 'gh auth status --show-token'. Error: $_" }
            }
        } else { Write-Host "Skipping GH CLI re-authentication. You can run 'gh auth login --web' later if needed." }
    } else {
        Write-Host "GH CLI not detected. Install GH CLI (https://cli.github.com) to reauthenticate and confirm status." }
} else { Write-Host ""; Write-Host "No variables were removed." }

Write-Host ""; Write-Host "Done. You can re-run this script at any time; it's idempotent and does not re-create environment variables."