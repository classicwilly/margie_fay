# PR: Neurodiversity Improvements — docs, tests, simplified-mode

This PR implements the first wave of neurodiversity improvements: a documentation guide, a new `SimplifiedMode` UI setting, E2E tests for reduced motion & simplified mode, and CI updates to run the additional E2E tests.

Files changed:

- `docs/NEURODIVERSITY_GUIDELINES.md` — new guideline doc for designers & developers.
- `components/SimplifiedModeToggle.tsx` — a small toggle to enable simplified mode for users & testing.
- `src/contexts/SimplifiedModeContext.tsx` — provider & hook for simplified mode state; persists in localStorage and toggles `simplified-mode` body class.
- `src/hooks/usePrefersReducedMotion.ts` — a small hook to detect `prefers-reduced-motion` media query and subscribe to changes.
- `tests/e2e/neurodiversity.spec.ts` — Playwright E2E tests for reduced motion and simplified mode.
- `components/Toast.tsx`, `components/WonkyAISetupGuide.tsx`, `components/ui/header.tsx` — small adjustments to respect reduced motion & simplified mode, disable transitions.
- `src/index.css` — global reduced motion & simplified mode CSS changes.
- CI: `.github/workflows/ci.yml` — ensure neurodiversity E2E tests are run as part of `a11y` job.

Why:

- Improve accessibility for neurodiverse users by honoring system preference for reduced motion.
- Provide a 'Simplified Mode' to reduce sensory overload: remove complex visuals, increase spacing, and reduce animations.
- Add E2E tests to CI to prevent regression and ensure accessibility is enforced.

Follow-ups (small PRs recommended):

1. Replace global body toggles with more structured interaction in UI components (we added a quick toggle in header for testing).
2. Incrementally update heavy-motion Framer Motion components to check `useReducedMotion()`.
3. Add a 'Simplified Mode' preference to the user profile and settings UI, persisted to user profile (server-side) for logged-in users.
4. Add Visual Regression snapshots with percy for both standard and simplified modes if snapshots are helpful.
5. Add keyboard navigation tests and focus-order tests for critical flows.

Testing:

- Run `npm run test:neurodiversity` locally (Playwright) after running the dev server.
- CI will run Axe + neurodiversity spec in the `a11y` job.

Notes and Risks:

- This is a first wave and relies on incremental adoption; `simplified-mode` is an opt-in toggle persisted locally. For a user setting persisted to the server, adding a backend & migration is required.
- The app uses a great variety of animation mechanics (CSS, Framer Motion, and custom JS); broad audit/PRs are required to replace all heavy animations.
