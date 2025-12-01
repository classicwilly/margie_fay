# Onboarding & Neurodivergent Preferences

This document explains the onboarding flow for Wonky Sprout OS and the Neurodivergent Onboarding flow.

## Overview

- The onboarding flow is presented for new users via `App.tsx` when `appState.initialSetupComplete` is false.
- The neurodivergent-onboarding preset is implemented in `src/components/NeurodivergentOnboarding.tsx` and can be invoked using the `neuro-onboarding` view within the Command Center or via the `/onboarding` route.

## How to open Onboarding

1. Command Center: Navigate to the Command Center in the header and choose the Onboarding option from the menu ('neuro-onboarding').
2. Programmatically: Update `appState.view` to `neuro-onboarding` using the `SET_VIEW` action in the `AppStateProvider`.

## Neurodivergent Preferences

The `NeuroPrefs` are available via the `NeuroPrefsProvider`. These preferences include:

- `simplifiedUi` (boolean) — reduces UI complexity for cognitive load.
- `reduceAnimations` (boolean) — turns off non-essential animations and transitions.
- `largerText` (boolean) — increases typographic scale.
- `focusModeDuration` (number) — length for focus timers (minutes).
- `microStepsMode` (boolean) — splits complex steps into micro steps in UI.
- `assistTone` (`'concise' | 'helpful'`) — sets AI assistant tone.
- `autoAdvanceSteps` (boolean) — automatically progress to the next micro-step after completing the previous.

## Developer Notes

- The `NeuroPrefsProvider` reads `appState.neuroPrefs` and can be updated via `SET_NEURO_PREFS`.
- Use `FeatureFlagsProvider` to toggle experimental or AI features during testing.

## Testing Onboarding

- Unit tests for preferences are in `tests/NeurodivergentPreferences.test.tsx`.
- To run onboarding flows in tests, add a wrapper that sets `defaultUserState.initialSetupComplete = false` prior to rendering the app.

## Reverting or Re-running Onboarding

To restart onboarding for a user, set `appState.initialSetupComplete` to `false` using the `SET_INITIAL_SETUP_COMPLETE` action in the AppState provider.

## UI Considerations

- Keep onboarding minimal (roughly 5 steps) and provide safe defaults for higher risk features (AI integrations, telemetry, login).
- Offer a light 'skip' option with a clear path to re-run onboarding later (Settings).
- Maintain accessibility checks and include ARIA and keyboard flow verification in the onboarding UI.

## Running & Debugging E2E Tests (Dev & CI)

- For E2E stability during development and CI we recommend running Playwright against a built preview server to avoid HMR-related disconnects. See `docs/E2E.md` for details. Use `npm run e2e:preview` to start a preview server, run the tests, and upload artifacts.

 

