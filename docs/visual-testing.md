# Visual testing with Percy

This project includes optional Percy integration for Playwright-based visual regression testing.

How to enable in CI:

- Add a CI secret named `PERCY_TOKEN` with your Percy project API token.
- Once the secret is present, the `visual-percy` job in `.github/workflows/e2e.yml` will run automatically.
  - Note: Percy Playwright plugin is intentionally not an installed devDependency by default — install it locally if you want to run the visual tests offline: `npm i -D @percy/playwright`.
- Percy will collect visual diffs and show them in the Percy dashboard where you can accept or reject updates.
  - In CI we install the plugin on-demand in the `visual-percy` job so that `npm install` for most developers won't fail if Percy isn't necessary.

Local usage:

```
# run Percy + Playwright locally
npm run visual:percy
```

Note: Percy is optional. If you don't provide `PERCY_TOKEN`, the pipeline for percy will be skipped.
