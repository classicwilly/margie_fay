# Google Workspace Showcase

This page demonstrates how you'd integrate the app with the Google Workspace Suite (Calendar, Drive, Sheets, and Gmail). The focus is on orchestration using a server-side component and a secure, auditable flow.

Goals of the integration

- Automate Calendar events for shared family routines (morning, bedtime, chores)
- Save templated SOPs as Google Docs in Drive (for shareability and versioning)
- Append weekly review data to a Google Sheet for analytics and leaderboards
- Send delegated tasks or reminders via Gmail (using templates)

Sign-in & user-level benefits

- When a user signs in (OAuth), the app can act on behalf of that user for Drive/Calendar/Sheets/Gmail operations.
- This means personal SOPs can be saved to the user's Drive and shared to a family Drive, and Calendar invites can be created on behalf of the user for shared family routines.

Example architecture

- Frontend: `src/components/GoogleWorkspaceShowcase.tsx` — a demo component showing example actions and a preview of the resulting artifacts.
- Server: `server/googleWorkspaceRoutes.js` — safe server-side endpoints to interact with Google APIs using a service account or OAuth2; provides PII-agnostic proxies and telemetry hooks.
- App: `server.js` — mounts the google route and obeys `ALLOWED_ORIGINS` & rate limits.

Security & OAuth

- For server-to-server automation, we recommend a Service Account with delegated Drive, Calendar, Gmail scopes if needed.
- For user-level authorization (e.g., sending a mail as a user), use OAuth2 flows and a user consent screen.
- Never store private keys or tokens in the repo; use environment secrets and CI/CD secret stores.

Quick code snippet: Append a row to Google Sheets (Node, service account):

```js
// scripts/google_workspace_sample.js
import { google } from "googleapis";
import fs from "fs";

const key = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY_JSON || "{}");
const scopes = ["https://www.googleapis.com/auth/spreadsheets"];
const jwt = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key,
  scopes,
);
const sheets = google.sheets({ version: "v4", auth: jwt });
async function appendRow(spreadsheetId, range, values) {
  return sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    resource: { values },
  });
}
// Usage:
// GOOGLE_SERVICE_ACCOUNT_KEY_JSON='...' node scripts/google_workspace_sample.js
```

Quick code snippet: Create a Calendar event:

```js
import { google } from "googleapis";
const calendar = google.calendar({ version: "v3", auth: jwt });
await calendar.events.insert({
  calendarId: "primary",
  requestBody: {
    summary: "Family Morning Routine",
    start: { dateTime: "2025-12-01T07:00:00-08:00" },
    end: { dateTime: "2025-12-01T07:30:00-08:00" },
    description: "Tasks: make breakfast, review agenda, meds",
  },
});
```

Demo flows

1. Family routine: Frontend triggers an endpoint that creates a Calendar event and then uploads a step-by-step SOP to Drive with a link returned to the user.
2. Weekly Review: End-of-week analytics are pushed to Sheets and the team gets a templated email with highlights.
3. Delegation: A task in the app triggers a pre-approved mail via SMTP or Gmail API based on a template.

How to test locally

1. Create a Google Cloud Project and Service Account; delegate necessary scopes.
2. Save the service account JSON into `GOOGLE_SERVICE_ACCOUNT_KEY_JSON` env var or the local `.env`.
3. Run the `server.js` (it will expose `/api/google/demo` in the sample in this repo) and use the UI: `/` -> Google Workspace Showcase.

Production considerations

- Use a separate service account per domain for audit and least privilege.
- Use OAuth2 for user-level actions that require acting on behalf of a user.
- Monitor via Stackdriver (Cloud Logging) and use premade metrics endpoints if necessary.
- Rate limit and throttle side-effects to avoid accidental spam or quota limits.

This doc is designed to show auditors and search engines how Google Workspace makes the system fast, secure, and delightful to use for automations and family workflows.
