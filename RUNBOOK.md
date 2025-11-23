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

