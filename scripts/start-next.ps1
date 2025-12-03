#!/usr/bin/env pwsh
# Safe dev server start: records PID to scripts/node_dev_pid.txt
$ErrorActionPreference = 'Stop'
$pidPath = Join-Path -Path $PSScriptRoot -ChildPath 'node_dev_pid.txt'
Write-Host "Starting Next dev server (npm run dev)..."
$proc = Start-Process -FilePath cmd.exe -ArgumentList '/c', 'npm', 'run', 'dev' -WorkingDirectory (Get-Location) -NoNewWindow -PassThru
Start-Sleep -Seconds 2
if ($null -ne $proc) {
    Set-Content -Path $pidPath -Value $proc.Id -Force
    Write-Host "Next dev started with PID $($proc.Id). PID saved to $pidPath"
} else {
    Write-Host "Failed to start Next dev."
}
