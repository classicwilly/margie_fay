# Onboarding & Neurodivergent Preferences

This document explains the onboarding flow for Wonky Sprout OS and the `Neurodivergent Onboarding` flow.

## Overview

- The onboarding flow is presented for new users via `App.tsx` when `appState.initialSetupComplete` is false.
- The neurodivergent-onboarding preset is implemented in `src/components/NeurodivergentOnboarding.tsx` and can be invoked using the `neuro-onboarding` view within the Command Centre or via the `/onboarding` route.

## How to open Onboarding

1. Command Center: Navigate to "Command Center" in the header and choose the Onboarding option from the menu ("neuro-onboarding").
2. Programmatically: Update `appState.view` to `neuro-onboarding` using the `SET_VIEW` action in the `AppStateProvider`.

## Neurodivergent Preferences

The `NeuroPrefs` are available through the `NeuroPrefsProvider`. These preferences are:

- `simplifiedUi` (boolean) — reduces UI complexity for cognitive load.
- `reduceAnimations` (boolean) — turns off non-essential animations and transitions.
- `largerText` (boolean) — increases typographic scale.
- `focusModeDuration` (number) — length for focus timers (minutes).
- `microStepsMode` (boolean) — split complex steps into micro steps in UI.
- `assistTone` (`'concise' | 'helpful'`) — sets the AI assistant tone.
- `autoAdvanceSteps` (boolean) — automatically progress to the next micro-step after completing the previous.

## Developer Notes

- The `NeuroPrefsProvider` reads `appState.neuroPrefs` and can be updated via `SET_NEURO_PREFS` action.
- For consistent testing use `FeatureFlagsProvider` to toggle AI-enabled or experimental features.

## Testing Onboarding

- Unit tests for the preferences exist in `tests/NeurodivergentPreferences.test.tsx`.
- To run onboarding flows in tests, add a wrapper that sets `defaultUserState.initialSetupComplete = false` prior to rendering the App in a test.

## Reverting or Re-running Onboarding

To restart onboarding for a user, set `appState.initialSetupComplete = false` using the `SET_INITIAL_SETUP_COMPLETE` action in `AppState`.

## UI Considerations

- Keep the onboarding steps minimal (5 steps max) and provide safe defaults for features that may cause unexpected behavior (AI integration, login, telemetry).
- Onboarding should offer a light "skip" option and surface how to re-run the onboarding from settings.
