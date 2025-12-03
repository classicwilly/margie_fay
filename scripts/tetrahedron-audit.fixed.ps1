#!/usr/bin/env pwsh
# Minimal tetrahedron-audit stub for tests
param(
    [switch]$DryRun,
    [switch]$NoBuild,
    [switch]$SelfTest,
    [double]$FrictionThreshold,
    [double]$PhaseTolerance,
    [string]$TopologyRequired,
    [switch]$MultiSensoryRequired,
    [string]$LogPath
)

<#
Minimal helpers used only by tests
#>

$ErrorActionPreference = 'Stop'

$Protocol = [pscustomobject]@{
    TopologyRequired = 'K4'
    FrictionThreshold = 0.05
    PhaseTolerance = 0.01
    MultiSensoryRequired = $true
}

function Test-FileContent {
    param(
        [string]$Path,
        [string[]]$RequiredPatterns,
        [string]$Description
    )
    if (-not (Test-Path $Path)) { return $false }
    $content = Get-Content -Path $Path -Raw -ErrorAction Stop
    if (-not $content) { return $false }
    foreach ($p in $RequiredPatterns) { if (-not ($content -match $p)) { return $false } }
    return $true
}

function Parse-Csv-Manual {
    param([string]$Path)
    $rows = @()
    if (-not (Test-Path $Path)) { return $rows }
    $raw = Get-Content -Path $Path -Raw -ErrorAction Stop
    $lines = $raw -split "`n" | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne '' }
    if ($lines.Count -eq 0) { return $rows }
    $headerLine = $lines[0]
    $cellRegex = '(?<=^|,)(?:(?:"([^"]*)")|([^,]*))'
    [regex]$re = $cellRegex
    $headers = @()
    $matches = $re.Matches($headerLine)
    foreach ($m in $matches) { if ($m.Groups[1].Value) { $headers += $m.Groups[1].Value } else { $headers += $m.Groups[2].Value } }
    for ($i = 1; $i -lt $lines.Count; $i++) {
        $matches = $re.Matches($lines[$i])
        $values = @()
        foreach ($m in $matches) { if ($m.Groups[1].Value) { $values += $m.Groups[1].Value } else { $values += $m.Groups[2].Value } }
        $obj = [ordered]@{}
        for ($j = 0; $j -lt $headers.Count; $j++) { if ($j -lt $values.Count) { $obj[$headers[$j]] = $values[$j] } else { $obj[$headers[$j]] = $null } }
        $rows += [pscustomobject]$obj
    }
    return $rows
}

function Test-MultiSensory {
    param($Data, $Protocol)
    $val = $Data.MultiSensory
    if ($val -is [bool]) { $msBool = $val } else { $msBool = (([string]$val).ToLower() -eq 'true') }
    return ($Protocol.MultiSensoryRequired -and $msBool)
}

# Do nothing when dot-sourced
if ($MyInvocation.InvocationName -ne '.') {
    # normal execution path would invoke an audit function
}