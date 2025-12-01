param(
  [string]$port = '3000',
  [string]$project = 'chromium',
  [string]$test = 'tests/e2e'
)

Write-Host "Build app..."
npm run build

Write-Host "Starting preview server on port $port..."
$job = Start-Job -ScriptBlock { npx serve -s dist -l $using:port }
Start-Sleep -Seconds 4

Write-Host "Running Playwright tests against http://localhost:$port ..."
$env:PLAYWRIGHT_REUSE_EXISTING_SERVER = 'true'
$env:PLAYWRIGHT_BASE_URL = "http://localhost:$port"
$npx = npx playwright test $test --project=$project --reporter=list --trace=on --workers=1

Write-Host "Stopping preview server..."
Stop-Job -Job $job | Out-Null
Remove-Job -Job $job | Out-Null
Write-Host "E2E preview run finished."