# Security & Secrets Handling

This document explains how to handle secrets, how to avoid committing secrets to the repository, and what to do if a secret is accidentally committed.

1. Never commit `.env` files containing secrets. Use `.env.example` for placeholder values.
2. Use GitHub secrets, GCP Secret Manager, or other managed secret stores for production keys.
3. Local development: copy `.env.example` to `.env.local` and set your local secrets. `.env.local` is ignored by `.gitignore` and should never be committed.

Accidental commit of secrets:

1. Remove the file and commit the change: `git rm --cached <file>` and commit.
2. Rotate the exposed secret in the cloud console and update secret manager entries.
3. If the key was committed to git history, use `git filter-repo` or `BFG` to scrub it from history, coordinate with maintainers, and rebase forks.
4. Re-run repository secret scan and CI to validate the leak is resolved.

CI & pre-commit scans:

- A pre-commit hook runs a local scan (`npm run security:scan`) to detect common patterns.
- The CI includes a `secret-scan` job and a `gitleaks` action to validate the repo state on pushes and PRs.

Contact your SOC or security admin for any rotation or risk management steps.

## Security Policy

If you discover a security vulnerability affecting this repository, please send an email to security@example.com with details of the issue.

This project follows standard disclosure practices: patch or mitigation will be published after a reasonable period.
