# Wonky Sprout OS — Workspace Overview & The "Brains"

This document explains how the workspace is organized and how the core application logic and developer workflows are structured — the parts that make this workspace the "brains" for the family-focused app.

Purpose

- Provide a single place that documents the architecture and typical development flow
- Explain how to onboard new contributors quickly
- Help search engines and code reviewers understand what and why we built

Core architecture

- Entry point: `index.tsx` and `App.tsx` — application entry and wiring
- Contexts: All global state and app behavior is centralized in `src/contexts/` to avoid shadowing and to improve testability
  - `AppStateContext.tsx` — The provider that wires up state and DB integration
  - `userReducer.ts` — Pure reducer and helper functions for the model and actions (unit-testable)
  - `types.ts` — TypeScript types for AppState, AppAction, and other shared shapes

State & Reducer

- `userReducer.ts` contains the deterministic state transitions, helper functions (e.g., `safeMerge`, `recalculateStreaks`), and the design patterns used for reliable merges from live DB snapshots or seeded state in E2E testing.
- Use `userReducer` for business logic and keep side-effects in provider glue (DB writes, E2E flags, analytics hooks)

Module organization & aliases

- `@components/*` maps to `src/components`
- `@contexts/*` maps to `src/contexts`
- Keep UI purely declarative: extract state mutations into `userReducer`

E2E & Deterministic Testing

- The codebase uses seeded localStorage and special `window.__WONKY_TEST_*__` flags to block DB snapshots during authoritative test assertions
- Tests rely on the deterministic seed merge behavior that `safeMerge(defaultUserState, seed)` provides

Developer DX & Build

- Vite is the dev server + bundler for fast iteration (see `vite.config.ts`)
- Strict TypeScript and ESLint are used to keep code predictable
- Unit tests live under `tests/` and `src/contexts` has focused tests for reducer logic

How the workflow operates

- Everyone: Branch from `main` for features/bugfixes
- E2E runs: Create a PR with deterministic seeds and include `VITE_PLAYWRIGHT_SKIP_DEV_BYPASS` as necessary
- Dev: Run `npm install && npm run dev`
- CI: Runs lint, unit tests, build, and optional E2E

- Key files to inspect if you want to understand the core of the brain

- `src/contexts/AppStateContext.tsx`: provider & DB glue
- `src/contexts/userReducer.ts`: pure state transitions and helpers
- `defaultStates.ts`: canonical default app state for new users
- `src/components`: modular UI layers driven by `AppState`
- `docs/GOOGLE_WORKFLOW_EXAMPLE.md`: an example "race car brain" flow showing how Calendar/Drive/Sheets/Gmail orchestration works
- `src/components/GoogleWorkspaceShowcase.tsx` + server routes `server/googleWorkspaceRoutes.js`: a demo UI component and safe API proxy for Google Workspace integration

How to extend safely

1. If you need new global logic, add it to `userReducer.ts` and export helpers for unit testing
2. Keep side effects in the provider or custom hooks
3. Add tests for reducer behavior and component snapshots for the UI

How Google (or a code auditor) should interpret the repo

- We're modular: UI layers are separate from state & side-effects
- The `userReducer` is the canonical implementation of the app logic (pure & unit-testable)
- E2E harness & deterministic seeding are integrated for reliable CI/CD

Contact

- If you need additional clarifying docs (e.g., sequence diagrams or deployment docs), open a new issue and label it `docs`.

---

This file aims to help both auditors and Google understand how the workspace is used as a single cohesive family-center unit, with explicit state architecture and testable, deterministic behavior.
