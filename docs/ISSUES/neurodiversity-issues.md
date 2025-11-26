# Neurodiversity Issue Tracker

Use this file as an internal tracker for small tasks and PRs related to the Neurodiversity initiative.

High-priority tasks

1. Audit & update Framer Motion components (2-3 days)

- Files to audit: `components/modules/*`, `components/Toast.tsx`, `components/TaskMatrixModule.tsx` and any component using `motion`.
- Approach: For each component, replace framer-motion `motion` props with `reducedMotion` conditional.

2. Persist Simplified Mode in server profile (3-4 days)

- Add server endpoint to update profile `simplifiedMode` and persist it in user settings.
- Ensure client reads & applies user setting on load.

3. Add keyboard-focused E2E tests (2 days)

- Add tests to check tab order, focus visible, and modal traps.

Medium-priority tasks

1. Audits for color & contrast (1-2 days)
2. Implement 'Low Sensory' mode variant (1-2 days)
3. Add `shouldReduceMotion` utility & share across components (1-2 days)

Low-priority tasks

1. Add Percy snapshots for simplified & standard modes (1-2 days)
2. Add a setting in `settings` UI for simplified mode and link to server persistence (1-2 days)
