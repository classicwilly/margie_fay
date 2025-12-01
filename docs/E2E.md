# E2E Testing Guide

This document explains how to run Playwright E2E tests locally and in CI using a static preview server to avoid HMR-related flakiness.

## Run Local Tests (Preview server)

Build the app and run the static preview server, then run Playwright against it:

```powershell
pwsh -NoProfile -ExecutionPolicy Bypass -File ./scripts/run-e2e-preview.ps1 -port 3000 -project chromium -test tests/e2e
```

This script:

- Builds the app
- Starts a static `serve` server on `http://localhost:3000`
- Runs Playwright tests against that server
You can also use `npm run e2e:ci` to run the preview script from other platforms; non-Windows CI runners should use `npm run build && npm run preview` or the equivalent.

## Debugging (Headed + Trace)

For debugging a single test and recording trace & video:

```powershell
# In PowerShell (Windows)
$env:PLAYWRIGHT_REUSE_EXISTING_SERVER = 'true'
$env:PLAYWRIGHT_BASE_URL = 'http://localhost:3000'
npx playwright test tests/e2e/cockpit.spec.ts --project=chromium --headed --trace=on --workers=1 --reporter=list
```

Or use the PowerShell script above with the `-test` flag to run a single test.

## CI Recommendations

- Use `npm run build` and serve the static `dist` folder before running Playwright, so tests are not susceptible to HMR or dev server restarts.
- Run Playwright with `--workers=1` for deterministic resource usage, and increase `timeout` if necessary.
- Ensure the environment has sufficient memory; Chromium may crash in low-memory CI containers.
- Add `PWDEBUG=1` or `--trace=on` when debugging CI flakiness to capture traces and videos.

## If Tests Still Fail with BROWSER: disconnected

- Ensure the preview server is running on the matching port (default: 3000).
- If the browser crashes (disconnected) frequently, set Playwright to run with these launch args in `playwright.config.ts`:
  - `--no-sandbox`
  - `--disable-setuid-sandbox`
  - `--disable-dev-shm-usage`
  - `--disable-gpu`
  - `--disable-software-rasterizer`

- Additionally, capture the `video.webm` and the trace to debug the exact crash point.

## Notes

- Tests are instrumented to avoid unexpected page closures by overriding `window.close()` and `window.open()` when E2E seed is present.
- The tests also persist snapshots to `localStorage` periodically for postmortem analysis in case the page unloads mid-test.
