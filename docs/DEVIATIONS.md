# DEVIATIONS & Rollback Runbook

This document tracks temporary deviations from design, configuration, or code that were introduced to fix regressions or unblock progress. Follow the steps below to rollback deviations.

Rollback Steps

1. Identify the PR or change to revert using `git log`.
2. Run `git revert <commit>` on the feature branch or create a hotfix PR.
3. Run `npm run build` and ensure all tests pass (`npm test`).
4. If the change included Tailwind token renames, search for `card-dark` or `sanctuary-*` to ensure no stale references remain.

Critical changes that may require reversal

- Tailwind token merges (e.g., mapping `card-dark` -> `sanctuary-card`) — reversible but requires touching many components.
- Provider or context restructures — these can break many pages and require thorough integration tests.

Emergency flags and backout plan

- Decide whether to revert token changes or simply add theme aliases to bridge UX differences.
- For provider changes add a temporary feature flag 'legacyProvider' in `FeatureFlagsProvider` to use the previous provider stack.

Post-rollout checks

- Ensure all REACT contexts are available in test wrappers.
- Ensure `ApiKey` and AI features are protected by `FeatureFlags`.
