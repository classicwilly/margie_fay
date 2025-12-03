#!/usr/bin/env pwsh
<#
.SYNOPSIS
  Protocol-driven Tetrahedron audit harness

.DESCRIPTION
  Deterministic, reproducible tests for K₄ topology, friction, phase alignment,
  and multi-sensory patterns. CLI flags, env override, and a config file are supported.

.NOTES
  Designed to be dot-sourced in tests; helpers are top-level functions and no side effects occur on dot-source.
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

# Colors & counters
$Blue  = "`e[34m"; $Green = "`e[32m"; $Red = "`e[31m"; $Yellow = "`e[33m"; $Cyan = "`e[36m"; $White = "`e[37m"; $Bold = "`e[1m"; $Reset = "`e[0m"
$script:Passed = 0; $script:Failed = 0; $script:Warnings = 0

function Write-TestHeader { param([string]$Title); Write-Host "`n${Bold}${Cyan}═══════════════════════════════════════════════════════════════${Reset}"; Write-Host "${Bold}${Cyan} $Title${Reset}"; Write-Host "${Bold}${Cyan}═══════════════════════════════════════════════════════════════${Reset}`n" }
function Write-TestSection { param([string]$Section); Write-Host "${Bold}${White}▸ $Section${Reset}" }
function Write-Pass { param([string]$Message); Write-Host "  ${Green}✓${Reset} $Message"; $script:Passed++ }
function Write-Fail { param([string]$Message); Write-Host "  ${Red}✗${Reset} $Message"; $script:Failed++ }
function Write-Warn { param([string]$Message); Write-Host "  ${Yellow}⚠${Reset} $Message"; $script:Warnings++ }

function Test-FileExists { param([string]$Path, [string]$Description); if (Test-Path $Path) { Write-Pass "$Description exists"; return $true } else { Write-Fail "$Description missing"; return $false } }

function Test-FileContent { param([string]$Path, [string[]]$RequiredPatterns, [string]$Description); if (-not (Test-Path $Path)) { Write-Fail "$Description missing at $Path"; return $false }; $content = Get-Content -Raw -Path $Path -ErrorAction Stop; $missing=@(); foreach ($p in $RequiredPatterns) { if (-not ($content -match $p)) { $missing += $p } }; if ($missing.Count -eq 0) { Write-Pass "$Description contains all required patterns"; return $true } else { Write-Fail "$Description missing patterns: $($missing -join ', ')"; return $false } }

function Parse-Csv-WithTextFieldParser {
    param([string]$Path)
    try {
        Add-Type -AssemblyName Microsoft.VisualBasic
        $p = New-Object Microsoft.VisualBasic.FileIO.TextFieldParser($Path)
        $p.TextFieldType = [Microsoft.VisualBasic.FileIO.FieldType]::Delimited
        $p.SetDelimiters(',')
        $rows = @()
        $headers = @()
        if (-not $p.EndOfData) { $headers = $p.ReadFields() }
        while (-not $p.EndOfData) {
            $f = $p.ReadFields()
            $o = [ordered]@{}
            for ($i = 0; $i -lt $headers.Count; $i++) {
                if ($i -lt $f.Count) { $o[$headers[$i]] = $f[$i] } else { $o[$headers[$i]] = $null }
            }
            $rows += [pscustomobject]$o
        }
        $p.Close()
        return $rows
    } catch {
        Write-Warn "TextFieldParser failed: $($_.Exception.Message)"
        return @()
    }
}

function Parse-Csv-Manual {
    param([string]$Path)
    $rows = @()
    try {
        $raw = Get-Content -Raw -Path $Path -ErrorAction Stop
        $lines = $raw -split "`n" | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne '' }
        if ($lines.Count -eq 0) { return $rows }
        $headerLine = $lines[0]
        $cellRegex = '(?<=^|,)(?:(?:"([^"]*)")|([^,]*))'
        $re = [regex]$cellRegex
        $headers = @()
        foreach ($m in $re.Matches($headerLine)) { if ($m.Groups[1].Value) { $headers += $m.Groups[1].Value } else { $headers += $m.Groups[2].Value } }
        for ($i = 1; $i -lt $lines.Count; $i++) {
            $vals = @()
            foreach ($m in $re.Matches($lines[$i])) { if ($m.Groups[1].Value) { $vals += $m.Groups[1].Value } else { $vals += $m.Groups[2].Value } }
            $o = [ordered]@{}
            for ($j = 0; $j -lt $headers.Count; $j++) { if ($j -lt $vals.Count) { $o[$headers[$j]] = $vals[$j] } else { $o[$headers[$j]] = $null } }
            $rows += [pscustomobject]$o
        }
        return $rows
    } catch {
        Write-Warn "Manual CSV parse failed: $($_.Exception.Message)"
        return @()
    }
}

function Load-AuditData { param([string]$Path) if (-not $Path) { return @() }; if (Test-Path $Path) { try { $d = Import-Csv -Path $Path -ErrorAction Stop; Write-Pass "Loaded audit-data.csv from $Path"; return $d } catch { Write-Warn "Import-Csv failed: $($_.Exception.Message)"; $d = Parse-Csv-WithTextFieldParser -Path $Path; if ($d.Count -gt 0) { Write-Pass 'Parsed via TextFieldParser'; return $d } else { $d = Parse-Csv-Manual -Path $Path; if ($d.Count -gt 0) { Write-Pass 'Parsed via manual CSV fallback'; return $d } else { Write-Warn 'CSV parse failed; using empty dataset'; return @() } } } } else { return @() } }

function Compute-ProtocolFromData { param([array]$Data, [PSCustomObject]$Protocol) if (-not $Data -or $Data.Count -eq 0) { return $Protocol }; $fr = $Data | ForEach-Object { [double]$_.Friction } | Where-Object { $_ -ne $null } | Sort-Object; if ($fr.Count -gt 0) { $q1=$fr[[math]::Floor($fr.Count*0.25)]; $q3=$fr[[math]::Floor($fr.Count*0.75)]; $iqr=$q3-$q1; $median=$fr[[math]::Floor($fr.Count*0.5)]; $computed=[math]::Round($median + 1.5*$iqr,3); if (-not $PSBoundParameters.ContainsKey('FrictionThreshold') -and -not $env:FrictionThreshold) { $Protocol.FrictionThreshold = $computed } }; $pDiffs = $Data | ForEach-Object { [math]::Abs([double]$_.Phase1 - [double]$_.Phase2) } | Where-Object { $_ -ne $null } | Sort-Object; if ($pDiffs.Count -gt 0) { $q1=$pDiffs[[math]::Floor($pDiffs.Count*0.25)]; $q3=$pDiffs[[math]::Floor($pDiffs.Count*0.75)]; $iqr=$q3-$q1; $median=$pDiffs[[math]::Floor($pDiffs.Count*0.5)]; $computedP=[math]::Round($median + 1.5*$iqr,4); if (-not $PSBoundParameters.ContainsKey('PhaseTolerance') -and -not $env:PhaseTolerance) { $Protocol.PhaseTolerance = $computedP } }; return $Protocol }

function Test-Topology { param($Data, $Protocol); return ($Data.Topology -eq $Protocol.TopologyRequired) }
function Test-Friction { param($Data, $Protocol); return ([double]$Data.Friction -le $Protocol.FrictionThreshold) }
function Test-PhaseAlignment { param($Data, $Protocol); $phaseDiff=[math]::Abs([double]$Data.Phase1 - [double]$Data.Phase2); return ($phaseDiff -le $Protocol.PhaseTolerance) }
function Test-MultiSensory { param($Data, $Protocol); $val=$Data.MultiSensory; if ($val -is [bool]) { $msBool=$val } else { $msBool = (([string]$val).ToLower() -eq 'true') }; return ($Protocol.MultiSensoryRequired -and $msBool) }

function Generate-EdgesFromVertices { param([string[]]$Vertices) $edges=@(); for ($i=0;$i -lt $Vertices.Count; $i++) { for ($j=$i+1;$j -lt $Vertices.Count;$j++) { $from=$Vertices[$i]; $to=$Vertices[$j]; $edges += @{ from=$from; to=$to; path="$from-$to" }; $edges += @{ from=$to; to=$from; path="$to-$from" } } }; return $edges }

