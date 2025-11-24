# PowerShell script to clean build artifacts, temporary logs, and test results

# Define paths to directories to be cleaned
$directoriesToClean = @(
    "dist",
    "node_modules",
    "coverage",
    "playwright-axe-results",
    "playwright-report",
    "test-results"
)

# Define paths to files to be cleaned
$filesToClean = @(
    "package-lock.json",
    "show-trace-run.log",
    "verify-output.log"
)

Write-Host "Starting cleanup of build artifacts and temporary files..."

# Clean directories
foreach ($dir in $directoriesToClean) {
    $fullPath = Join-Path $PSScriptRoot "\..\$dir"
    if (Test-Path $fullPath -PathType Container) {
        Write-Host "Removing directory: $fullPath"
        Remove-Item -Path $fullPath -Recurse -Force -ErrorAction SilentlyContinue
    } else {
        Write-Host "Directory not found (skipping): $fullPath"
    }
}

# Clean files
foreach ($file in $filesToClean) {
    $fullPath = Join-Path $PSScriptRoot "\..\$file"
    if (Test-Path $fullPath -PathType Leaf) {
        Write-Host "Removing file: $fullPath"
        Remove-Item -Path $fullPath -Force -ErrorAction SilentlyContinue
    } else {
        Write-Host "File not found (skipping): $fullPath"
    }
}

Write-Host "Cleanup complete."
