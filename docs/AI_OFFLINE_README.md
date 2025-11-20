# Operating Without AI — Wonky Sprout OS

This document explains how to use the app in non-AI mode and how the app behaves when AI is unavailable or disabled.

Why support no-AI operation?
- Accessibility & privacy: Many users prefer full control and don't want AI processed data to leave their device.
- Offline & disconnected: You might run in places without a stable internet connection.
- Compliance: Prevent sending PHI to third-party models.

How the app supports non-AI operation
- Feature flags: `aiEnabled` toggles AI features globally. Stored in `localStorage` under `wonky_flags`. The app also supports server-side disabling via user settings or admin config.
- Fallback UIs:
  - AI-assisted modules (Wonky AI, Weekly Review, BrainDump, etc.) show manual editors and templates so users can create structured content without AI.
  - The `Weekly Review` has a small heuristic assistant that synthesizes lists of wins based on completed tasks and picks a focus from objectives if AI is disabled.
- Telemetry and AI usage:
  - When AI is disabled, no AI calls are made and no prompts are sent to the AI proxy. Telemetry about AI usage will be empty.

How to disable AI for a user or locally
- Local disable (fast): Open the developer console and run:
 - Local disable (fast): Open the developer console and run:

```js
localStorage.setItem('wonky_flags', JSON.stringify({ aiEnabled: false }));
window.location.reload();
```

- Persisted user setting: Implement in the app (this repo has a `FeatureFlagsProvider` that can be extended to read/firestore settings in `users/{uid}`).
 - Onboarding skip: during initial setup the user can choose "Skip AI & Continue in Manual Mode" which disables AI features while preserving app functionality.

Developer notes
- Important hooks:
  - `useAIEnabled()`: returns the flag from `FeatureFlagsContext`.
  - `FeatureFlagsProvider`: wraps your app and persists flags to localStorage.
  - `useSafeAI()`: checks `useAIEnabled()` and returns a manual fallback when AI is disabled.

Tests & CI
- Unit: `tests/useSafeAI.test.ts` verifies fallback behavior when AI is disabled.
- E2E: `tests/e2e/non_ai_flow.spec.ts` exercises weekly review with AI disabled.

Next steps for production
- Expose a user setting in account preferences so users can permanently disable AI in their account.
- Add a server-side toggle in Firestore so admins can globally disable AI for compliance reasons across the organization.
- Add offline storage for manual templates so the user can pick built-in templates if AI is unavailable.

If you want, I can implement the persistent user-level setting and a UI control in `Settings` next.