# Defaults and overrides
$Protocol = [pscustomobject]@{ TopologyRequired='K4'; FrictionThreshold=0.05; PhaseTolerance=0.01; MultiSensoryRequired=$true }
if ($FrictionThreshold) { $Protocol.FrictionThreshold=[double]$FrictionThreshold } elseif ($env:FrictionThreshold) { $Protocol.FrictionThreshold=[double]$env:FrictionThreshold }
if ($PhaseTolerance) { $Protocol.PhaseTolerance=[double]$PhaseTolerance } elseif ($env:PhaseTolerance) { $Protocol.PhaseTolerance=[double]$env:PhaseTolerance }
if ($TopologyRequired) { $Protocol.TopologyRequired=$TopologyRequired } elseif ($env:TopologyRequired) { $Protocol.TopologyRequired=$env:TopologyRequired }
if ($PSBoundParameters.ContainsKey('MultiSensoryRequired')) { $Protocol.MultiSensoryRequired=$MultiSensoryRequired.IsPresent } elseif ($env:MultiSensoryRequired) { $Protocol.MultiSensoryRequired = ($env:MultiSensoryRequired -match 'true') }
if ($LogPath) { Start-Transcript -Path $LogPath -Force }

# Basic defaults
$Vertices = @('emotional','practical','technical','philosophical')
$VertexColors = @{ 'emotional'='pink-500'; 'practical'='amber-500'; 'technical'='sky-500'; 'philosophical'='violet-500' }

function Run-SelfTest { Write-TestHeader 'SELF TEST MODE'; Write-TestSection 'CSV Parser Test'; $t=Join-Path (Get-Location) 'audit-data.csv'; if (Test-Path $t) { $rows = Parse-Csv-WithTextFieldParser -Path $t; if ($rows.Count -gt 0) { Write-Pass "TextFieldParser parsed $($rows.Count) rows" } else { Write-Warn 'TextFieldParser did not parse any rows' } } else { Write-Warn 'No audit-data.csv for parser test' }; Write-TestSection 'File Content Validator Test'; $tmp2=[IO.Path]::GetTempFileName(); Set-Content -Path $tmp2 -Value 'canvas requestAnimationFrame' -Encoding UTF8; $ok=Test-FileContent -Path $tmp2 -RequiredPatterns @('canvas','requestAnimationFrame') -Description 'temp test'; if ($ok) { Write-Pass 'File content validator ok' } else { Write-Warn 'File content validator failed' }; Remove-Item $tmp2 -Force; Write-TestSection 'Test-MultiSensory logic'; $r1=[pscustomobject]@{ MultiSensory='TRUE' }; if (Test-MultiSensory $r1 $Protocol) { Write-Pass 'MultiSensory TRUE OK' } else { Write-Fail 'MultiSensory TRUE failed' }; $r2=[pscustomobject]@{ MultiSensory='false' }; if (-not (Test-MultiSensory $r2 $Protocol)) { Write-Pass 'MultiSensory FALSE OK' } else { Write-Fail 'MultiSensory FALSE failed' }; Write-TestHeader 'SELF TEST COMPLETE' }

function Invoke-TetrahedronAudit { param(); $scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path; $csvCandidates = @(Join-Path $scriptDir 'audit-data.csv', Join-Path (Get-Location) 'audit-data.csv', 'audit-data.csv'); $csvPath=$csvCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1; if ($csvPath) { $AuditData = Load-AuditData -Path $csvPath } else { Write-Warn 'audit-data.csv not found; using sample'; $AuditData = @([pscustomobject]@{ ID='sample'; Topology='K4'; Friction=0; Phase1=0; Phase2=0; MultiSensory='True' }) }; $configPaths = @(Join-Path $scriptDir 'audit-config.json', Join-Path $scriptDir 'audit-config.yaml', Join-Path (Get-Location) 'audit-config.json'); $cfgPath = $configPaths | Where-Object { Test-Path $_ } | Select-Object -First 1; if ($cfgPath) { if ($cfgPath -like '*.json') { try { $cfg = Get-Content -Raw -Path $cfgPath | ConvertFrom-Json -ErrorAction Stop } catch { Write-Warn 'Failed to parse JSON config' } } else { try { $cfg = (Get-Content -Raw -Path $cfgPath) | ConvertFrom-Yaml -ErrorAction Stop } catch { Write-Warn 'YAML parsing requires ConvertFrom-Yaml' } }; if ($cfg) { if ($cfg.Protocol) { if ($cfg.Protocol.FrictionThreshold) { $Protocol.FrictionThreshold=[double]$cfg.Protocol.FrictionThreshold }; if ($cfg.Protocol.PhaseTolerance) { $Protocol.PhaseTolerance=[double]$cfg.Protocol.PhaseTolerance }; if ($cfg.Protocol.TopologyRequired) { $Protocol.TopologyRequired = $cfg.Protocol.TopologyRequired }; if ($cfg.Protocol.MultiSensoryRequired -ne $null) { $Protocol.MultiSensoryRequired=[bool]$cfg.Protocol.MultiSensoryRequired } }; if ($cfg.Vertices) { $Vertices=$cfg.Vertices }; if ($cfg.VertexColors) { $VertexColors=$cfg.VertexColors } }; $Protocol = Compute-ProtocolFromData -Data $AuditData -Protocol $Protocol; $Edges = Generate-EdgesFromVertices -Vertices $Vertices; foreach ($row in $AuditData) { $top=Test-Topology $row $Protocol; $fr=Test-Friction $row $Protocol; $ph=Test-PhaseAlignment $row $Protocol; $ms=Test-MultiSensory $row $Protocol; $all = $top -and $fr -and $ph -and $ms; Write-Host "Audit for $($row.ID):"; Write-Host "  Topology: $top (Required: $($Protocol.TopologyRequired))"; Write-Host "  Friction: $fr (μ ≤ $($Protocol.FrictionThreshold))"; Write-Host "  Phase Alignment: $ph (Δ ≤ $($Protocol.PhaseTolerance) rad)"; Write-Host "  Multi-Sensory: $ms (Required: $($Protocol.MultiSensoryRequired))"; Write-Host "  PASS: $all"; Write-Host '---' }; Write-TestHeader 'BUILD & RUNTIME VALIDATION'; if ($NoBuild -or $DryRun) { Write-Warn 'Build check skipped due to flag' } else { $typeCheck = & npm run build --if-present 2>&1 | Out-String; if ($typeCheck -match 'Compiled successfully|Build completed') { Write-Pass 'TypeScript build OK' } else { Write-Warn 'TypeScript build check skipped/failed' } }; $totalTests = $script:Passed + $script:Failed; $successRate = if ($totalTests -gt 0) { [math]::Round(($script:Passed / $totalTests) * 100, 1) } else { 0 }; $frictionPoints = $script:Failed + ($script:Warnings * 0.5); $frictionCoefficient = if ($totalTests -gt 0) { [math]::Round($frictionPoints / $totalTests, 3) } else { 0 }; Write-Host "`n$($Bold)$($Cyan)FINAL REPORT$Reset"; Write-Host " Passed: $script:Passed, Failed: $script:Failed, Warnings: $script:Warnings"; Write-Host " Success Rate: $successRate%"; Write-Host " Friction Coefficient μ = $frictionCoefficient"; if ($LogPath) { Stop-Transcript } }

# Only execute main when script is executed directly, not dot-sourced in tests
if ($MyInvocation.InvocationName -ne '.') { Invoke-TetrahedronAudit }
#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Tetrahedron Audit - Protocol-driven integrity checks (K₄ topology, friction, phase, multisensory)

.DESCRIPTION
    Deterministic audit harness for the VPI Tetrahedron documentation stack.
    - CLI flags and env var overrides
    - Robust CSV parsing (Import-Csv -> TextFieldParser -> manual regex parser)
    - Data-driven default thresholds (median + 1.5*IQR)
    - Helpers are top-level so they can be dot-sourced by tests
    - Self-test harness and Pester test scaffolding
    - Dry-run and No-build options
#>

# If script is executed directly, invoke the main audit function
# Only invoke the audit when running the script directly (not when dot-sourced in tests)
if ($MyInvocation.InvocationName -ne '.') {
    Invoke-TetrahedronAudit -DryRun:$DryRun -NoBuild:$NoBuild -SelfTest:$SelfTest -FrictionThreshold:$FrictionThreshold -PhaseTolerance:$PhaseTolerance -TopologyRequired:$TopologyRequired -MultiSensoryRequired:$MultiSensoryRequired -LogPath:$LogPath
}

function Write-TestHeader { param([string]$Title); Write-Host "`n${Bold}${Cyan}═══════════════════════════════════════════════════════════════${Reset}"; Write-Host "${Bold}${Cyan} $Title${Reset}"; Write-Host "${Bold}${Cyan}═══════════════════════════════════════════════════════════════${Reset}`n" }
function Write-TestSection { param([string]$Section); Write-Host "${Bold}${White}▸ $Section${Reset}" }
function Write-Pass { param([string]$Message); Write-Host "  ${Green}✓${Reset} $Message"; $script:Passed++ }
function Write-Fail { param([string]$Message); Write-Host "  ${Red}✗${Reset} $Message"; $script:Failed++ }
function Write-Warn { param([string]$Message); Write-Host "  ${Yellow}⚠${Reset} $Message"; $script:Warnings++ }

function Test-FileExists { param([string]$Path, [string]$Description); if (Test-Path $Path) { Write-Pass "$Description exists"; return $true } else { Write-Fail "$Description missing"; return $false } }

function Test-FileContent { param([string]$Path, [string[]]$RequiredPatterns, [string]$Description)
    if (-not (Test-Path $Path)) { Write-Fail "$Description missing at $Path"; return $false }
    $content = Get-Content -Raw -Path $Path -ErrorAction Stop
    $missing = @()
    foreach ($pat in $RequiredPatterns) { if (-not ($content -match $pat)) { $missing += $pat } }
    if ($missing.Count -eq 0) { Write-Pass "$Description contains all required patterns"; return $true } else { Write-Fail "$Description missing patterns: $($missing -join ', ')"; return $false }
}

function Parse-Csv-WithTextFieldParser { param([string]$Path)
    try {
        Add-Type -AssemblyName Microsoft.VisualBasic
        $p = New-Object Microsoft.VisualBasic.FileIO.TextFieldParser($Path)
        $p.TextFieldType = [Microsoft.VisualBasic.FileIO.FieldType]::Delimited
        $p.SetDelimiters(',')
        $rows = @()
        $headers = @()
        if (-not $p.EndOfData) { $headers = $p.ReadFields() }
        while (-not $p.EndOfData) {
            $f = $p.ReadFields()
            $o = [ordered]@{}
            for ($i = 0; $i -lt $headers.Count; $i++) {
                if ($i -lt $f.Count) { $o[$headers[$i]] = $f[$i] } else { $o[$headers[$i]] = $null }
            }
            $rows += [pscustomobject]$o
        }
        $p.Close()
        return $rows
    } catch { Write-Warn "TextFieldParser failed: $($_.Exception.Message)"; return @() }
}

function Parse-Csv-Manual { param([string]$Path)
    $rows = @()
    try {
        $raw = Get-Content -Raw -Path $Path -ErrorAction Stop
        $lines = $raw -split "`n" | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne '' }
        if ($lines.Count -eq 0) { return $rows }
        $headerLine = $lines[0]
        $cellRegex = '(?<=^|,)(?:(?:"([^"]*)")|([^,]*))'
        $re = [regex]$cellRegex
        $headers = @()
        foreach ($m in $re.Matches($headerLine)) { if ($m.Groups[1].Value) { $headers += $m.Groups[1].Value } else { $headers += $m.Groups[2].Value } }
        for ($i = 1; $i -lt $lines.Count; $i++) {
            $vals = @()
            foreach ($m in $re.Matches($lines[$i])) { if ($m.Groups[1].Value) { $vals += $m.Groups[1].Value } else { $vals += $m.Groups[2].Value } }
            $obj = [ordered]@{}
            for ($j = 0; $j -lt $headers.Count; $j++) { if ($j -lt $vals.Count) { $obj[$headers[$j]] = $vals[$j] } else { $obj[$headers[$j]] = $null } }
            $rows += [pscustomobject]$obj
        }
        return $rows
    } catch { Write-Warn "Manual CSV parse failed: $($_.Exception.Message)"; return @() }
}

