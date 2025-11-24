# Production deployment guide

This repository can be deployed to Cloud Run, a container-based K8s platform, or to Firebase Hosting + Functions. This document focuses on Cloud Run, which provides a simple managed container platform with autoscaling.

## Key production requirements

- Store secrets in a secrets manager (GCP Secret Manager, GitHub Secrets, AWS Secrets Manager).
- Use a server-side `GEMINI_API_KEY` - never ship it to the client.
- Provide `REDIS_URL` or some managed Redis for caching in multi-instance deployments.
- Use `ALLOWED_ORIGINS` for CORS to restrict client domains.
- Use Sentry (optional) for error telemetry: set `SENTRY_DSN` in secrets.
- Use `GEMINI_MODEL` to pin the model.

## Example Required Environment variables

- `GEMINI_API_KEY` (SecretManager/GitHub secret) - The server-side API key for Google Gemini API.
- `GEMINI_MODEL` (optional) - The model to call (default: gemini-2.5-flash-preview-09-2025).
- `REDIS_URL` (optional) - e.g. redis://:password@redis-host:6379/0
- `SENTRY_DSN` (optional)
- `ALLOWED_ORIGINS` - comma separated client origins to allow CORS from, e.g. https://app.example.com
- `NODE_ENV` - production

## Cloud Run (GCP) deployment steps (summary)

1. Build container: `docker build -t gcr.io/[PROJECT_ID]/wonky:latest .`
2. Push to registry: `docker push gcr.io/[PROJECT_ID]/wonky:latest`
3. Deploy: `gcloud run deploy wonky --image gcr.io/[PROJECT_ID]/wonky:latest --region=us-central1 --allow-unauthenticated` or set IAM as needed.
4. Configure secrets: either use `gcloud run services update --update-env-vars` with secrets or bind a Secret Manager value.
5. Set concurrency & CPU/memory in Cloud Run depending on expected load.

## Notes

- If using `REDIS_URL`, prefer a managed Redis product (Memorystore in GCP) to allow caches across instances.
- If running multiple instances, the in-process `MemoryCache` may be insufficient; prefer Redis.
- Persist memorials and images in a managed database (Firestore, Postgres), and images in Cloud Storage (GCS).

## CI/CD example

Use GitHub Actions to build and push a container, then deploy to Cloud Run. Create a secret `GCP_SA_KEY` for a service account that has permissions to push images and deploy Cloud Run.
