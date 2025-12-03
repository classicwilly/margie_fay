#!/usr/bin/env pwsh
<#
.SYNOPSIS
  Simple Tetrahedron Audit Runner

.DESCRIPTION
  Runs basic tetrahedral integrity checks
#>

param(
    [switch]$DryRun,
    [switch]$NoBuild
)

$ErrorActionPreference = 'Stop'

# Colors
$Green = "`e[32m"; $Red = "`e[31m"; $Yellow = "`e[33m"; $Cyan = "`e[36m"; $Bold = "`e[1m"; $Reset = "`e[0m"
$script:Passed = 0; $script:Failed = 0

function Write-TestHeader { param([string]$Title); Write-Host "`n${Bold}${Cyan}═══════════════════════════════════════════════════════════════${Reset}"; Write-Host "${Bold}${Cyan} $Title${Reset}"; Write-Host "${Bold}${Cyan}═══════════════════════════════════════════════════════════════${Reset}`n" }
function Write-Pass { param([string]$Message); Write-Host "  ${Green}✓${Reset} $Message"; $script:Passed++ }
function Write-Fail { param([string]$Message); Write-Host "  ${Red}✗${Reset} $Message"; $script:Failed++ }

function Test-FileExists { param([string]$Path, [string]$Description); if (Test-Path $Path) { Write-Pass "$Description exists"; return $true } else { Write-Fail "$Description missing"; return $false } }

function Test-FileContent { param([string]$Path, [string[]]$RequiredPatterns, [string]$Description)
    if (-not (Test-Path $Path)) { Write-Fail "$Description missing at $Path"; return $false }
    $content = Get-Content -Raw -Path $Path -ErrorAction Stop
    $missing = @()
    foreach ($p in $RequiredPatterns) {
        if (-not ($content -match [regex]::Escape($p))) { $missing += $p }
    }
    if ($missing.Count -eq 0) { Write-Pass "$Description contains all required patterns"; return $true } else { Write-Fail "$Description missing patterns: $($missing -join ', ')"; return $false }
}

Write-TestHeader "TETRAHEDRON AUDIT"

if (-not $NoBuild) {
    Write-Host "${Bold}Build Validation${Reset}"
    Test-FileExists 'package.json' 'package.json'
    Test-FileExists 'tsconfig.json' 'tsconfig.json'
    Test-FileExists 'next.config.ts' 'next.config.ts'
    Test-FileExists 'hardhat.config.js' 'hardhat.config.js'
    Test-FileContent 'package.json' @('"next"', '"react"', '"typescript"') 'package.json'
    Test-FileContent 'tsconfig.json' @('"compilerOptions"', '"target"') 'tsconfig.json'
    Test-FileContent 'next.config.ts' @('NextConfig') 'next.config.ts'
    Test-FileContent 'hardhat.config.js' @('module.exports') 'hardhat.config.js'
    
    # Validate server and query layer enforce unique tetrahedron vertices
    Test-FileContent 'lib/supabase/queries.ts' @('Tetrahedron vertices must be unique', 'new Set(params.vertices)') 'unique vertices check in supabase/queries'
    Test-FileContent 'app/api/tetrahedrons/route.ts' @('Tetrahedron vertices must be unique', 'new Set(vertices)') 'unique vertices check in API route'
    Test-FileContent 'supabase/schema.sql' @('array(SELECT DISTINCT unnest(vertices))', 'array_length(vertices, 1) = 4') 'DB-level unique vertices constraint in schema'
    # Check for a PATCH route file inside app/api/tetrahedrons (accounts for [id] folder)
    $patchFound = $false
    Get-ChildItem -Path 'app/api/tetrahedrons' -Recurse -Filter 'route.ts' -ErrorAction SilentlyContinue | ForEach-Object {
        $content = Get-Content -Raw -LiteralPath $_.FullName -ErrorAction SilentlyContinue
        if ($content -match 'export\s+async\s+function\s+PATCH\s*\(') { $patchFound = $true }
    }
    if ($patchFound) { Write-Pass 'update route for tetrahedron exists (PATCH)' } else { Write-Fail 'update route for tetrahedron exists (PATCH) missing' }
    Test-FileContent 'lib/supabase/queries.ts' @('updateTetrahedron(', 'You must be one of the vertices') 'updateTetrahedron includes validation and typed update'

    if (Test-Path 'package.json') {
        try {
            $npmVersion = & npm --version 2>$null
            Write-Pass "npm available (v$npmVersion)"
            if (-not $DryRun) {
                Write-Host "Running npm run build..."
                $buildResult = & npm run build 2>&1
                if ($LASTEXITCODE -eq 0) {
                    Write-Pass "npm run build succeeded"
                } else {
                    Write-Fail "npm run build failed"
                }
            }
        } catch {
            Write-Fail "npm not available"
        }
    }
}

Write-Host "`n${Bold}Summary${Reset}"
$total = $script:Passed + $script:Failed
$successRate = if ($total -gt 0) { [math]::Round(($script:Passed / $total) * 100, 1) } else { 0 }
Write-Host "Total Tests: $total"
Write-Host "Passed: $script:Passed"
Write-Host "Failed: $script:Failed"
Write-Host "Success Rate: $successRate%"

if ($script:Failed -eq 0) {
    Write-Host "`n${Bold}${Green}🔥 THE PHENIX HAS RISEN 🔥${Reset}"
    Write-Host "${Green}Tetrahedral integrity verified${Reset}"
} elseif ($script:Failed -le 2) {
    Write-Host "`n${Yellow}⚠ Minor issues detected${Reset}"
} else {
    Write-Host "`n${Red}✗ Structure compromised${Reset}"
}