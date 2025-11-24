# Google Workspace Integration SOP (Privacy-first)

Purpose: Provide a documented, auditable, and privacy-first workflow to integrate your Wonky Sprout OS with Google Workspace tools (e.g., Drive, Tasks, Keep). The goal is to automate manual syncs while minimizing PII leakage, protecting children's privacy, and maintaining an audit trail.

High-level Principles

- Explicit consent: Each integration requires a clear parental/guardian consent step.
- Minimal scope: Only request OAuth scopes strictly needed (e.g., tasks.readonly). Avoid full-drive scopes.
- Prompt Sanitization: Remove PII and any sensitive content before sending to servers/AI.
- Server-side proxy: Use a backend function (Cloud Functions) for API calls; never call Google APIs directly from the browser.
- Logging & Audit: Record who authorized and when an integration was used, plus request metadata.

Implementation Steps

1. Prepare server-side OAuth flow
   - Use OAuth 2.0 with restricted scopes and a single server-side refresh token.
   - Prefer service accounts for system-level imports where user identity is not required.
2. Build a sanitized prompt pipeline
   - Create `src/utils/promptSanitizer.ts` to remove emails, phone numbers, and other PII.
   - Validate that generated content contains no child names or sensitive descriptors before outbound calls.
3. Create server endpoint `/api/google/integrations` that proxies all actions
   - Provide endpoints for `tasks/add`, `keep/create`, `drive/upload`, etc.
   - Enforce rate limits and consent checks on each endpoint.
4. UI/UX: Provide clear dialogs
   - Show what data will be shared and why, require consent toggle.
   - Add a “manual review” step for all PII-suspect items.
5. Logging and rollback
   - Add an audit record for each action stored in Firestore (by user ID, time, action, sanitized payload)
   - Allow administrators to revoke or rollback recent actions within 30 minutes.

Testing & Validation

- Add unit tests that stub the server proxy and check that `promptSanitizer` removes PII.
- Add Playwright E2E test that covers: user consents -> server call made -> audit record created.

Notes

- No automation should assume parental consent by default — always explicit and visible.
- For child accounts, disable automated AI-suggested actions — force manual review.
