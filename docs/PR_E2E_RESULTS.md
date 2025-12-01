# E2E Preview Run Results — Cockpit Stability Investigation

## Summary

- Run date: Nov 29, 2025 (performed from local workspace)
- Branch: `feature/e2e-stability-cockpit`
- Test run method: Playwright test run against built `dist` served by static preview server.
- Notable failing test observed: `tests/e2e/cockpit.spec.ts` — interruption due to page/context lifecycle events.


## Key findings

- Playwright trace and artifacts exist under `test-results/.playwright-artifacts-0` and `playwright-report/data`.
- `trace` shows `BrowserContext.pageClosed` event and a subsequent `newPage` created via the test's recovery code.
- `PAGE: closed` events are frequent and sometimes followed by `BROWSER: disconnected` in console logs.
- Emoji CDN requests to `cdn.jsdelivr.net/gh/googlefonts/noto-emoji` are blocked in the test environment, leading to `ERR_BLOCKED_BY_ORB` — the tests avoid reliance on external images using `data-testid` and seeded state.


## Artifacts (local paths)

- Playwright trace (raw): `test-results/.playwright-artifacts-0/traces/8d194f2f5447ea2b23e4-e6ac3a1f7165a8ccdda8.trace` (zlib compliance — binary)
- Saved videos/screenshots: `test-results/.playwright-artifacts-0/*.webm` and `playwright-report/data/*.webm` / `*.png`
- Playwright HTML report: `playwright-report/index.html` (browse or upload to CI) — contains zipped trace(s).


## Root causes & hypotheses

- Some page closures are caused by the app or environment (devserver HMR or redirect), but the CI preview server reduces HMR noise.
- `BROWSER: disconnected` often indicates a native browser crash or the Playwright runner forcibly closing the browser due to environment issues. We’ve already set `dumpio: true` in `playwright.config.ts` so the browser stderr/stdout should be captured.
- The test's `page.on('close')` handler attempted `page.context().newPage()` in the original version which sometimes fails when the context is closed; we've fixed this to create a new `browser.newContext()` backup to avoid `Protocol error (Target.createTarget): Not supported`.


## Next steps & recommendations

1. Use `e2e:preview` in CI so the E2E suite runs against a static `dist` server.
2. Always collect Playwright artifacts: `trace`, `video`, `screenshot`, `logs` and ensure `dumpio` is enabled (already set in `playwright.config.ts`).
3. Make `ensurePageOpen` more robust: if the context was closed, create a new context (done in the test) and re-seed `__WONKY_TEST_INITIALIZE__` and `__WONKY_TEST_BEHAVIOR__` flags.
4. Add the global `safeClick`/`safeFill` helpers (already used in `cockpit.spec.ts`) to `tests/e2e/helpers/retryHelpers.ts` and standardize usage across the test suite.
5. Consider increasing Playwright retry counts in CI or re-run only impacted tests when `BROWSER: disconnected` occurs (this helps with flakiness in resource-limited CI infra).


## Conclusion

The changes in `feature/e2e-stability-cockpit` (page close backup context + safer `ensurePageOpen` function and `cockpit.spec.ts` syntax/structure fixes) help reduce failures caused by a closed context, but more telemetry, retriable test behavior, and additional crash capture is recommended to resolve persistent `BROWSER: disconnected` events.

If you’d like, I can open a PR draft with this summary, add a `tests/e2e/helpers/retryHelpers.ts` export, and add a CI suggestion to run E2E via `npm run e2e:preview` with artifacts uploaded for traces and videos.
