# Discord Integration Testing

This document explains how to run the Discord integration tests locally and in CI, as well as how to run the bot worker for local development.

> Note: The integration tests use optional runtime libraries: `discord.js`, `@discordjs/voice`, and `google-tts-api`. They are not required for local development or most unit tests.

Prereqs

- Node.js (matching repo `package.json` setup)
- A test Discord bot (optional for integration tests)
- A test Redis instance (optional for integration tests)

Local Unit Test (fast)

- Run the normal unit tests which include Discord signature and route tests:

```bash
npm test
```

Local Integration Tests (requires a test bot and secrets)

1. Install optional dependencies:

```bash
npm ci
npm install --no-save discord.js @discordjs/voice google-tts-api tweetnacl ioredis node-fetch@2 supertest
```

2. Set environment variables:

Windows PowerShell / pwsh example:

```pwsh
$env:DISCORD_INTEGRATION_TEST = 'true'
$env:DISCORD_SERVICE_BOT_TOKEN = 'your_test_bot_token'
$env:DISCORD_TEST_GUILD_ID = 'your_test_guild_id'
$env:DISCORD_TEST_VOICE_CHANNEL_ID = 'your_voice_channel_id'
$env:REDIS_URL = 'redis://localhost:6379'
```

3. Run the integration tests (local):

```bash
npm run test:discord-integration-local
```

Running the worker locally

1. Set environment variables (service token + redis):

```pwsh
$env:DISCORD_SERVICE_BOT_TOKEN = 'your_test_bot_token'
$env:REDIS_URL = 'redis://localhost:6379'
```

2. Start the bot in a separate terminal:

```bash
npm run start:discord-bot
```

Notes and Tips

- If running in CI via the included workflows, the `discord-integration-tests-auto.yml` will spin up a local Redis service for the job when running on GitHub Actions.
- When running locally, `REDIS_URL` can be set to `redis://localhost:6379` and point at your local Redis. Make sure the worker is running and has `DISCORD_SERVICE_BOT_TOKEN` configured.
- Use the GitHub Actions workflow `discord-integration-tests.yml` to run these tests manually in CI. For an automated run on push the `discord-integration-tests-auto.yml` workflow checks whether secrets are present and runs the suite.
- If you are having trouble with `discord.js` native dependencies on Windows, check the README for the `windows:fix-node` helper.
- These tests are optional and should be gated on presence of secrets to avoid leaking tokens in CI logs. They are designed for a separate bot and test guild.
