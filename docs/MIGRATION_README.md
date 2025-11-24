# Migration: Safe Rename & Deploy Flow ✅

This document describes the safe-rename workflow, the shim removal flow, and the production sync (Windows path: `C:\WS-OS`) for this repository.

## Purpose

- Provide a safe, incremental migration path to a canonical naming scheme (kebab-case filenames, PascalCase exports for React components).
- Keep backwards compatibility via compatibility shims at the original paths.
- Enforce naming rules via pre-commit and CI checks.

## Safety & Best Practices

- Recommended batch size: **3 files per PR** (increase cautiously when tests and coverage are thorough).
- Keep compatibility shims for at least one release cycle after the rename PR is merged.
- The canonical source-of-truth is `c:\wonky-sprout-os` (git). The folder `C:\WS-OS` is a production snapshot and should only be updated via the sync script.

## Prerequisites

- Node.js and project dependencies installed.
- Branch up-to-date with the base branch (`main` or equivalent).
- A configured `origin` remote if you want `safe-rename` to push branches.

## Quick Workflow

1. Prepare a rename manifest (JSON) that maps old paths to new paths (see `scripts/refactor/rename-manifest.json`).

2. Run the safe-rename locally:

```bash
node scripts/refactor/safe-rename.mjs --manifest=scripts/refactor/rename-manifest.json \
  --commit-branch --push=false
```

This will:

- Move files to the new path(s).
- Create a compatibility shim at the old path (re-exporting the item from the new path).
- Update imports across the repository.
- Create a local branch `refactor/rename-batch-<timestamp>` and commit changes.

1. Review and open a PR

```bash
git branch --show-current
git status
git diff --name-only origin/main...HEAD
git push -u origin $(git rev-parse --abbrev-ref HEAD)
```

1. Merge the PR after reviews and CI verification.

1. Remove shims when safe and unused:

```bash
node scripts/refactor/remove-shims.mjs
```

`remove-shims.mjs` will detect shim files (marked `DEPRECATED SHIM`) and create a branch to remove them if no imports reference the old path.

1. Sync to the production folder `C:\WS-OS` (after PR merges and CI success):

```bash
node scripts/deploy/sync-to-ws-os.mjs --target=C:\WS-OS --files='components/ui/**/*,package.json,scripts/refactor/*'
```

This script copies canonical, tested files to `C:\WS-OS` as an administrative snapshot.

## Notes & Tips

- Use `verify-naming.mjs --staged` in pre-commit to validate only staged files and avoid unrelated blocking.
- Keep rename batches small (recommended: 3 files) to limit review scope and testing burden.
- Run app build and tests locally before pushing PRs.
- Adjust globs and manifests for monorepos or package-level rearrangements.

---

If you find any issues with this canonical document, let me know and I will adjust.
