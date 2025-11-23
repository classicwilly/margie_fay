<#
Find the most recent zipped Playwright trace under `test-results` or `playwright-report/data`, open it with `npx playwright show-trace <zip>`, and then run the dashboard verification script.
#>
# Directories to search for zipped traces
$traceDirs = @("./test-results", "./playwright-report/data")
[switch]$Verbose = $false

# Helper: find most recent zip file in given directories
function Get-LatestZip($dirs) {
    foreach ($dir in $dirs) {
        if (-not (Test-Path $dir)) { continue }
        $zips = Get-ChildItem -Path $dir -Filter *.zip -Recurse -File -ErrorAction SilentlyContinue
        if ($zips -and $zips.Count -gt 0) {
            return $zips | Sort-Object LastWriteTime -Descending | Select-Object -First 1
        }
    }
    return $null
}

$latest = Get-LatestZip $traceDirs

if (-not $latest) {
    Write-Host "No zipped traces found in: $traceDirs`nLooking for traces under ./playwright-report/data and ./test-results..." -ForegroundColor Yellow
    exit 1
}

Write-Host "Found latest trace: $($latest.FullName)" -ForegroundColor Green
# Launch show-trace (UI may open a browser). If on headless Linux or remote server this may do nothing; it's a UI command.
Write-Host "Opening trace viewer..." -ForegroundColor Cyan
# Use cmd.exe to invoke npx reliably on Windows
$showTraceCmd = "cmd /c ""npx playwright show-trace '$($latest.FullName)'"""
Write-Host "Running: $showTraceCmd"
Start-Process -FilePath "cmd.exe" -ArgumentList @("/c", "npx", "playwright", "show-trace", $latest.FullName) -NoNewWindow -Wait

# After the trace viewer closes or the command returns, run the dashboard verification script
$verifyScript = Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) "verify-dashboard.js"
if (Test-Path $verifyScript) {
    Write-Host "Running dashboard verification using Node script: $verifyScript" -ForegroundColor Cyan
    try {
        # Keep environment consistent with Playwright base URL if provided
        $env:PLAYWRIGHT_BASE_URL = $env:PLAYWRIGHT_BASE_URL -or 'http://localhost:4173'
        # Run Node script
        node $verifyScript
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Dashboard verification succeeded." -ForegroundColor Green
            exit 0
        } else {
            Write-Host "Dashboard verification returned non-zero exit code: $LASTEXITCODE" -ForegroundColor Yellow
            exit $LASTEXITCODE
        }
    } catch {
        Write-Host "Error running verify script: $_" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "verify-dashboard.js not found; skipping verification step." -ForegroundColor Yellow
}

exit 0
