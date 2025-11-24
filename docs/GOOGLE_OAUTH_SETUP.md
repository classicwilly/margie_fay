# Google OAuth Setup (User-level Sign-in)

Step-by-step to add Google sign-in for the app and enable user-level Google Workspace features:

1. Create OAuth credentials in Google Cloud Console

- Go to Google Cloud Console -> APIs & Services -> Credentials -> Create Credentials -> OAuth client ID
- Choose "Web application" and set the redirect URI to `http://localhost:8080/api/google/oauth2callback` for local dev or your production domain for PROD.

1. Add credentials to environment variables

- Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in your environment (or use a secret manager in production)
- Optionally set `GOOGLE_OAUTH_REDIRECT_URI` if you use a custom callback URL

1. Scopes: By default we request `openid email profile` plus Drive/Calendar/Sheets/Gmail scopes to enable seamless automation from the user’s account. Consider least-privilege and request only what you need.

2. Start the server and dev environment

- Run server: `npm run start:server`
- Run dev: `npm run dev`
- Open the showcase module and click "Sign in with Google" to authorize the app.

1. Token storage & security

- The demo stores tokens in a local MemoryCache keyed by session cookie `gwsess` for demo purposes only.
- For production, store refresh tokens encrypted in a database (e.g., Cloud SQL) and use secure cookie sessions (use HTTPS and Secure cookie flag).
- The demo now validates the OAuth `state` value in the server cache to prevent CSRF replay attacks. This is a basic protection suitable for demos; for production keep the state in a server-backed storage or encrypted session store and rotate it as needed.

1. Revoking & logout

- The server exposes `/api/google/logout` to remove token cache and clear cookie.
- If a user revokes access via Google account, handle token unauthorized errors and re-auth flows.

Note: This demo flow is designed for auditors and quick interactive demos. For production readiness, implement the following improvements:

- Use persistent DB store and encrypted tokens
- Implement robust re-auth & token rotation
- Add user-scoped logging and audit trails for actions (Drive creation, Calendar events)