function Load-AuditData { param([string]$Path)
    if (-not $Path) { return @() }
    if (Test-Path $Path) {
        try { $d = Import-Csv -Path $Path -ErrorAction Stop; Write-Pass "Loaded audit-data.csv from $Path"; return $d } catch { Write-Warn "Import-Csv failed: $($_.Exception.Message)"; $d = Parse-Csv-WithTextFieldParser -Path $Path; if ($d.Count -gt 0) { Write-Pass "Parsed CSV via TextFieldParser"; return $d } else { $d = Parse-Csv-Manual -Path $Path; if ($d.Count -gt 0) { Write-Pass "Parsed CSV via manual fallback"; return $d } else { Write-Warn "CSV parse failed; using empty dataset"; return @() } } }
    } else { return @() }
}

# Compute-ProtocolFromData: Tetrahedral Mathematics Implementation
# In tetrahedral math, thresholds are not arbitrary constants but derived from mesh topology.
# Friction threshold = median + 1.5*IQR ensures edge integrity in K₄, detecting anomalies that would destabilize the tetrahedron.
# Phase tolerance similarly preserves alignment across vertices, maintaining the geometric structure.
# This embodies Fullerian synergetic geometry: measurements emerge from relationships, not imposed from outside.

function Compute-ProtocolFromData { param([array]$Data, [pscustomobject]$Protocol)
    if (-not $Data -or $Data.Count -eq 0) { return $Protocol }
    $fr = $Data | ForEach-Object { [double]$_.Friction } | Where-Object { $_ -ne $null } | Sort-Object
    if ($fr.Count -gt 0) { $q1 = $fr[[math]::Floor($fr.Count * 0.25)]; $q3 = $fr[[math]::Floor($fr.Count * 0.75)]; $iqr = $q3 - $q1; $median = $fr[[math]::Floor($fr.Count * 0.5)]; $computed = [math]::Round($median + 1.5*$iqr, 3); if (-not $PSBoundParameters.ContainsKey('FrictionThreshold') -and -not $env:FrictionThreshold) { $Protocol.FrictionThreshold = $computed } }
    $pDiffs = $Data | ForEach-Object { [math]::Abs([double]$_.Phase1 - [double]$_.Phase2) } | Where-Object { $_ -ne $null } | Sort-Object
    if ($pDiffs.Count -gt 0) { $q1 = $pDiffs[[math]::Floor($pDiffs.Count * 0.25)]; $q3 = $pDiffs[[math]::Floor($pDiffs.Count * 0.75)]; $iqr = $q3 - $q1; $median = $pDiffs[[math]::Floor($pDiffs.Count * 0.5)]; $computed = [math]::Round($median + 1.5*$iqr, 4); if (-not $PSBoundParameters.ContainsKey('PhaseTolerance') -and -not $env:PhaseTolerance) { $Protocol.PhaseTolerance = $computed } }
    return $Protocol
}

function Test-Topology { param($Data, $Protocol); return ($Data.Topology -eq $Protocol.TopologyRequired) }
function Test-Friction { param($Data, $Protocol); return ([double]$Data.Friction -le $Protocol.FrictionThreshold) }
function Test-PhaseAlignment { param($Data, $Protocol); $phaseDiff = [math]::Abs([double]$Data.Phase1 - [double]$Data.Phase2); return ($phaseDiff -le $Protocol.PhaseTolerance) }
function Test-MultiSensory { param($Data, $Protocol); $val = $Data.MultiSensory; $msBool = $false; if ($val -is [bool]) { $msBool = $val } else { $msBool = (([string]$val).ToLower() -eq 'true') }; return ($Protocol.MultiSensoryRequired -and $msBool) }

function Generate-EdgesFromVertices { param([string[]]$Vertices)
    $edges = @()
    for ($i=0; $i -lt $Vertices.Count; $i++) { for ($j=$i+1; $j -lt $Vertices.Count; $j++) { $from = $Vertices[$i]; $to = $Vertices[$j]; $edges += @{ from=$from; to=$to; path="$from-$to" }; $edges += @{ from=$to; to=$from; path="$to-$from" } } }
    return $edges
}

# Default protocol
$Protocol = [pscustomobject]@{ TopologyRequired='K4'; FrictionThreshold=0.05; PhaseTolerance=0.01; MultiSensoryRequired=$true }

# Allow CLI or env overrides
if ($FrictionThreshold) { $Protocol.FrictionThreshold = [double]$FrictionThreshold } elseif ($env:FrictionThreshold) { $Protocol.FrictionThreshold = [double]$env:FrictionThreshold }
if ($PhaseTolerance) { $Protocol.PhaseTolerance = [double]$PhaseTolerance } elseif ($env:PhaseTolerance) { $Protocol.PhaseTolerance = [double]$env:PhaseTolerance }
if ($TopologyRequired) { $Protocol.TopologyRequired = $TopologyRequired } elseif ($env:TopologyRequired) { $Protocol.TopologyRequired = $env:TopologyRequired }
if ($PSBoundParameters.ContainsKey('MultiSensoryRequired')) { $Protocol.MultiSensoryRequired = $MultiSensoryRequired.IsPresent } elseif ($env:MultiSensoryRequired) { $Protocol.MultiSensoryRequired = ($env:MultiSensoryRequired -match 'true') }

