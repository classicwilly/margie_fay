#!/usr/bin/env pwsh
# Safe dev server stop: stops PID recorded in scripts/node_dev_pid.txt or prompts
$ErrorActionPreference = 'Stop'
$pidPath = Join-Path -Path $PSScriptRoot -ChildPath 'node_dev_pid.txt'
if (Test-Path $pidPath) {
    $pid = (Get-Content -Path $pidPath | Out-String).Trim()
    if ($pid -and [int]::TryParse($pid, [ref]$null)) {
        try {
            Stop-Process -Id [int]$pid -Force -ErrorAction Stop
            Remove-Item -Path $pidPath -Force
            Write-Host "Stopped Next dev process with PID $pid and removed $pidPath"
        } catch {
            Write-Warning "Failed to stop process with PID $pid. It may have already exited. Attempting safe fallback..."
            if (Get-Process -Name node -ErrorAction SilentlyContinue) {
                $confirm = Read-Host "There are 'node' processes running. Do you want to stop them? (y/n)"
                if ($confirm -eq 'y') { Stop-Process -Name node -Force }
            }
        }
    } else {
        Write-Warning "PID in $pidPath appears invalid. Deleting file to avoid re-use."
        Remove-Item -Path $pidPath -Force
    }
} else {
    Write-Host "PID file $pidPath not found. No tracked server to stop. Use the optional fallback to stop node processes."
}
