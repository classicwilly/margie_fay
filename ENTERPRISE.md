# Enterprise Readiness Checklist (11/10)

This document summarizes practical steps to make `wonky-sprout-os` enterprise-ready. Use it as a checklist and the basis for a secure, observable, and highly available deployment.

## ✅ Developer Experience
- [ ] Strict TypeScript rules: enable `strict: true` and `noImplicitAny` in `tsconfig.json`.
- [ ] Linting & formatting: maintain `eslint` and `prettier` with CI-enforced checks.
- [ ] Repo tooling: add helpful `npm scripts` like `ci:build` and `test:coverage` (already included).

## 🔒 Security
- [ ] Secrets management: use environment-only secrets (VAULT, GitHub Secrets, etc.); add `.env.example` (done) and DO NOT commit secrets.
- [ ] Supply chain security: Dependabot is enabled (`.github/dependabot.yml`). Add CodeQL scanning for vulnerability detection (done in CI).
- [ ] Authentication: integrate authentication (OAuth / JWT) and protect endpoints. Centralize service-to-service identity.

## ⚙️ CI / CD
- [x] Build, lint, test in CI (`.github/workflows/ci.yml` updated).
- [x] Cache node modules for faster CI.
- [ ] Add release workflow that builds artifacts and tags releases.

## 🔍 Observability & Testing
- [x] Telemetry backend shim for Sentry (use `TELEMETRY_BACKEND=sentry` and `SENTRY_DSN` environment variable).
- [x] Unit + integration tests using Vitest & React Testing Library.
- [ ] End-to-end testing: adopt Playwright or Cypress and add E2E job to CI.

## 🐳 Containerization & Deployment
- [x] Dockerfile added for multi-stage build and production nginx hosting.
- [x] Proxy-ready `nginx.conf` and `.dockerignore` included.
- [ ] Add Kubernetes / Cloud Run manifest for production deployment.

## 📈 Monitoring & Resilience
- [ ] Metrics: Expose and export metrics (Prometheus client) and instrument performance critical paths.
- [ ] Runbook & SLOs: document acceptable error budget & escalation paths.

## 🧾 Compliance & Data Handling
- [ ] Data retention and PII handling — centralize PII handling in `AIProtectionProvider` and log privacy events.
- [ ] Add policies for data deletion and redaction.

If you'd like, I can implement the missing items one-by-one. For example: integrate Playwright E2E and add a `staging` kubernetes manifest for automatic deploys.
