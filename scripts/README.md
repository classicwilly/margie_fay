# scripts

A collection of helper scripts used in development, CI, and repository maintenance.

## gh-check-and-clear.ps1

This interactive PowerShell script helps detect and safely clear `GITHUB_TOKEN` and `GH_TOKEN` environment variables in Process, User, and Machine scopes and optionally re-authenticates the `gh` CLI using the web flow.

Usage:

```powershell
pwsh -NoProfile -ExecutionPolicy Bypass -File ./scripts/gh-check-and-clear.ps1
```

Run the script from a PowerShell session to inspect environment variable presence and clear them with your confirmation. Machine-level removals require elevated privileges (admin).

### Why this script exists

We prefer `gh auth login --web` to store credentials securely rather than rely on environment variables which might be leaked. This helper script makes it easy to adopt that best practice by identifying tokens and removing them if desired.
