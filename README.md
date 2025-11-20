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

This runs `scripts/windows-node-fix.ps1` which attempts to stop Node, remove the locked `node_modules` folder for the `lightningcss` binary, clean the npm cache and then run `npm ci`.