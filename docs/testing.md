# Playwright Smoke Tests & AI Stub

This document describes the Playwright smoke strategy and how to enable deterministic AI responses during PRs and local runs.

## Overview

- **Smoke tests**: Quick, reliable, small subset of E2E tests to validate core flows during PRs.
- **Deterministic AI**: AI calls are stubbed in PR runs via a Playwright route or (optionally) via the server `AI_STUB` toggle.

## Smoke Tests

We mark core tests with the `@smoke` tag in Playwright to run them faster in PRs. These include:

- [ai_flow.spec.ts](http://_vscodecontentref_/4) — verifies AI input and response flow (uses [PLAYWRIGHT_AI_STUB=true](http://_vscodecontentref_/5) in PRs)
- [non_ai_flow.spec.ts](http://_vscodecontentref_/6) — verifies weekly review and manual flows
- [neuro_onboarding.spec.ts](http://_vscodecontentref_/7) — verifies neuro onboarding reachability via the command palette
- [kids_rewards.spec.ts](http://_vscodecontentref_/8) — verifies KidsCorner and redeeming a reward tier
- [env_check.spec.ts](http://_vscodecontentref_/9) — checks for duplicate React in the runtime (prevents invalid hook calls)

### Import map & duplicate-React

If you must enable a CDN React for manual testing, ensure the CDN version exactly matches the package.json React version (same major/minor) to avoid mismatched renderers.

#### Runtime import map toggle (dev)

- For local development and manual tests you can enable the importmap by adding `?use_importmap=true` to the app URL, e.g., `http://localhost:3000/?use_importmap=true`. This injects the CDN importmap at runtime — useful for quick experiments but not recommended for automated tests.
  - TIP: For deterministic AI responses during local test runs, we added `applyAiStub(page, { force: true })` to `tests/e2e/ai_flow.spec.ts`. You can also call `applyAiStub(page, { force: true })` in other tests to avoid nondeterministic AI responses while running locally.

  - NOTE: Playwright-friendly guard — when `__PLAYWRIGHT_AI_STUB__` is set (via `/?use_ai_proxy=true` or `VITE_PLAYWRIGHT_AI_STUB=true`), the `useLiveSession` hook will not open a live vendor websocket, nor will it request the microphone. This prevents headless test runners from attempting to access hardware or upstream sockets; the hook returns a resolved, no-op session so UI states continue to work deterministically.

- Keep the toggle off for CI and Playwright runs — the `env_check.spec.ts` will fail if multiple React renderers are detected.

Run smoke tests locally with:

````pwsh
$env:PLAYWRIGHT_AI_STUB='true'
npx playwright test --grep @smoke --project=chromium

### Playwright CLI tips

- The Playwright CLI does not support a `-v` shorthand for verbose; use `--reporter=list` for list-style output, or `--reporter=html` to generate an HTML report you can open with `npx playwright show-report`.
- To run a single worker (helpful to reproduce timing-sensitive failures) use `-j 1` or `--workers=1`.
- If you rely on a running dev server (for faster iteration), set `PLAYWRIGHT_REUSE_EXISTING_SERVER=true` and run `npm run dev` in a separate terminal. The `playwright.config.ts` file reuses existing servers locally by default.

Example debug run (headed + single worker + list reporter):

```pwsh
$env:PLAYWRIGHT_REUSE_EXISTING_SERVER='true'
$env:PLAYWRIGHT_AI_STUB='true'
npx playwright test --grep @smoke --project=chromium --workers=1 --reporter=list --headed
````

### E2E pre-hydration & removed fallback

We pre-hydrate E2E flags (like `__E2E_FORCE_VIEW__` and `__PLAYWRIGHT_SKIP_DEV_BYPASS__`) prior
to React mounting in `src/main.tsx` to prevent seed timing races and make view
seeding deterministic. Because of this change we removed a previous UI
fallback which rendered Kids modules inside the `CommandCenter` for tests.

If you have tests that relied on that fallback, please update them to seed the
app state in localStorage or use the `?force_e2e_view=` query param. This keeps
tests deterministic while preserving a clean user experience.

### Troubleshooting: "No tests found"

- If you see "No tests found" while running `npx playwright test --grep @smoke`, first try the `--list` option to check which tests match your grep:

```pwsh
npx playwright test --list --grep "@smoke" --project=chromium
```

- In PowerShell, the `@` character is used for arrays & splatting, so passing `--grep @smoke` without quotes may cause PowerShell to treat it as a special token. To avoid this, always wrap grep expressions containing `@`, `*`, `$`, or other shell-sensitive characters in double quotes: `--grep "@smoke"`.
