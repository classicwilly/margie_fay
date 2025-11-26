# Neurodiversity Improvements — PR Summary

This PR includes a first-pass implementation to improve neurodiversity accessibility for the app. It contains docs, tests, minor component updates to honor reduced-motion & simplified mode, a provider for simplified mode, and CI updates to run the new E2E tests.

What changed:

- New docs `docs/NEURODIVERSITY_GUIDELINES.md`
- New E2E tests `tests/e2e/neurodiversity.spec.ts` and `npm run test:neurodiversity` script
- `SimplifiedMode` provider/hook and toggle (`src/contexts/SimplifiedModeContext.tsx`, `components/SimplifiedModeToggle.tsx`)
- `usePrefersReducedMotion` hook for consistent detection of OS-level reduced-motion preference
- `Toast`, `WonkyAISetupGuide`, and `Header` updated to respect `prefers-reduced-motion` and `simplifiedMode`
- Global CSS added for `prefers-reduced-motion` and `.simplified-mode`
- CI updated to include the neurodiversity E2E tests in a11y job

Testing steps:

1. Run the app locally: `npm run dev` and visit the client.
2. Toggle Simplified Mode via the header toggle or localStorage (key: `simplified_mode`).
3. `npm run test:neurodiversity` to run E2E tests targeting neurodiversity checks.

Notes for reviewers:

- The approach is incremental: we favor component-level checks to minimize risk. Each heavy-motion component should be audited and updated to use `usePrefersReducedMotion` or use the reduced-motion API in Framer Motion.
- This PR intentionally avoids a global rewrite; follow-up PRs will target Framer Motion components & user-server preference persistence.
