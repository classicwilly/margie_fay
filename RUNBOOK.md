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
