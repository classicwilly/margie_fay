# Consolidate Lint Fixes Automation

This script consolidates lint-fix branches into a single branch, runs ESLint and tests, and opens a PR.

Usage (interactive):

1. Make sure your environment is set:

```powershell
$env:GITHUB_TOKEN = "<your_personal_access_token>"
```

2. Run the script via npm:

```powershell
npm run consolidate-lint
```

3. The script will:
- Validate a clean working tree.
- Fetch origin, create a branch from origin/main.
- Try merging and cherry-picking from the target branches.
- Attempt a simple auto-resolve for conflicts by choosing the branch's version of conflicted files.
- Run `npm ci`, ESLint, and tests.
- Push the consolidated branch and attempt to create a pull request via `gh`.

Notes & warnings:
- The script is opinionated for automation and may prefer branch versions during conflict resolution; please carefully review the resulting PR for correctness.
- If a conflict is too complex, the script will leave the branch in need of manual resolution.