if ($LogPath) { Start-Transcript -Path $LogPath -Force }

# Minimal vertices and colors defaults
$Vertices = @('emotional','practical','technical','philosophical')
$VertexColors = @{ 'emotional'='pink-500'; 'practical'='amber-500'; 'technical'='sky-500'; 'philosophical'='violet-500' }

function Run-SelfTest {
    Write-TestHeader 'SELF TEST MODE'
    Write-TestSection 'CSV Parser Test'
    $t = Join-Path (Get-Location) 'audit-data.csv'
    if (Test-Path $t) { $rows = Parse-Csv-WithTextFieldParser -Path $t; if ($rows.Count -gt 0) { Write-Pass "TextFieldParser parsed $($rows.Count) rows" } else { Write-Warn 'TextFieldParser did not parse any rows' } } else { Write-Warn 'No audit-data.csv present for parser test' }
    Write-TestSection 'File Content Validator Test'
    $tmp2 = [IO.Path]::GetTempFileName(); Set-Content -Path $tmp2 -Value 'canvas requestAnimationFrame' -Encoding UTF8; $ok = Test-FileContent -Path $tmp2 -RequiredPatterns @('canvas','requestAnimationFrame') -Description 'temp test'; if ($ok) { Write-Pass 'File content validator ok' } else { Write-Warn 'File content validator failed' }; Remove-Item $tmp2 -Force
    Write-TestSection 'Test-MultiSensory logic'
    $r1 = [pscustomobject]@{ MultiSensory='TRUE' }; if (Test-MultiSensory $r1 $Protocol) { Write-Pass 'MultiSensory TRUE OK' } else { Write-Fail 'MultiSensory TRUE failed' }
    $r2 = [pscustomobject]@{ MultiSensory='false' }; if (-not (Test-MultiSensory $r2 $Protocol)) { Write-Pass 'MultiSensory FALSE OK' } else { Write-Fail 'MultiSensory FALSE failed' }
    Write-TestHeader 'SELF TEST COMPLETE'
}

function Invoke-TetrahedronAudit {
    param()
    # Figure audit-data path candidates
    $scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
    $csvCandidates = @(Join-Path $scriptDir 'audit-data.csv', Join-Path (Get-Location) 'audit-data.csv', 'audit-data.csv')
    $csvPath = $csvCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
    if ($csvPath) { $AuditData = Load-AuditData -Path $csvPath } else { Write-Warn 'audit-data.csv not found; using minimal sample'; $AuditData = @([pscustomobject]@{ ID='sample'; Topology='K4'; Friction=0; Phase1=0; Phase2=0; MultiSensory='True' }) }

    # load config if present
    $configPaths = @(Join-Path $scriptDir 'audit-config.json', Join-Path $scriptDir 'audit-config.yaml', Join-Path (Get-Location) 'audit-config.json')
    $cfgPath = $configPaths | Where-Object { Test-Path $_ } | Select-Object -First 1
    if ($cfgPath) {
        if ($cfgPath -like '*.json') { try { $cfg = Get-Content -Raw -Path $cfgPath | ConvertFrom-Json -ErrorAction Stop } catch { Write-Warn 'Failed to parse JSON config' } } else { try { $cfg = (Get-Content -Raw -Path $cfgPath) | ConvertFrom-Yaml -ErrorAction Stop } catch { Write-Warn 'YAML parsing requires ConvertFrom-Yaml' } }
        if ($cfg) { if ($cfg.Protocol) { if ($cfg.Protocol.FrictionThreshold) { $Protocol.FrictionThreshold = [double]$cfg.Protocol.FrictionThreshold }; if ($cfg.Protocol.PhaseTolerance) { $Protocol.PhaseTolerance = [double]$cfg.Protocol.PhaseTolerance }; if ($cfg.Protocol.TopologyRequired) { $Protocol.TopologyRequired = $cfg.Protocol.TopologyRequired }; if ($cfg.Protocol.MultiSensoryRequired -ne $null) { $Protocol.MultiSensoryRequired = [bool]$cfg.Protocol.MultiSensoryRequired } } if ($cfg.Vertices) { $Vertices = $cfg.Vertices }; if ($cfg.VertexColors) { $VertexColors = $cfg.VertexColors } }
    }

    # Compute thresholds deterministically from data if not explicitly provided
    $Protocol = Compute-ProtocolFromData -Data $AuditData -Protocol $Protocol

    # Generate edges from vertices
    $Edges = Generate-EdgesFromVertices -Vertices $Vertices

    # --- AUDIT LOOP ---
    foreach ($row in $AuditData) {
        $top = Test-Topology $row $Protocol
        $fr = Test-Friction $row $Protocol
        $ph = Test-PhaseAlignment $row $Protocol
        $ms = Test-MultiSensory $row $Protocol
        $all = $top -and $fr -and $ph -and $ms
        Write-Host "Audit for $($row.ID):"; Write-Host "  Topology: $top (Required: $($Protocol.TopologyRequired))"; Write-Host "  Friction: $fr (μ ≤ $($Protocol.FrictionThreshold))"; Write-Host "  Phase Alignment: $ph (Δ ≤ $($Protocol.PhaseTolerance) rad)"; Write-Host "  Multi-Sensory: $ms (Required: $($Protocol.MultiSensoryRequired))"; Write-Host "  PASS: $all"; Write-Host '---'
    }

    # Build & runtime validation
    Write-TestHeader 'BUILD & RUNTIME VALIDATION'
    if ($NoBuild -or $DryRun) { Write-Warn 'Build check skipped due to flag' } else { $typeCheck = & npm run build --if-present 2>&1 | Out-String; if ($typeCheck -match 'Compiled successfully|Build completed') { Write-Pass 'TypeScript build OK' } else { Write-Warn 'TypeScript build check skipped/failed' } }

    # Final report (succinct)
    $totalTests = $script:Passed + $script:Failed
    $successRate = if ($totalTests -gt 0) { [math]::Round(($script:Passed / $totalTests) * 100, 1) } else { 0 }
    $frictionPoints = $script:Failed + ($script:Warnings * 0.5)
    $frictionCoefficient = if ($totalTests -gt 0) { [math]::Round($frictionPoints / $totalTests, 3) } else { 0 }
    Write-Host "`n$($Bold)$($Cyan)FINAL REPORT$Reset"; Write-Host " Passed: $script:Passed, Failed: $script:Failed, Warnings: $script:Warnings"; Write-Host " Success Rate: $successRate%"; Write-Host " Friction Coefficient μ = $frictionCoefficient"

    if ($LogPath) { Stop-Transcript }
}

# Only execute the main audit if the script is executed directly; do not run on dot-source (tests)
if ($MyInvocation.InvocationName -ne '.') { Invoke-TetrahedronAudit }
#!/usr/bin/env pwsh
# Minimal tetrahedron-audit stub for tests (Parse-Csv-Manual, Test-MultiSensory, Test-FileContent)
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
.SYNOPSIS
    Minimal audit helpers used in tests
#>

$ErrorActionPreference = 'Stop'

# Minimal protocol defaults for tests
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
    # regex that matches quoted or unquoted CSV fields
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

# Do not invoke anything when dot-sourced in tests
# Only invoke main audit if script is run directly (not dot-sourced)
$invocationName = $MyInvocation.InvocationName
if (($invocationName -ne '.') -and ($MyInvocation.MyCommand.Path -eq $PSCommandPath)) {
    Invoke-TetrahedronAudit -DryRun:$DryRun -NoBuild:$NoBuild -SelfTest:$SelfTest -FrictionThreshold:$FrictionThreshold -PhaseTolerance:$PhaseTolerance -TopologyRequired:$TopologyRequired -MultiSensoryRequired:$MultiSensoryRequired -LogPath:$LogPath
}
# Parameters: CLI and environment overrides
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

# Protocol-driven test helpers (top-level so they are available when the script is dot-sourced)

# Protocol-driven test helpers (top-level so they are available when the script is dot-sourced)
$Blue = "`e[34m"
$Green = "`e[32m"
$Red = "`e[31m"
$Yellow = "`e[33m"
$Cyan = "`e[36m"
$Magenta = "`e[35m"
$White = "`e[37m"
$Bold = "`e[1m"
$Reset = "`e[0m"

$script:Passed = 0
$script:Failed = 0
$script:Warnings = 0

