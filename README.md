# Run and deploy your AI Studio app

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

TIP: Press Ctrl/Cmd+G to focus the Ask Grandma input.
