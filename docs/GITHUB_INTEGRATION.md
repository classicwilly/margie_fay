Processor & background worker:

- `WEBHOOK_PROCESSOR_ENABLE` (default true) - enable webhook processor
- `WEBHOOK_PROCESSOR_POLL_MS` (default 2000ms) - poll interval for background processor

How it works:

- The `/api/github/webhooks/receive` endpoint accepts GitHub webhook events and validates signatures when `GITHUB_WEBHOOK_SECRET` is provided.
- Events are enqueued to an in-memory queue on the server, and a background worker polls the queue and dispatches actions using server connectors.
- Example automated actions: `pull_request.opened` → create a Google Task to review the PR; `issues.opened` → post a comment acknowledging receipt.

# GitHub Integration

This project includes server-side GitHub OAuth support to enable the app to act on behalf of a user without exposing tokens in the browser.

Routes:

- `GET /api/github/auth` - Redirects to GitHub OAuth consent screen.
- `GET /api/github/callback` - OAuth callback that exchanges the code for access tokens and stores them on the server in the configured cache.
- `GET /api/github/me` - Returns authenticated user profile using stored tokens.
- `GET /api/github/repos?max=50` - List user repositories.
- `POST /api/github/repos/:owner/:repo/issues` - Create an issue in a repo.
- `POST /api/github/repos/:owner/:repo/pulls` - Create a pull request (title, head, base, body)
- `POST /api/github/repos/:owner/:repo/issues/:number/comments` - Create a comment on an issue or PR
- `PUT /api/github/repos/:owner/:repo/contents/{path}` - Create/update a file (commit) in a repo
- `POST /api/github/repos/:owner/:repo/webhooks` - Create a webhook for a repo (admin required)
- `POST /api/github/revoke` - Clear user session tokens
- `POST /api/github/app/installation-token` - (Admin) Generate GitHub App installation token using `GITHUB_APP_ID` & `GITHUB_APP_PRIVATE_KEY`.

Environment variables:

- `GITHUB_CLIENT_ID` - GitHub OAuth App Client ID
- `GITHUB_CLIENT_SECRET` - GitHub OAuth App Client Secret
- `GITHUB_OAUTH_REDIRECT_URI` - Optional callback URI; defaults to `/api/github/callback` on configured port.
- `GITHUB_SERVICE_TOKEN` - Optional token used for demo/service integrations (personal access token)
- `GITHUB_WEBHOOK_SECRET` - Secret used to verify webhook payloads
- `GITHUB_ADMIN_USERS` - Comma-separated list of GitHub usernames that are granted admin roles (used for RBAC)
- `GITHUB_APP_ID` - (Optional) GitHub App ID for GitHub App flows
- `GITHUB_APP_PRIVATE_KEY` - (Optional) GitHub App private key in PEM format (ensure proper quoting/escaping in env)

Security notes:

- Tokens are stored server-side in the `cache` (memory or Redis depending on `REDIS_URL`).
- A signed session cookie `ghsess` is used to map requests to stored tokens.

Usage:

1. Configure a GitHub OAuth App and set `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`.
2. Visit the client and click 'Sign In with GitHub' which will redirect to `/api/github/auth`.
3. After consenting, the app will have the access token to list repos and create issues on your behalf.
