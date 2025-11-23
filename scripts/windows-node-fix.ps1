<#
Windows helper to stop node, remove locked lightningcss binary, clean NPM cache and reinstall dependencies.
Run this from the repository root in an elevated PowerShell session:
  .\scripts\windows-node-fix.ps1

#>
param(
    [switch]$RunInstall
)

Write-Host "Stopping node processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | ForEach-Object { try { Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue } catch { } }

$target = Join-Path -Path (Get-Location) -ChildPath "node_modules\lightningcss-win32-x64-msvc"
if (Test-Path $target) {
    Write-Host "Removing locked lightningcss folder: $target" -ForegroundColor Yellow
    try {
        Remove-Item -Recurse -Force -LiteralPath $target -ErrorAction Stop
        Write-Host "Removed lightningcss folder." -ForegroundColor Green
    } catch {
        Write-Host "Could not remove the folder; trying to take ownership and retry." -ForegroundColor Yellow
        $file = Join-Path $target "lightningcss.win32-x64-msvc.node"
        try {
            takeown /f "$file" /a | Out-Null
            icacls "$file" /grant "$env:USERNAME:F" | Out-Null
            Remove-Item -Recurse -Force -LiteralPath $target -ErrorAction Stop
            Write-Host "Removed after taking ownership." -ForegroundColor Green
        } catch {
            Write-Host "Failed to remove the folder; check Process Explorer or Sysinternals Handle to see which process holds it." -ForegroundColor Red
            exit 1
        }
    }
} else {
    Write-Host "lightningcss binary folder not found. Continuing." -ForegroundColor Yellow
}

Write-Host "Cleaning npm cache..." -ForegroundColor Yellow
npm cache clean --force

if ($RunInstall) {
    Write-Host "Running npm ci..." -ForegroundColor Yellow
    npm ci
}

Write-Host "Done. If deletion failed, run Process Explorer or Sysinternals Handle to identify locking process." -ForegroundColor Green
