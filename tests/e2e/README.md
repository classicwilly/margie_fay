# E2E Test Helpers & Playwright Fixtures

This directory contains test fixtures and helpers for Playwright e2e tests. The
key goals:

- Provide deterministic seeded app state via a per-worker storage key.
- Allow tests to force the app view (via `__E2E_FORCE_VIEW__`) early in page
  init so we can assert views in a deterministic manner.
- Add retry/wait helpers to make navigation and menu clicks resilient in CI and
  multi-worker runs.

## Worker storage keys

- The Playwright fixture `storageKey` gives each worker a unique key used to
  seed the app state in `localStorage`. That avoids cross-worker collisions
  when multiple tests run in parallel.

- The fixture is implemented in `tests/e2e/playwright-fixtures.ts` and will be
  injected into pages via `page.addInitScript` so tests (and host app) can see
  `window.__E2E_STORAGE_KEY__` early.

How to use:

1. If you opt into the fixture globally, set the env var prior to running tests:

```powershell
# PowerShell example: run Playwright and enable opt-in fixture mapping
$env:WONKY_E2E_EXTEND_TEST = 'true'; npm run e2e
```

2. If you prefer opt-in per-test, import the extended `test` from the fixture
  module in a single test file (this does not require the alias):

```ts
import { test, expect } from '@playwright/test';
```

When the opt-in global shim is enabled, tests can import from
`@playwright/test` — the shim replaces that module with `playwright-fixtures`
so you don't have to edit many tests.

## Forcing views and seeding state

The app reads `window.__E2E_FORCE_VIEW__` early to force a view — this avoids
having to navigate through UI flows just to get to the relevant screen.

Example usage in a test (seed state and set forced view):

```ts
await page.addInitScript((key) => {
  try { window.localStorage.removeItem(key as string); } catch (e) { /* ignore */ }
  try { (window as any).__E2E_FORCE_VIEW__ = 'willows-dashboard'; } catch (e) { /* ignore */ }
}, storageKey);

// Then seed a full state so Willow shows reward-store and gem-collector modules
await page.addInitScript((seedKey) => {
  const state = { dashboardType: 'willow', view: 'willows-dashboard', initialSetupComplete: true, willowDashboardModules: [ 'reward-store-module', 'willow-gem-collector-module' ] };
  window.localStorage.setItem(seedKey as string, JSON.stringify(state));
}, storageKey);

await page.reload({ waitUntil: 'load' });
```

## E2E / App pre-hydration (new)

To make view seeding deterministic and eliminate timing races, we now pre-hydrate
`__E2E_FORCE_VIEW__` and `__PLAYWRIGHT_SKIP_DEV_BYPASS__` before React mounts via
the `src/main.tsx` pre-hydration logic. This avoids the need for an app-level
UI fallback that previously rendered child dashboard modules inside the
`CommandCenter` — that fallback has been intentionally removed to keep the UI
consistent. If your tests relied on that fallback, update them to seed the
app's `localStorage` or use `?force_e2e_view=` when navigating to the app.

## Retry helpers

- `retryClick(locator, opts)` — retry visible + click for navigation; useful when
  menu open animations or network delays cause intermittent flakiness.
- `ensureAppView(page, view)` — attempts to make the app show a particular
  view by clicking the child/dashboard nav or the system menu.

Use these for flaky steps such as opening the command center or system menus.

## Notes & opt-in global behavior

- We added a small runtime shim (`tests/e2e/register_shim.ts`) that can be
  toggled with `WONKY_E2E_EXTEND_TEST=true` to optionally make
  `@playwright/test` resolve to the local fixture module. This avoids having to
  update imports in all tests at once — it's opt-in and reversible.

### Tracing specific tests

If you see flakiness in specific tests you can capture a trace on the first
retry to help debugging without capturing traces every run. Two environment
variables affect this behavior:

- `WONKY_E2E_TRACE_TESTS` — force test-level tracing for tests by name.
- `CI` — when combined with Playwright's `retry` setting, tracing will start on
  the first retry for tests configured to do so.

Example (PowerShell) to opt-in tracing for flaky tests locally:

```powershell
$env:WONKY_E2E_EXTEND_TEST = 'true';
$env:WONKY_E2E_TRACE_TESTS = 'true';
npm run e2e
```

---
If you want me to make the global opt-in on by default (or convert more tests
to use the new fixtures), tell me which mode you prefer and I can update the
`package.json` scripts accordingly. Note: currently the repo defaults to
explicit `import { test } from './playwright-fixtures'` for stability in CI.
The `WONKY_E2E_EXTEND_TEST` alias is supported for local experimentation but
is not enabled by default in CI.
