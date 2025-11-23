# Run and deploy your AI Studio app

## Workspace Overview

This repository is organized to highlight the structural "brains" behind the app. It's intentionally designed for deterministic testing, maintainability, and modular state management so reviewers (and search engines) can quickly understand how the app works.

- Canonical global state: `src/contexts` (the `AppState` provider and `userReducer` live here)
- `defaultStates.ts` contains the canonical defaults; test seeds use `safeMerge` behavior to avoid `undefined` fields
- The app uses `@components` and `@contexts` aliases for clarity across code
- E2E testing is deterministic with `__WONKY_TEST_*__` flags and seeded localStorage

See `docs/WORKSPACE_OVERVIEW.md` for a longer description for auditors and search engines.

### How Google (or auditors) should interpret this repository

This repo is intentionally organized so that the core application behavior is centralized and testable (see `src/contexts/userReducer.ts`), with deterministic seeding for E2E runs and a simple, clear mapping of UI modules via `componentMap` and `@components` aliasing.

For a high-level view of the architecture and workflow, see `docs/WORKSPACE_OVERVIEW.md` and `metadata.json`.

Try the Google Workspace showcase locally
- Start server: `npm run start:server`
- Start dev server: `npm run dev` (if you want to interact with UI)
- Navigate to the dashboard where you can add the module `google-workspace-showcase` to a dashboard to see the demo and run the sample server-side demo functions.


OAuth sign-in: user-level access (optional)
- Create a Google Cloud Web OAuth client and set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in your environment.
- Set `GOOGLE_OAUTH_REDIRECT_URI` to `http://localhost:8080/api/google/oauth2callback` or set it in the Google Cloud console as an authorized redirect URI.
- Start the server and navigate to the Showcase module where a Sign-in button appears — sign in to access Drive/Calendar/Gmail features for your user account.

This contains everything you need to run your app locally.

![Wonky Sprout OS banner](https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6)

This contains everything you need to run your app locally.

View your app in [AI Studio](https://ai.studio/apps/drive/1KyS9OgGqn2V4Fk0n8uF7LkZHjzRqLqnc)

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:

   ```sh
   npm install
   ```

### Quick Windows: locked native module helper

If you get an EPERM unlink error on Windows for native binaries (e.g., `lightningcss-win32-x64-msvc`), run the included helper script to stop node processes, remove the locked folder and re-run install.

Open PowerShell as Administrator and run:

```pwsh
npm run windows:fix-node
```

This runs `scripts/windows-node-fix.ps1` which attempts to stop Node, remove the locked `node_modules` folder for the `lightningcss` binary, clean the npm cache and then run `npm ci`.# margie_fay

## Optional: run the Express server with the Gemini proxy

To enable the server-side /api/gemini proxy and run the dev server together which is helpful for secure testing of AI features locally:

```bash
npm run start:server
npm run dev
```

If you prefer to run them concurrently you can use a tool like `concurrently`:

```bash
npx concurrently "npm run start:server" "npm run dev"
```

### Security: Gemini API Key & server proxy

Never check production API keys into source control. For local testing, set `VITE_GEMINI_API_KEY` in `.env.local`.
For production, set `GEMINI_API_KEY` in your host environment for the Express server or configure the Firebase `functions/aiProxy` with service account permissions and environment variables.

TIP: Press Ctrl/Cmd+G to focus the Ask AI input (Grandma/Grandpa persona).

### New: Grandpa persona
--------------------
We added a new 'Grandpa' persona for the Ask AI module. You can pick the persona from the 'AI persona' selector in the Ask AI module. "Grandpa" gives direct, practical, and sometimes blunt advice with a down-to-earth tone.

Example:

- Question: "My sink is clogged, what would Grandpa do?"
- Grandpa's guidance: "First, shut off the water if it's running. Remove visible gunk with gloves. Use a plunger for 5 minutes. If the plunger doesn't work, remove the trap and clear it. Reassemble and test. If it still drains slowly, call a plumber. Love, Grandpa."


## Production deployment notes

Recommended production setup:

- Host the server-side proxy on a managed container platform (Cloud Run) or serverless functions with environment variables kept in secret managers.
- Use a shared Redis cache (set `REDIS_URL`) to support multiple server instances and to prevent redundant API calls to Gemini.
- Use `ALLOWED_ORIGINS` to restrict CORS to the production app domain(s).
- Use `SENTRY_DSN` to send server errors to Sentry for monitoring.
- Do not set `VITE_GEMINI_API_KEY` in production; ensure `GEMINI_API_KEY` is only set on the server.
- Protect the server with a strict rate limit; set `RATE_LIMIT_MAX` and `RATE_LIMIT_WINDOW_MS` to tune throttling.

See `DEPLOY.md` and `RUNBOOK.md` for steps, GitHub Actions examples, and operational runbook.