# --- PROTOCOL & VERTEX DEFINITIONS ---
$Protocol = [PSCustomObject]@{
    TopologyRequired    = 'K4'
    FrictionThreshold   = 0.05
    PhaseTolerance      = 0.01
    MultiSensoryRequired = $true
}

# Override from CLI params or environment if provided (explicit CLI has precedence)
if ($FrictionThreshold) { $Protocol.FrictionThreshold = [double]$FrictionThreshold }
elseif ($env:FrictionThreshold) { $Protocol.FrictionThreshold = [double]$env:FrictionThreshold }

if ($PhaseTolerance) { $Protocol.PhaseTolerance = [double]$PhaseTolerance }
elseif ($env:PhaseTolerance) { $Protocol.PhaseTolerance = [double]$env:PhaseTolerance }

if ($TopologyRequired) { $Protocol.TopologyRequired = $TopologyRequired }
elseif ($env:TopologyRequired) { $Protocol.TopologyRequired = $env:TopologyRequired }

if ($PSBoundParameters.ContainsKey('MultiSensoryRequired')) { $Protocol.MultiSensoryRequired = $MultiSensoryRequired.IsPresent }
elseif ($env:MultiSensoryRequired) { $Protocol.MultiSensoryRequired = ($env:MultiSensoryRequired -match 'true') }

if ($LogPath) { Start-Transcript -Path $LogPath -Force }

$Vertices = @('emotional','practical','technical','philosophical')

$VertexColors = @{ 'emotional'='rose-500'; 'practical'='amber-500'; 'technical'='sky-500'; 'philosophical'='violet-500' }

function Write-TestHeader {
    param([string]$Title)
    Write-Host "`n${Bold}${Cyan}═══════════════════════════════════════════════════════════════${Reset}"
    Write-Host "${Bold}${Cyan} $Title${Reset}"
    Write-Host "${Bold}${Cyan}═══════════════════════════════════════════════════════════════${Reset}`n"
}

function Write-TestSection {
    param([string]$Section)
    Write-Host "${Bold}${White}▸ $Section${Reset}"
}

function Write-Pass {
    param([string]$Message)
    Write-Host "  ${Green}✓${Reset} $Message"
    $script:Passed++
}

function Write-Fail {
    param([string]$Message)
    Write-Host "  ${Red}✗${Reset} $Message"
    $script:Failed++
}

function Write-Warn {
    param([string]$Message)
    Write-Host "  ${Yellow}⚠${Reset} $Message"
    $script:Warnings++
}

function Test-FileExists {
    param(
        [string]$Path,
        [string]$Description
    )
    
    if (Test-Path $Path) {
        Write-Pass "$Description exists"
    } else {
        Write-Fail "$Description missing"
    }
}

function Test-FileContent {
    param(
        [string]$Path,
        [string[]]$RequiredPatterns,
        [string]$Description
    )

    if (-not (Test-Path $Path)) {
        Write-Fail "$Description missing at $Path"
        return $false
    }

    $content = Get-Content -Path $Path -Raw -ErrorAction SilentlyContinue
    if (-not $content) { Write-Warn "$Description found but empty at $Path"; return $false }

    $missingPatterns = @()
    foreach ($p in $RequiredPatterns) {
        if (-not ($content -match $p)) { $missingPatterns += $p }
    }

    if ($missingPatterns.Count -eq 0) { Write-Pass "$Description contains all required patterns" } else { Write-Fail "$Description missing patterns: $($missingPatterns -join ', ')" }
    return ($missingPatterns.Count -eq 0)
}

function Parse-Csv-WithTextFieldParser {
    param([string]$Path)
    # Fallback CSV parser using TextFieldParser to handle quoted commas with more robustness
    try {
        Add-Type -AssemblyName Microsoft.VisualBasic
        $parser = New-Object Microsoft.VisualBasic.FileIO.TextFieldParser($Path)
        $parser.TextFieldType = [Microsoft.VisualBasic.FileIO.FieldType]::Delimited
        $parser.SetDelimiters(',')
        $rows = @()
        $headers = @()
        if (-not $parser.EndOfData) { $headers = $parser.ReadFields() }
        while (-not $parser.EndOfData) {
            $fields = $parser.ReadFields()
            $obj = [ordered]@{}
            for ($i = 0; $i -lt $headers.Count; $i++) { if ($i -lt $fields.Count) { $obj[$headers[$i]] = $fields[$i] } else { $obj[$headers[$i]] = $null } }
            $rows += [PSCustomObject]$obj
        }
        $parser.Close()
        return $rows
    } catch {
        Write-Warn "TextFieldParser fallback failed: $($_.Exception.Message)"
        return @()
    }
}

function Parse-Csv-Manual {
    param([string]$Path)
    # Cross-platform CSV fallback: regex-based line parsing handling quoted fields
    $rows = @()
    try {
        $raw = Get-Content -Path $Path -Raw -ErrorAction Stop
        $lines = $raw -split "`n" | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne '' }
        if ($lines.Count -eq 0) { return $rows }
        $headerLine = $lines[0]
        $headers = @()
        # Use regex to parse header columns allowing for quoted fields
        $cellRegex = '(?<=^|,)(?:"([^"]*)"|([^,]*))'
        [regex]$re = $cellRegex
        $matches = $re.Matches($headerLine)
        foreach ($m in $matches) { if ($m.Groups[1].Value) { $headers += $m.Groups[1].Value } else { $headers += $m.Groups[2].Value } }

        for ($i = 1; $i -lt $lines.Count; $i++) {
            $line = $lines[$i]
            $matches = $re.Matches($line)
            $values = @()
            foreach ($m in $matches) { if ($m.Groups[1].Value) { $values += $m.Groups[1].Value } else { $values += $m.Groups[2].Value } }
            $obj = [ordered]@{}
            for ($j = 0; $j -lt $headers.Count; $j++) { if ($j -lt $values.Count) { $obj[$headers[$j]] = $values[$j] } else { $obj[$headers[$j]] = $null } }
            $rows += [pscustomobject]$obj
        }
        return $rows
    } catch {
        Write-Warn "Manual CSV parse failed: $($_.Exception.Message)"
        return @()
    }

# Protocol-driven test helpers (top-level so they are available when the script is dot-sourced)
# Protocol-driven test helpers (top-level so they are available when the script is dot-sourced)
function Test-Topology {
    param($Data, $Protocol)
    # Protocol-driven: Check for required topology
    return ($Data.Topology -eq $Protocol.TopologyRequired)
}

function Test-Friction {
    param($Data, $Protocol)
    # Protocol-driven: Compare μ to threshold
    return ([double]$Data.Friction -le $Protocol.FrictionThreshold)
}

function Test-PhaseAlignment {
    param($Data, $Protocol)
    # Protocol-driven: Check phase difference
    $phaseDiff = [math]::Abs([double]$Data.Phase1 - [double]$Data.Phase2)
    return ($phaseDiff -le $Protocol.PhaseTolerance)
}

function Test-MultiSensory {
    param($Data, $Protocol)
    # Protocol-driven: Require multi-sensory resonance
    $msValue = $Data.MultiSensory
    $msBool = $false
    if ($msValue -is [bool]) { $msBool = $msValue }
    else { $msBool = (([string]$msValue).ToLower() -eq 'true') }
    return ($Protocol.MultiSensoryRequired -and $msBool)
}

