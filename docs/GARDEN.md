# Garden (Sprout Garden) Overview

The Garden is a living dashboard showing the system's "health" score. It aggregates data from:
- Essentials (meds, hydration, nutrition)
- Mood & Energy
- Task completion and habit tracking
- Family log entries

Components
- `LivingSprout` — top-level system health for the homeowner.
- `SproutOverview` — quick overview for each child (Willow & Sebastian).

Important data points
- `score` (0-100) derived in `hooks/useSystemHealth.ts`
- `diagnostics` — a short list of positive/negative messages
- `sproutState` — 'healthy'|'normal'|'wilted'

Development notes
- The Garden relies on `appState` to be loaded. Guard against null states by returning an informative placeholder.
- Styles are pulled from shared Tailwind tokens — to maintain visual consistency tweak `tailwind.config.js` tokens.

To test locally
- Confirm the `defaultUserState.view` set to `garden-view` and `initialSetupComplete` set to `true` (or use Command Center -> change view) to view the Garden.
- You can toggle children locations and family log entries in the Command Center -> System features to see the Garden update.

