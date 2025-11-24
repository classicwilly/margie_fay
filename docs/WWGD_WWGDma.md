## Heuristics: Grandpa & Grandma Decision Rules

This doc explains the acronyms used across the project:

- **WWGD** — "What Would Grandpa Do?" — Use this when deciding _how the software works_ or how a feature should _behave_. Voice: pragmatic, timeboxed, incremental, pragmatic, restartable. Examples: error handling behavior, sync strategy, failover behavior, policy for data handling.

- **WWGDma** — "What Would Grandma Do?" — Use this when deciding _how the software looks and feels_ or when a change affects visual design or UX language. Voice: warm, accessible, supportive, readable, and friendly. Examples: copywriting, color choices, spacing, accessible affordances.

PLEASE NOTE: Do not use `WWGD` to refer to Grandma decisions; always use `WWGDma` for Grandma. Using `WWGD` for both creates ambiguity during code review and when scanning PRs and issue comments.

Integration points:

- The `BLUEPRINT.md` contains a short description. The `.github/PULL_REQUEST_TEMPLATE.md` and `.github/ISSUE_TEMPLATE/` include sections for both heuristics.
- For design-heavy PRs, add a short `WWGDma` justification; for behavior or flow changes, add a `WWGD` justification.
