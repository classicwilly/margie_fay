# Neurodiversity Follow-up Tasks

This file lists follow-up tasks and PR candidates after the initial neurodiversity improvements (docs, tests, toggle, CSS, and basic component updates).

## High-priority ongoing changes

1. Audit all Framer Motion usages and migrate components to use `useReducedMotion()` where animations are created, and provide fallbacks for simplified mode.
2. Implement `Simplified Mode` persistence for authenticated users via server-side profile preferences or Firebase field; add a migration path.
3. Add `Simplified Mode` preferences to the Settings UI with a server sync & settings table (UI and server endpoint).
4. Add a comprehensive focus order & keyboard-only navigation E2E suite for critical flows (dashboard, module config, checkout-like flows).

## Medium-priority enhancements

1. Add color contrast and readability improvements across components and ensure they pass Axe checks.
2. Add a central `Animation` utility that returns `shouldReduceMotion` to unify behavior across components and maintain consistent transitions.
3. Add `aria-live` regions for dynamic updates and validate via Axe & E2E.
4. Implement a `Simplified Mode` theme tokens in Tailwind config to allow more fine-grained control over simplified styles.

## Low-priority tasks

1. Add 'Simplified Mode' visual snapshots to Percy for regression testing.
2. Add a 'Low Sensory' mode variant (for instance, high-contrast minimal animation + reduced brightness) in the theme tokens.

Each task should have a small PR and include tests (unit & E2E) where possible. If you want, I can start the audit and plan PRs for each of the high-priority items.
