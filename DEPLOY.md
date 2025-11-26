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

## Discord bot and worker considerations

This project optionally supports a Discord integration that includes OAuth connectors, webhook receivers, and a background worker that can act as a service bot to play TTS audio in voice channels.

- `DISCORD_SERVICE_BOT_TOKEN` - (Secret) the bot token for the Discord service account to perform privileged actions.
- `DISCORD_ENABLE_BOT_WORKER` - (boolean) whether to attempt starting the `discordBotWorker` at server startup. Defaults to false in `.env.example`.
- `DISCORD_PUBLIC_KEY` - (optional) The public key used to verify incoming Discord interactions.

We recommend running the bot worker as a separate process or container to avoid optional dependencies like `discord.js` and `@discordjs/voice` being resolved in the main server image/build step. To run the worker separately, add the secret `DISCORD_SERVICE_BOT_TOKEN` to the environment and use the provided npm script:

```bash
npm run start:discord-bot
```

When deploying to Cloud Run or a Kubernetes cluster, run the Discord worker as a separate service or container, and ensure `DISCORD_SERVICE_BOT_TOKEN` and `REDIS_URL` are provided via secret/config.

### Build and run a container for the Discord worker

To build and run the discord bot worker container locally (Docker must be installed):

```bash
# Build the container image
docker build -t wonky-sprout-discord-bot -f Dockerfile.discord-bot .

# Run it (provide secrets via environment variables). The container will only attempt to import discord libs if a token is present.
docker run --rm -e DISCORD_SERVICE_BOT_TOKEN="<your-bot-token>" -e REDIS_URL="<redis-url>" wonky-sprout-discord-bot
```

### Local compose for dev + worker

You can use `docker compose` to run Redis, the server, and the Discord worker together for local testing. Start the composition with:

```bash
docker compose -f docker-compose.discord.yml up --build
```

### Cloud Run: deploy the Discord worker container

1. Build and push Docker image:

```bash
docker build -t gcr.io/[PROJECT_ID]/wonky-discord-bot:latest -f Dockerfile.discord-bot .
docker push gcr.io/[PROJECT_ID]/wonky-discord-bot:latest
```

2. Deploy to Cloud Run with secrets passed in and concurrency set to 1 (recommended for a long-running voice bot):

```bash
gcloud run deploy wonky-discord-bot --image gcr.io/[PROJECT_ID]/wonky-discord-bot:latest --region=us-central1 --allow-unauthenticated --set-env-vars=REDIS_URL="<redis://...>" --set-secrets=DISCORD_SERVICE_BOT_TOKEN=[SECRET_NAME]
```

3. Ensure the bot's token (`DISCORD_SERVICE_BOT_TOKEN`) and `REDIS_URL` are set as Cloud Run environment variables or bound to secrets.

Note: Use Secret Manager / Cloud Run secret env var bindings for the `DISCORD_SERVICE_BOT_TOKEN` to avoid revealing the value in your CI logs or repo. Do not store tokens in source control.

## CI/CD example

Use GitHub Actions to build and push a container, then deploy to Cloud Run. Create a secret `GCP_SA_KEY` for a service account that has permissions to push images and deploy Cloud Run.
