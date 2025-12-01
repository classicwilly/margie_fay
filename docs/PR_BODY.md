# PR: E2E Stability Improvements — Cockpit Test

## Summary

- Branch: `feature/e2e-stability-cockpit`
- Goal: Improve Playwright E2E stability for the `cockpit.spec.ts` suite by reducing interruptions due to page/context closures and browser disconnects.

## Key changes

- Create `GoogleEmoji` component and use `data-emoji-symbol` to avoid CDN-driven selection.
- Rebranded `Grandma` to `The Mood` and added compatibility shim.
- Add robust `page.on('close')` handling: use `browser.newContext()` for backup reads when context closed.
- Add `safeClick`, `safeFill`, `ensurePageOpen` helpers in `cockpit.spec.ts` and refactor to use these helpers.
- Extracted shared `pageRecovery` helpers (`tests/e2e/helpers/pageRecovery.ts`) and updated `cockpit.spec.ts` to import them.
- Added guards to avoid creating new contexts or pages if the browser is disconnected, and centralized recovery logic.
- Add preview-run `scripts/run-e2e-preview.ps1` and `npm run e2e:preview` for CI preview-run stability.

## Test results & artifacts

- Artifacts are located under `test-results` and `playwright-report` — view `playwright-report/index.html` to open zipped traces.
- Example failing traces: `test-results/.playwright-artifacts-0/traces/8d194f2f5447ea2b23e4-e6ac3a1f7165a8ccdda8.trace` (cockpit test).

### Recommended follow-ups
1. Run the entire E2E suite against `e2e:preview` in CI with artifact collection enabled.
1. Add `tests/e2e/helpers/retryHelpers.ts` and standardize usage across the suite.
1. Configure CI to re-run failed tests using Playwright retries if `BROWSER: disconnected` occurs.
1. For persistent `BROWSER: disconnected`, collect `dumpio` logs and hardware information in the job's artifacts for debugging.

### How to test locally
1. Build and run preview server:
```powershell
pwsh -NoProfile -ExecutionPolicy Bypass -File ./scripts/run-e2e-preview.ps1 -port 3000 -project chromium -test tests/e2e
```
1. Run a single test with headless trace and video retained:
```powershell
$env:PLAYWRIGHT_REUSE_EXISTING_SERVER='true'
$env:PLAYWRIGHT_BASE_URL='http://localhost:3000'
npx playwright test tests/e2e/cockpit.spec.ts --project=chromium --trace=on --headed --workers=1 --reporter=list
```

---

I can create the PR draft from this branch and add reviewers if you want. If you'd prefer, I can also run the full E2E suite and attach traces to the PR (if the job runs on CI). Let me know which you'd prefer.
