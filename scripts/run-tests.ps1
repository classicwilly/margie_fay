#!/usr/bin/env pwsh
<# Script: run-tests.ps1
   Simple test harness to run Pester tests for tetrahedron audit
   Installs Pester if missing, then runs tests.
#>
try {
    if (-not (Get-Module -ListAvailable -Name Pester)) {
        Write-Host 'Pester not found. Installing Pester module...'
        Install-Module -Name Pester -Force -Scope CurrentUser -AllowClobber
    }
} catch {
    Write-Warn "Failed to ensure Pester installed: $($_.Exception.Message)"
}

Import-Module Pester -ErrorAction SilentlyContinue
Write-Host 'Running Pester tests for tetrahedron-audit'
Invoke-Pester -Script .\scripts\tests\test-tetrahedron-audit.Tests.ps1
