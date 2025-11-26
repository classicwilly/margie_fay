# Runbook (oncall)

## Symptoms and Actions

- Frontend returns 500 or fails loading assets
  - Check CDN & container image — redeploy the last good image.
  - Check logs for `telemetryBackend` entries and Sentry events.

- AI Service returns errors
  - Check API key validity and quotas for the `@google/genai` integration.
  - Retry with backoff; throttle in the UI if necessary.

## Escalation

- Contact the engineering lead and create a GitHub issue with logs and steps to reproduce.

## Import canonicalization & context-mismatch rollbacks

If an accidental import to `contexts/` (root) or `components/` slips into a PR and causes a provider mismatch or test failure:

1. Run `npm run lint` locally — the `no-restricted-imports` rule will catch disallowed imports.
2. If the PR is already merged, revert the merge and open a follow-up to swap imports to `src/contexts` and `src/components`.
3. Use the codemod script `transforms/replace-root-context-imports.js` (not present yet) to rewrite imports in bulk, then run the test suite.
4. Re-run `npm test` and confirm CI is green; verify UI areas relying on AppState and AIProtection contexts (e.g., AI features) still behave as expected.

## AI Key & Proxy (recommended)

For production, **never** put the Gemini API key in client bundles. Use environment variables on the server or a serverless backend.

- Local dev (quick): set `VITE_GEMINI_API_KEY` in `.env.local` (not for production).
- Preferred: deploy serverless function (`functions/aiProxy`) or use `server.js` proxy — set `GEMINI_API_KEY` in the host environment.
- Configure `GEMINI_MODEL` to your desired model (default `gemini-2.5-flash-preview-09-2025`).

Example env variables (server/CI):

```bash
GEMINI_API_KEY=YOUR_API_KEY
GEMINI_MODEL=gemini-2.5-flash-preview-09-2025
```

When running the frontend in dev with the server proxy, start the Express server and Vite using:

```bash
npm run start:server
npx concurrently "npm run start:server" "npm run dev"
```

## Production checklist

- Ensure you set `GEMINI_API_KEY` as a secret in the host environment (Cloud Run Secret Manager, GitHub Secrets, etc.).
- Provide `REDIS_URL` for a shared cache across instances.
- Configure `ALLOWED_ORIGINS` to limit CORS.
- Set up `SENTRY_DSN` for error telemetry and monitoring.
- Set graceful autoscaling limits in Cloud Run: set concurrency & CPU/Memory based on load.
- For persistent memorials and file uploads, use a managed DB (Firestore / Postgres) and Cloud Storage (GCS) for images.

### Frontline operations

- To view logs: `gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=wonky" --project=$PROJECT_ID` (GCP)
- To re-deploy: push a new image and deploy with `gcloud run deploy` or use GitHub Actions / Cloud Build automations.

### Monitoring & Observability

- Errors: configure Sentry and watch the Sentry project for error rates and transaction sampling.
- Metrics: The app exposes a `/metrics` endpoint; configure Prometheus or Cloud Monitoring to scrape it and set alerts for errors, latency, and rate-limit breaches.

### Production smoke test

- Check server health: `curl -sS https://<service-url>/healthz` should return a JSON with {status: 'ok'}.
- Check readiness: `curl -sS https://<service-url>/ready` should return 200 if the instance is ready.
- Test AI route (requires a GEMINI_API_KEY):

```
curl -sS -X POST https://<service-url>/api/gemini -H 'Content-Type: application/json' -d '{"prompt":"Say hello, Grandma!"}'
```

## Test-only hooks & E2E stability guidance ✅

To keep E2E tests deterministic and maintain CI stability around time-based UI flows (for example, the E-Stop / Context Restore modal), this repository exposes several test-only flags and events. These are intended for CI & E2E test use only and should not affect production behavior.

- `__WONKY_CONTEXT_RESTORE_FORCE_COMPLETE__` — boolean.
  When set to `true` in test runs, the Context Restore modal skips internal timers
  and marks itself complete.
- Event: `wonky:context-restore-force-complete`.
  Dispatch this event while the modal is open to apply the forced-complete behavior
  immediately. This is useful to avoid UI timing races.
- `__E2E_FORCE_VIEW__` / `__WONKY_TEST_FORCE_VIEW__` — used to seed a specific app view (e.g., `workshop`) during E2E runs.

Best practices for tests

- Prefer `data-workshop-testid` attributes for Playwright selectors.
  Use the helper `byWorkshopOrCockpitTestId` in
  `tests/e2e/helpers/locators.ts` to prefer the workshop id and fall back to
  legacy `data-testid` when needed.
- Use `retryClick`, `retryCheck`, and `waitForModalContent` from
  `tests/e2e/helpers/retryHelpers.ts` when interacting with elements that might
  mount inside portals or experience transient delays.
- Keep test-only flags and events contained to `test` runs only; do not use them to change production logic.

When updating UI or timers that affect flows like the Context Restore modal, follow these three key steps:

1. Add `data-workshop-testid` attributes to any element Playwright relies on.
   Examples: navigation buttons, decompress timer displays, checkboxes, restore controls.
2. Update tests to prefer `byWorkshopOrCockpitTestId('name')` for selector stability.
3. Use `retryClick`/`retryCheck` helpers in tests for interactions where UI may be delayed or inconsistent.

> Tip: Keep the test-only hooks until you see multiple consecutive, stable E2E runs without them.

## Naming policy & `verify-naming` exceptions ⚠️

The repository enforces a kebab-case filename policy via `scripts/verify-naming.mjs`.
To reduce churn, we intentionally allow PascalCase filenames in selected directories.
These directories typically contain React components, contexts, hooks, services, or views.

- `components/`
- `src/components/`
- `src/contexts/`
- `src/views/`
- `src/modules/`
- `src/services/`
- `src/hooks/`
- `src/sops/`
- `src/integrations/`
- `src/utils/`

This exception is intentional to limit one-off renames and avoid a repo-wide migration in a single PR.
If you plan a full kebab-case migration, follow this plan:

1. Update `scripts/verify-naming.mjs` to remove exceptions or configure directories to your desired target.
2. Use `transforms/rename-to-kebab-case.cjs` in dry-run mode to preview the changes.
   Apply changes in small batches.
3. Run the review/QA cycle:

- `npm run lint`
- `npm run test`
- `npx playwright test` (full suite)

When committing large rename PRs:

- Break changes into small, reviewable PRs.
- Verify import rewrites.
- Run the full lint/test/Playwright suite before merging.
