# CI & Integration Tests for Discord

This document describes the CI setup and required secrets for running Discord integration tests and worker checks.

Secrets required (set in repository settings > Secrets):

- `DISCORD_SERVICE_BOT_TOKEN` — bot token for the test bot (keep private)
- `DISCORD_TEST_GUILD_ID` — test guild ID where the bot can join voice channels
- `DISCORD_TEST_VOICE_CHANNEL_ID` — voice channel ID in the test guild
- `REDIS_URL` (optional) — alternative Redis URL if you don't want to use the job-scoped `redis` service

Workflows included:

- `.github/workflows/discord-integration-tests.yml` — a workflow that runs manually (workflow_dispatch) that installs optional libaries and runs the suite. This workflow now spins up Redis and starts the bot worker in background.
- `.github/workflows/discord-integration-tests-auto.yml` — an automated workflow that runs on push to `main`/`master` and will run the integration tests when the required secrets are present; it also starts a Redis service for the job.

Notes:

- These tests should be gated by secrets and manual review; do not add your production bot token here — create a separate test bot with limited privileges.
- The integration test suite will only run if `DISCORD_INTEGRATION_TEST=true`. The GitHub Actions workflows set this environment variable during the test step.
- The integration tests are designed to use a dedicated test bot and test guild. They may perform actual voice playback in the joined voice channel.

Local testing tips:

- Run the worker locally with:

```pwsh
npm run start:discord-bot
```

- Run integration tests locally with:

```pwsh
DISCORD_INTEGRATION_TEST=true DISCORD_SERVICE_BOT_TOKEN=<token> REDIS_URL=redis://localhost:6379 npm run test:discord-integration-local
```
