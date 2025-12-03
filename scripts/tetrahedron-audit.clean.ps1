#!/usr/bin/env pwsh
<# Clean, isolated Tetrahedron Audit helpers for tests and usage. This copy is used for test harnessing and will mirror the final script.
#>
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

$ErrorActionPreference = 'Stop'

$Blue = "`e[34m"; $Green = "`e[32m"; $Red = "`e[31m"; $Yellow = "`e[33m"; $Cyan = "`e[36m"; $White = "`e[37m"; $Bold = "`e[1m"; $Reset = "`e[0m"
$script:Passed=0; $script:Failed=0; $script:Warnings=0

function Write-TestHeader { param([string]$T); Write-Host "`n${Bold}${Cyan}--- $T ---${Reset}`n" }
function Write-TestSection { param([string]$S); Write-Host "${Bold}${White}▸ $S${Reset}" }
function Write-Pass { param([string]$m); Write-Host "  ${Green}✓${Reset} $m"; $script:Passed++ }
function Write-Fail { param([string]$m); Write-Host "  ${Red}✗${Reset} $m"; $script:Failed++ }
function Write-Warn { param([string]$m); Write-Host "  ${Yellow}⚠${Reset} $m"; $script:Warnings++ }

function Test-FileExists { param([string]$Path,[string]$Desc); if (Test-Path $Path) { Write-Pass "$Desc exists"; return $true } else { Write-Fail "$Desc missing"; return $false } }
function Test-FileContent { param([string]$Path,[string[]]$RequiredPatterns,[string]$Desc); if (-not (Test-Path $Path)) { Write-Fail "$Desc missing at $Path"; return $false }; $c=Get-Content -Raw -Path $Path -ErrorAction Stop; $missing=@(); foreach ($p in $RequiredPatterns) { if (-not ($c -match $p)) { $missing += $p } }; if ($missing.Count -eq 0) { Write-Pass "$Desc contains all required patterns"; return $true } else { Write-Fail "$Desc missing patterns: $($missing -join ', ')"; return $false } }

function Parse-Csv-Manual { param([string]$Path)
    $rows = @()
    if (-not (Test-Path $Path)) { return $rows }
    $raw = Get-Content -Raw -Path $Path -ErrorAction Stop
    $lines = $raw -split "`n" | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne '' }
    if ($lines.Count -eq 0) { return $rows }
    $cellRegex = '(?<=^|,)(?:(?:"([^"]*)")|([^,]*))'
    $re = [regex]$cellRegex
    $headers = @()
    foreach ($m in $re.Matches($lines[0])) {
        if ($m.Groups[1].Value) { $headers += $m.Groups[1].Value } else { $headers += $m.Groups[2].Value }
    }
    for ($i = 1; $i -lt $lines.Count; $i++) {
        $vals = @()
        foreach ($m in $re.Matches($lines[$i])) {
            if ($m.Groups[1].Value) { $vals += $m.Groups[1].Value } else { $vals += $m.Groups[2].Value }
        }
        $obj = [ordered]@{}
        for ($j = 0; $j -lt $headers.Count; $j++) {
            if ($j -lt $vals.Count) { $obj[$headers[$j]] = $vals[$j] } else { $obj[$headers[$j]] = $null }
        }
        $rows += [pscustomobject]$obj
    }
    return $rows
}

function Test-MultiSensory { param($Data,$Protocol); $val = $Data.MultiSensory; if ($val -is [bool]) { $b=$val } else { $b=((([string]$val).ToLower()) -eq 'true') }; return ($Protocol.MultiSensoryRequired -and $b) }

function Compute-ThresholdFromData { param([double[]]$values); if (-not $values -or $values.Count -eq 0) { return $null }; $v=$values | Sort-Object; $n=$v.Count; $q1=$v[[math]::Floor($n*0.25)]; $q3=$v[[math]::Floor($n*0.75)]; $iqr=$q3-$q1; $median=$v[[math]::Floor($n*0.5)]; return [math]::Round($median + 1.5*$iqr, 4) }

function Compute-ProtocolDefaults { param([array]$Data, [pscustomobject]$Protocol); if (-not $Data -or $Data.Count -eq 0) { return $Protocol }; $fr = $Data | ForEach-Object { [double]$_.Friction } | Where-Object { $_ -ne $null }; $pt = $Data | ForEach-Object { [math]::Abs([double]$_.Phase1 - [double]$_.Phase2) } | Where-Object { $_ -ne $null }; $fTh = Compute-ThresholdFromData -values ($fr); $pTh = Compute-ThresholdFromData -values ($pt); if ($fTh -ne $null -and -not $PSBoundParameters.ContainsKey('FrictionThreshold') -and -not $env:FrictionThreshold) { $Protocol.FrictionThreshold=[double]$fTh }; if ($pTh -ne $null -and -not $PSBoundParameters.ContainsKey('PhaseTolerance') -and -not $env:PhaseTolerance) { $Protocol.PhaseTolerance=[double]$pTh }; return $Protocol }

function Load-AuditData { param([string]$Path); if (-not $Path -or -not (Test-Path $Path)) { return @() }; try { $d = Import-Csv -Path $Path -ErrorAction Stop; return $d } catch { $d = Parse-Csv-Manual -Path $Path; return $d } }

function Generate-EdgesFromVertices { param([string[]]$V); $edges=@(); for ($i=0;$i -lt $V.Count;$i++){ for ($j=$i+1;$j -lt $V.Count;$j++){ $edges += @{ from=$V[$i]; to=$V[$j]; path="$($V[$i])-$($V[$j])" }; $edges += @{ from=$V[$j]; to=$V[$i]; path="$($V[$j])-$($V[$i])" } } }; return $edges }

# Defaults
$Protocol = [pscustomobject]@{ TopologyRequired='K4'; FrictionThreshold=0.05; PhaseTolerance=0.01; MultiSensoryRequired=$true }
$Vertices = @('emotional','practical','technical','philosophical')

# Minimal tests for helpers
Write-TestHeader 'CLEAN SCRIPT LOADED FOR TESTS'

return 0