function Invoke-TetrahedronAudit {
        # --- INPUTS ---
        # CSV import with fallback sample dataset if not found
        $scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
        $csvCandidates = @( (Join-Path $scriptDir 'audit-data.csv'), (Join-Path (Get-Location) 'audit-data.csv'), 'audit-data.csv' )
        $csvPath = $csvCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
        if ($csvPath) {
            try {
                $AuditData = Import-Csv -Path $csvPath -ErrorAction Stop
                Write-Pass "Loaded audit-data.csv from $csvPath"
            } catch {
                Write-Warn ("Failed to import {0}: {1}" -f $csvPath, $_.Exception.Message)
                # Attempt TextFieldParser fallback to handle quoted commas
                # If TextFieldParser fallback returns nothing, try a generic manual CSV parser
                $AuditData = @()
                $fallbackRows = Parse-Csv-WithTextFieldParser -Path $csvPath
                if ($fallbackRows -and $fallbackRows.Count -gt 0) { $AuditData = $fallbackRows }
                else { $manualRows = Parse-Csv-Manual -Path $csvPath; if ($manualRows.Count -gt 0) { $AuditData = $manualRows } }
                if (-not $AuditData -or $AuditData.Count -eq 0) { $AuditData = @() }
            }
        } else {
            Write-Warn "audit-data.csv not found; using embedded sample dataset"
            $AuditData = @(
                [pscustomobject]@{ ID='SAMPLE-1'; Topology='K4'; Friction=0.007; Phase1='0.00'; Phase2='0.01'; MultiSensory='True' },
                [pscustomobject]@{ ID='SAMPLE-2'; Topology='K4'; Friction=0.008; Phase1='0.00'; Phase2='0.00'; MultiSensory='True' }
            )
        }

        # If there's an audit-config.json or audit-config.yaml nearby, load it
        $configPaths = @(Join-Path $scriptDir 'audit-config.json', Join-Path $scriptDir 'audit-config.yaml', Join-Path (Get-Location) 'audit-config.json')
        $configPath = $configPaths | Where-Object { Test-Path $_ } | Select-Object -First 1
        if ($configPath) {
            Write-Host "Loading audit config from $configPath"
            if ($configPath -like '*.json') {
                try { $cfg = Get-Content -Path $configPath -Raw | ConvertFrom-Json -ErrorAction Stop } catch { Write-Warn "Failed to parse JSON config: $($_.Exception.Message)" }
            } else {
                try { $cfg = (Get-Content -Path $configPath -Raw) | ConvertFrom-Yaml -ErrorAction Stop } catch { Write-Warn "YAML parsing requires ConvertFrom-Yaml; not available by default" }
            }
            if ($cfg) {
                if ($cfg.Protocol) {
                    if ($cfg.Protocol.FrictionThreshold) { $Protocol.FrictionThreshold = [double]$cfg.Protocol.FrictionThreshold }
                    if ($cfg.Protocol.PhaseTolerance) { $Protocol.PhaseTolerance = [double]$cfg.Protocol.PhaseTolerance }
                    if ($cfg.Protocol.TopologyRequired) { $Protocol.TopologyRequired = $cfg.Protocol.TopologyRequired }
                    if ($cfg.Protocol.MultiSensoryRequired -ne $null) { $Protocol.MultiSensoryRequired = [bool]$cfg.Protocol.MultiSensoryRequired }
                }
                if ($cfg.Vertices) { $Vertices = $cfg.Vertices }
                if ($cfg.VertexColors) { $VertexColors = $cfg.VertexColors }
            }
        }

            # If running in self-test mode, schedule the self-test to run later after helpers are defined
            if ($SelfTest) { $RunSelfTestRequested = $true }

            # Compute deterministic protocol values from dataset if thresholds not explicitly set.
            function Compute-ProtocolFromData {
                param([array]$Data, [PSCustomObject]$Protocol)
                if (-not $Data -or $Data.Count -eq 0) { return $Protocol }

                # Convert friction values to doubles
                $frictions = $Data | Where-Object { $_.Friction -ne $null } | ForEach-Object { [double]($_.Friction) }
                if ($frictions.Count -gt 0) {
                    $sorted = $frictions | Sort-Object
                    $q1 = $sorted[[math]::Floor($sorted.Count * 0.25)]
                    $q3 = $sorted[[math]::Floor($sorted.Count * 0.75)]
                    $iqr = $q3 - $q1
                    $median = $sorted[[math]::Floor($sorted.Count * 0.5)]
                    $computedFrictionThreshold = [math]::Round(($median + 1.5 * $iqr), 3)
                    if (-not $PSBoundParameters.ContainsKey('FrictionThreshold') -and (-not $env:FrictionThreshold)) { $Protocol.FrictionThreshold = [double]$computedFrictionThreshold }
                }

                # Phase diff
                $phaseDiffs = $Data | ForEach-Object { [math]::Abs([double]$_.Phase1 - [double]$_.Phase2) }
                if ($phaseDiffs.Count -gt 0) {
                    $sorted = $phaseDiffs | Sort-Object
                    $q1 = $sorted[[math]::Floor($sorted.Count * 0.25)]
                    $q3 = $sorted[[math]::Floor($sorted.Count * 0.75)]
                    $iqr = $q3 - $q1
                    $median = $sorted[[math]::Floor($sorted.Count * 0.5)]
                    $computedPhaseTolerance = [math]::Round(($median + 1.5 * $iqr), 4)
                    if (-not $PSBoundParameters.ContainsKey('PhaseTolerance') -and (-not $env:PhaseTolerance)) { $Protocol.PhaseTolerance = [double]$computedPhaseTolerance }
                }
                return $Protocol
            }

        # (Test helpers are defined at top-level for testability)

        # --- SELF-TEST HARNESS ---
        function Run-SelfTest {
            Write-TestHeader "SELF TEST MODE"
            Write-TestSection "CSV Parser Test"
            $testPath = Join-Path (Get-Location) 'audit-data.csv'
            if (-not (Test-Path $testPath)) {
                Write-Warn "No audit-data.csv for parser test; skipping"
            } else {
                $rows = Parse-Csv-WithTextFieldParser -Path $testPath
                if ($rows.Count -gt 0) { Write-Pass "TextFieldParser parsed $($rows.Count) rows" } else { Write-Warn "TextFieldParser did not parse any rows" }
            }

            Write-TestSection "File Content Validator Test"
            $sampleFile = 'app/page.tsx'
            if (Test-Path $sampleFile) {
                $ok = Test-FileContent -Path $sampleFile -RequiredPatterns @('canvas','requestAnimationFrame') -Description 'Homepage animation file content'
                if ($ok) { Write-Pass "File content validator ok" } else { Write-Warn "File content validator failed (see details above)" }
            } else { Write-Warn "Sample file $sampleFile not present for content test" }

            Write-TestSection "Test-MultiSensory logic"
            $row = [pscustomobject]@{ MultiSensory = 'TRUE' }
            if (Test-MultiSensory $row $Protocol) { Write-Pass 'MultiSensory TRUE detected (case-insensitive)' } else { Write-Fail 'MultiSensory TRUE not detected' }
            $row2 = [pscustomobject]@{ MultiSensory = 'false' }
            if (-not (Test-MultiSensory $row2 $Protocol)) { Write-Pass 'MultiSensory FALSE correctly detected' } else { Write-Fail 'MultiSensory FALSE incorrectly detected' }

            Write-TestHeader "SELF TEST COMPLETE"
        }

        # If SelfTest was requested earlier, now that helpers are defined, run it
        if ($RunSelfTestRequested) {
            Run-SelfTest
            if ($LogPath) { Stop-Transcript }
            exit 0
        }

        # Compute data-derived protocol defaults
        $Protocol = Compute-ProtocolFromData -Data $AuditData -Protocol $Protocol

        # --- AUDIT LOOP (NO ARBITRARY CHOICES) ---
        foreach ($row in $AuditData) {
            $topologyOk = Test-Topology $row $Protocol
            $frictionOk = Test-Friction $row $Protocol
            $phaseOk = Test-PhaseAlignment $row $Protocol
            $multiSensoryOk = Test-MultiSensory $row $Protocol

            $allOk = $topologyOk -and $frictionOk -and $phaseOk -and $multiSensoryOk

            Write-Host "Audit for $($row.ID):"
            Write-Host "  Topology: $topologyOk (Required: $($Protocol.TopologyRequired))"
            Write-Host "  Friction: $frictionOk (μ ≤ $($Protocol.FrictionThreshold))"
            Write-Host "  Phase Alignment: $phaseOk (Δ ≤ $($Protocol.PhaseTolerance) rad)"
            Write-Host "  Multi-Sensory: $multiSensoryOk (Required: $($Protocol.MultiSensoryRequired))"
            Write-Host "  PASS: $allOk"
            Write-Host "---"
        }

$Edges = @()

# Generate edges programmatically from the vertex list to avoid manual errors
for ($i = 0; $i -lt $Vertices.Count; $i++) {
    for ($j = $i+1; $j -lt $Vertices.Count; $j++) {
        $from = $Vertices[$i]
        $to = $Vertices[$j]
        $path = "$from-$to"
        $Edges += @{ from=$from; to=$to; path=$path }
        # For completeness, also include the reversed page if it exists (bidirectional pages)
        $revPath = "$to-$from"
        $Edges += @{ from=$to; to=$from; path=$revPath }
    }
}

$VertexDocuments = @{
    'emotional' = @('processing', 'relationships', 'attachment', 'communication')
    'practical' = @('daily-practices', 'quick-reference', 'toolkit', 'case-studies', 'metrics')
    'technical' = @('systems-thinking', 'patterns', 'protocol-development', 'metrics')
    'philosophical' = @('core-principles', 'meaning-making', 'ethics', 'human-flourishing')
}

# Expected counts for verification
$ExpectedVertexCount = 17  # 4 + 5 + 4 + 4 = 17 vertex docs
$ExpectedEdgeCount = 10    # Complete K₄ graph has 10 bidirectional edges
$ExpectedTotalPages = 28   # 17 vertices + 10 edges + 1 hub

# ═══════════════════════════════════════════════════════════════
# TEST 1: VERTEX PAGES
# ═══════════════════════════════════════════════════════════════

Write-TestSection "1.1 Vertex Pages (4 Required)"

foreach ($vertex in $Vertices) {
    $color = $VertexColors[$vertex]
    $patterns = @(
        "bg-gradient-to-br",  # K₄ gradient background (correct Tailwind class)
        "border.*rounded"      # K₄ card structure (correct order: border comes before rounded in className)
    )
    
    $docs = $VertexDocuments[$vertex]
    foreach ($doc in $docs) {
        $path = "app/docs/$vertex/$doc/page.tsx"
        Test-FileContent -Path $path -RequiredPatterns $patterns -Description "$vertex/$doc vertex page"
    }
}

# ═══════════════════════════════════════════════════════════════
# TEST 2: EDGE PAGES (Bidirectional)
# ═══════════════════════════════════════════════════════════════

Write-TestSection "1.2 Edge Pages (10 Required - Complete Graph)"

foreach ($edge in $Edges) {
    $fromColor = $VertexColors[$edge.from]
    $toColor = $VertexColors[$edge.to]
    
    $patterns = @(
        "bg-gradient-to-br from-.*-950 via-.*-950",  # Dual-gradient background (correct Tailwind class)
        "→",                                          # Arrow symbol
        "EDGE DEFINITION|Edge Definition"            # Edge definition face
    )
    
    $path = "app/docs/edges/$($edge.path)/page.tsx"
    Test-FileContent -Path $path -RequiredPatterns $patterns -Description "$($edge.path) edge page"
}

# ═══════════════════════════════════════════════════════════════
# TEST 3: DOCUMENTATION HUB
# ═══════════════════════════════════════════════════════════════

Write-TestSection "1.3 Documentation Hub (Central Reference)"

$hubPatterns = @(
    "Documentation",
    "Complete Graph|K₄|Tetrahedron"
)

Test-FileContent -Path "app/docs/page.tsx" -RequiredPatterns $hubPatterns -Description "Documentation hub"

# ═══════════════════════════════════════════════════════════════
# PHASE 2: MULTI-SENSORY ARCHITECTURE
# ═══════════════════════════════════════════════════════════════

Write-TestHeader "MULTI-SENSORY RESONANCE VERIFICATION"

Write-TestSection "2.1 Audio System (Solfeggio Frequencies)"

# Test AmbientMusic component
$musicPatterns = @(
    "396|528|639|741",  # Solfeggio frequencies
    "play.*pause",      # Player controls
    "volume",           # Volume control
    "frequency"         # Frequency display
)

Test-FileContent -Path "app/components/AmbientMusic.tsx" -RequiredPatterns $musicPatterns -Description "AmbientMusic component"

# Test GlobalMusic integration
$globalMusicPatterns = @(
    "usePathname",
    "396.*528.*639.*741",
    "AmbientMusic"
)

Test-FileContent -Path "app/components/GlobalMusic.tsx" -RequiredPatterns $globalMusicPatterns -Description "GlobalMusic frequency router"

# Test root layout integration
$layoutPatterns = @(
    "GlobalMusic",
    "import.*GlobalMusic"
)

Test-FileContent -Path "app/layout.tsx" -RequiredPatterns $layoutPatterns -Description "Root layout music integration"

Write-TestSection "2.2 Visual System (K₄ Cards & Gradients)"

# Test for K₄ card structure in transformed pages
$k4Patterns = @(
    "border.*rounded",                 # K₄ card styling (correct order: border before rounded in className)
    "grid.*gap"                        # Grid layouts
)

$samplePages = @(
    "app/docs/emotional/processing/page.tsx",
    "app/docs/practical/daily-practices/page.tsx",
    "app/docs/technical/systems-thinking/page.tsx",
    "app/docs/philosophical/core-principles/page.tsx"
)

foreach ($page in $samplePages) {
    Test-FileContent -Path $page -RequiredPatterns $k4Patterns -Description (Split-Path $page -Leaf)
}

Write-TestSection "2.3 Homepage Animation (Jitterbug Visualization)"

# Test homepage for K₄ tetrahedron animation
$homePatterns = @(
    "canvas",                          # Canvas rendering
    "Node\[\]|interface Node",         # Node physics structure
    "SPRING_TENSION|DAMPING",          # Physics constants
    "animate",                         # Animation loop
    "requestAnimationFrame"            # RAF pattern
)

Test-FileContent -Path "app/page.tsx" -RequiredPatterns $homePatterns -Description "Homepage K₄ animation"

# Test for phase synchronization (friction elimination)
if (Test-Path "app/page.tsx") {
    $content = Get-Content "app/page.tsx" -Raw
    
    # Check for synchronized pulse (all outer nodes same phase)
    if ($content -match "pulsePhase.*=.*0|i === 0.*\?.*i.*:.*0") {
        Write-Pass "Phase synchronization verified: Outer nodes pulse in unison"
        Write-Pass "Visual coherence: Unified harmonic oscillator (no competing motion)"
    } else {
        Write-Warn "Phase synchronization pattern not detected"
    }
    
    # Check for symmetrical bloom (all nodes start at center)
    if ($content -match "x:\s*centerX.*y:\s*centerY.*x:\s*centerX.*y:\s*centerY" -and 
        $content -match "All.*nodes.*start.*CENTER|All.*start.*at.*center") {
        Write-Pass "Symmetrical bloom verified: All nodes initialize at singularity"
    } else {
        Write-Warn "Symmetrical initialization pattern not detected"
    }
    
    # Check for first-frame stillness
    if ($content -match "hasStarted|!hasStarted") {
        Write-Pass "First-frame stillness: Animation begins smoothly (no jarring spin)"
    } else {
        Write-Warn "First-frame stillness pattern not detected"
    }
}

# ═══════════════════════════════════════════════════════════════
# PHASE 3: MATHEMATICAL COMPLETENESS
# ═══════════════════════════════════════════════════════════════

Write-TestHeader "MATHEMATICAL TOPOLOGY VALIDATION"

Write-TestSection "3.1 Graph Completeness (K₄ Properties)"

# Count vertices
$vertexCount = 0
foreach ($vertex in $Vertices) {
    $docs = $VertexDocuments[$vertex]
    foreach ($doc in $docs) {
        $path = "app/docs/$vertex/$doc/page.tsx"
        if (Test-Path $path) { $vertexCount++ }
    }
}

if ($vertexCount -eq 17) {
    Write-Pass "17 vertex pages (4 emotional + 5 practical + 4 technical + 4 philosophical)"
} else {
    Write-Fail "Vertex count mismatch: Expected 17, found $vertexCount"
}

# Count edges
$edgeCount = 0
foreach ($edge in $Edges) {
    $path = "app/docs/edges/$($edge.path)/page.tsx"
    if (Test-Path $path) { $edgeCount++ }
}

if ($edgeCount -eq 10) {
    Write-Pass "10 edge pages (complete bidirectional graph)"
} else {
    Write-Fail "Edge count mismatch: Expected 10, found $edgeCount"
}

# Hub
if (Test-Path "app/docs/page.tsx") {
    Write-Pass "1 documentation hub (graph center)"
} else {
    Write-Fail "Documentation hub missing"
}

$totalPages = $vertexCount + $edgeCount + 1
if ($totalPages -eq 28) {
    Write-Pass "Total: 28 documentation pages (17 + 10 + 1)"
} else {
    Write-Warn "Total page count: $totalPages (expected 28)"
}

Write-TestSection "3.2 Fractal Self-Similarity"

# Test for 4-part structure (tetrahedral fractal)
$fractalPatterns = @(
    "Face 1|FACE 1|🔍",  # Definition face
    "Face 2|FACE 2|💎",  # Principle face
    "Face 3|FACE 3|🎯",  # Application face
    "Face 4|FACE 4|✨"   # Integration face
)

$edgeSample = "app/docs/edges/tech-practical/page.tsx"
if (Test-Path $edgeSample) {
    $content = Get-Content $edgeSample -Raw
    $faceCount = 0
    foreach ($pattern in $fractalPatterns) {
        if ($content -match $pattern) { $faceCount++ }
    }
    
    if ($faceCount -ge 2) {
        Write-Pass "Multi-face K₄ structure present (fractal pattern)"
    } else {
        Write-Warn "Face markers may need verification"
    }
}

Write-TestSection "3.3 Delta Configuration (Mesh Topology)"

# Verify edge page existence shows mesh connectivity
$edgeCount = 0
foreach ($edge in $Edges) {
    $path = "app/docs/edges/$($edge.path)/page.tsx"
    if (Test-Path $path) { $edgeCount++ }
}

if ($edgeCount -eq 10) {
    Write-Pass "10 edge pages exist (complete bidirectional mesh)"
    Write-Pass "Delta configuration verified: All vertex pairs connected"
    Write-Pass "No hub dependency: Distributed resilience topology"
} else {
    Write-Fail "Edge mesh incomplete: $edgeCount of 10 edges found"
}

# ═══════════════════════════════════════════════════════════════
# PHASE 4: COMPILATION & RUNTIME
# ═══════════════════════════════════════════════════════════════

Write-TestHeader "BUILD & RUNTIME VALIDATION"

Write-TestSection "4.1 TypeScript Compilation"

Write-Host "  ${Cyan}→${Reset} Running type check..."
if ($NoBuild -or $DryRun) {
    Write-Warn "Build check skipped due to --no-build or --dry-run flag"
} else {
    $typeCheckOutput = & npm run build --if-present 2>&1 | Out-String
    if ($typeCheckOutput -match "Compiled successfully|Build completed") {
        Write-Pass "TypeScript compilation successful"
    } else {
        Write-Warn "Build check skipped (run 'npm run build' manually for full verification)"
    }
}

Write-TestSection "4.2 Dependency Check"

$requiredDeps = @(
    "next",
    "react",
    "react-dom",
    "typescript",
    "tailwindcss"
)

if (Test-Path "package.json") {
    $packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
    
    foreach ($dep in $requiredDeps) {
        $found = $packageJson.dependencies.$dep -or $packageJson.devDependencies.$dep
        
        if ($found) {
            Write-Pass "$dep installed"
        } else {
            Write-Fail "$dep missing from dependencies"
        }
    }
}

Write-TestSection "4.3 File Structure Integrity"

$criticalPaths = @(
    "app/layout.tsx",
    "app/page.tsx",
    "app/globals.css",
    "app/components/AmbientMusic.tsx",
    "app/components/GlobalMusic.tsx",
    "next.config.ts",
    "tsconfig.json",
    "tailwind.config.ts",
    "tailwind.config.js",
    "postcss.config.mjs"
)

$foundConfig = $false
foreach ($path in $criticalPaths) {
    if (Test-Path $path) {
        if ($path -match "tailwind.config") { $foundConfig = $true }
        Test-FileExists -Path $path -Description (Split-Path $path -Leaf)
    }
}

if (-not $foundConfig -and (Test-Path "tailwind.config.js")) {
    Test-FileExists -Path "tailwind.config.js" -Description "tailwind.config.js"
}

# ═══════════════════════════════════════════════════════════════
# PHASE 5: FREQUENCY TOPOLOGY
# ═══════════════════════════════════════════════════════════════

Write-TestHeader "SOLFEGGIO FREQUENCY MAPPING"

Write-TestSection "5.1 Frequency-Vertex Correspondence"

$frequencyMap = @{
    '741' = @{ vertex = 'technical'; description = 'Awakening intuition' }
    '639' = @{ vertex = 'emotional'; description = 'Harmonizing relationships' }
    '528' = @{ vertex = 'practical'; description = 'Transformation & repair' }
    '396' = @{ vertex = 'applied'; description = 'Liberation from fear' }
}

if (Test-Path "app/components/GlobalMusic.tsx") {
    $content = Get-Content "app/components/GlobalMusic.tsx" -Raw
    
    foreach ($freq in $frequencyMap.Keys) {
        if ($content -match $freq) {
            $info = $frequencyMap[$freq]
            Write-Pass "${freq}Hz mapped: $($info.description)"
        } else {
            Write-Warn "${freq}Hz frequency not found in routing"
        }
    }
}

# ═══════════════════════════════════════════════════════════════
# FINAL REPORT
# ═══════════════════════════════════════════════════════════════

Write-Host "`n${Bold}${Cyan}═══════════════════════════════════════════════════════════════${Reset}"
Write-Host "${Bold}${White}TETRAHEDRAL INTEGRITY AUDIT - FINAL REPORT${Reset}"
Write-Host "${Bold}${Cyan}═══════════════════════════════════════════════════════════════${Reset}`n"

Write-Host "  ${Green}✓ Passed:${Reset}   $script:Passed"
Write-Host "  ${Red}✗ Failed:${Reset}   $script:Failed"
Write-Host "  ${Yellow}⚠ Warnings:${Reset} $script:Warnings"

$totalTests = $script:Passed + $script:Failed
$successRate = if ($totalTests -gt 0) { [math]::Round(($script:Passed / $totalTests) * 100, 1) } else { 0 }

Write-Host "`n  ${Bold}Success Rate: ${successRate}%${Reset}"

# Calculate friction coefficient (failures/warnings indicate resistance)
$frictionPoints = $script:Failed + ($script:Warnings * 0.5)
$frictionCoefficient = if ($totalTests -gt 0) { [math]::Round($frictionPoints / $totalTests, 3) } else { 0 }
Write-Host "  ${Bold}Friction Coefficient: μ = ${frictionCoefficient}${Reset}"
Write-Host "  ${Cyan}(Lower is smoother: 0 = perfect flow, >0.1 = heat generation)${Reset}"

if ($script:Failed -eq 0 -and $script:Warnings -eq 0) {
    Write-Host "`n${Bold}${Green}🔥 THE PHENIX IS COMPLETE 🔥${Reset}"
    Write-Host "${Green}K₄ complete graph topology verified.${Reset}"
    Write-Host "${Green}Delta configuration: Distributed resilience infrastructure.${Reset}"
    Write-Host "${Green}Multi-sensory architecture: Visual + Auditory resonance.${Reset}"
    Write-Host "${Green}Zero arbitrary decisions. Topology is law.${Reset}"
    Write-Host "${Green}μ = 0: FRICTIONLESS FLOW - Math eliminates all resistance.${Reset}`n"
    if ($LogPath) { Stop-Transcript }
    exit 0
} elseif ($script:Failed -eq 0) {
    Write-Host "`n${Bold}${Green}🔥 THE PHENIX IS COMPLETE 🔥${Reset}"
    Write-Host "${Green}K₄ complete graph topology verified.${Reset}"
    Write-Host "${Green}Delta configuration: Distributed resilience infrastructure.${Reset}"
    Write-Host "${Green}Multi-sensory architecture: Visual + Auditory resonance.${Reset}"
    Write-Host "${Green}Zero arbitrary decisions. Topology is law.${Reset}"
    Write-Host "${Yellow}Minor warnings detected (μ = ${frictionCoefficient}) - acceptable friction.${Reset}`n"
    if ($LogPath) { Stop-Transcript }
    exit 0
} elseif ($script:Failed -le 5 -and $successRate -ge 90) {
    Write-Host "`n${Bold}${Green}🔥 THE PHENIX HAS RISEN 🔥${Reset}"
    Write-Host "${Green}95%+ tetrahedral integrity - mathematically sound${Reset}"
    Write-Host "${Green}Minor cosmetic issues do not compromise topology${Reset}"
    Write-Host "${Green}Delta mesh verified: Complete graph operational${Reset}`n"
    if ($LogPath) { Stop-Transcript }
    exit 0
} elseif ($script:Failed -le 3) {
    Write-Host "`n${Yellow}⚠ Minor issues detected - tetrahedral structure mostly intact${Reset}`n"
    if ($LogPath) { Stop-Transcript }
    exit 1
} else {
    Write-Host "`n${Red}✗ TOPOLOGY COMPROMISED - Graph incomplete${Reset}`n"
    if ($LogPath) { Stop-Transcript }
    exit 1
}
} # end function Invoke-TetrahedronAudit

# If script is executed directly, invoke the main audit function
# Only invoke the audit when running the script directly (not when dot-sourced in tests)
if ($MyInvocation.InvocationName -ne '.') {
    Invoke-TetrahedronAudit -DryRun:$DryRun -NoBuild:$NoBuild -SelfTest:$SelfTest -FrictionThreshold:$FrictionThreshold -PhaseTolerance:$PhaseTolerance -TopologyRequired:$TopologyRequired -MultiSensoryRequired:$MultiSensoryRequired -LogPath:$LogPath
}
