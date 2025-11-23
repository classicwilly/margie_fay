# Refactor scripts

This folder contains utilities to perform automated refactors and cleanups using ts-morph.

Files:
- `safe-rename.mjs`: Move/rename files safely, update imports, and create compatibility shims at old paths.
  - Usage: `node scripts/refactor/safe-rename.mjs --manifest=scripts/refactor/rename-manifest.json`
  - The manifest is a JSON array of `{from, to}` mappings relative to the repository root.

- `remove-shims.mjs`: Detect shims added during migration and remove them if there are no references remaining.
  - Usage: `node scripts/refactor/remove-shims.mjs`

Checklist to use these scripts safely:
1. Run `node scripts/refactor/safe-rename.mjs --manifest=scripts/refactor/rename-manifest.json`.
2. Run `npm run verify-naming` or `node ./scripts/verify-naming.mjs <single-file>` to validate.
3. Build and test locally: `npm run build && npm test`.
4. Commit and push to a new branch: `git push -u origin <branch>` and open a PR.
5. Use `node scripts/refactor/remove-shims.mjs` on the PR branch to detect and remove obsolete shims when safe.
