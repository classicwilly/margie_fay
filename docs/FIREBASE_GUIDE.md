Firebase guide for Wonky Sprout OS

Overview

- Firebase is a good choice for an MVP backend: Authentication, Firestore for flexible data storage, Cloud Functions for server logic, Hosting for static site, and optional App Check + Security rules for safety.
- If you will store sensitive health data (PHI), Firebase might need extra legal considerations — you must sign a BAA with Google and ensure HIPAA compliance for production. For strictly non-PHI or de-identified health insight collection, Firebase is fine.

Recommended architecture

- Authentication: Firebase Auth (email/password, Google sign-in). Keep identity tokens short-lived.
- Database: Cloud Firestore. Use per-user document namespaces (e.g., `users/{uid}/health_logs/{logId}`) with strong rules.
- Server logic: Cloud Functions for heavy tasks (e.g., scheduling notifications, proxying AI calls—don’t store raw PII without consent).
- Analytics: Firebase Analytics + optional telemetry endpoint that stores non-PII metrics.
- Storage: Cloud Storage for non-sensitive attachments (images). For sensitive attachments, consider encrypting on client and storing minimal metadata.

YP Firestore schema (short):

- users/{uid}
  - profile: { displayName, email, timezone, consentFlags }
- users/{uid}/health/logs/{logId}
  - type: 'symptom' | 'medication' | 'note' | 'vitals' | 'task'
  - date: timestamp
  - tags: []
  - payload: { symptom: string, severity: number, notes: string }
  - privacy: 'private' | 'share_with_provider' // user-controlled
- resources/{resourceId}
  - title, description, category, tags, publishedAt
- telemetry/events/{eventId}
  - userId (optional hashed), eventType, meta, createdAt
- settings/{userId}/notifications

Security rules sketch:

rules_version = '2';
service cloud.firestore {
match /databases/{database}/documents {
// Users can read/write their profile, restricted by auth
match /users/{userId} {
allow read, write: if request.auth != null && request.auth.uid == userId;

      match /health/logs/{logId} {
        allow read, create: if request.auth != null && request.auth.uid == userId;
        allow update, delete: if request.auth != null && request.auth.uid == userId;
      }
    }

    match /resources/{resourceId} {
      allow read: if true; // public
      allow write: if request.auth != null && request.auth.token.admin == true; // admin controlled
    }

    match /telemetry/{telemetryId} {
      allow create: if request.auth != null;
      // avoid read access to raw telemetry
      allow read: if false;
    }

}
}

Notes & best practices

- Avoid storing unencrypted PHI. If you must store PHI/health data, get a BAA from Google and design audit logs.
- Encrypt locally sensitive text before sending if you want an extra layer (client encrypts with user's recovery key).
- For AI flows: validate and scrub PII before sending to external APIs; use the `useAIPromptSafety` hook for prompt scanning.
- Use App Check and ensure tokens are validated by Cloud Functions to reduce abuse.
  - To require App Check for production, set `APP_CHECK_ENFORCE=true` in your Cloud Functions environment or `firebase functions:config:set appcheck.enforce="true"`.
  - Sanitize prompts server-side as a secondary protection to avoid sending raw PII to third-party AI services. The `functions/pii_sanitizer.js` provides a simple PII scrub that redacts emails, phones, SSNs and long numbers.
  - Telemetry: store only anonymized hashes for user identifiers and avoid keeping raw prompts or PII in the `telemetry` collection.
    - Avoid writing sensitive content to logs or Sentry. When using Sentry or other tracing tools, scrub PII or disable full-text capture for sensitive requests (e.g., do not forward sanitized prompts or user messages unless explicitly allowed by user consent).

Next: If you'd like, I can scaffold minimal `firebase.json` + Cloud Functions proxies for AI flows (to keep server-side API keys safe).

Deploy & local test steps (quick):

- Install Firebase CLI: `npm install -g firebase-tools` and log in: `firebase login`.
- Use the emulator for local testing without real credentials: `firebase emulators:start --only functions,firestore,auth`
- To run the new function tests: `cd functions && npm install && npm test`. Unit tests for the PII scrub run locally and do not need emulators.
- To test App Check enforcement locally, use the emulator with App Check or set `APP_CHECK_ENFORCE=true` with the Firebase config and test a request with and without the `X-Firebase-AppCheck` header.
- Build your client and start a preview server (if necessary) with `npm run build` or `npm run dev` depending on your local setup.

Deploy functions to Firebase (production):

- Set env vars: for example `firebase functions:config:set ai.url="https://ai.example.com" ai.key="__KEY__"`
- Deploy functions: `firebase deploy --only functions`

Notes on App Check:

- If you enable App Check, modify `functions/index.js` to reject requests without an App Check token. The example code in `functions/index.js` shows a soft-fail approach that lets you keep testing locally without App Check.

Client example: calling the AI proxy from the browser

```js
// Acquire ID token & App Check token from Firebase SDK, then call Cloud Function
import { getAuth } from "firebase/auth";
import { getAppCheckToken } from "firebase/app-check";

async function callAiproxy(prompt) {
  const auth = getAuth();
  const token = await auth.currentUser.getIdToken();
  const appCheckResponse = await getAppCheckToken();
  const appCheckToken = appCheckResponse && appCheckResponse.token;

  const res = await fetch("/aiProxy", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Firebase-AppCheck": appCheckToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  return await res.json();
}
```
