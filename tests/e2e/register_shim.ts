import moduleAlias from 'module-alias';
import path from 'path';
import { createRequire } from 'module';

// The shim allows an opt-in environment variable to remap imports from
// `@playwright/test` to our local `playwright-fixtures.ts` which extends the
// test fixtures with worker-scoped `storageKey`. Only enable if explicitly set
// to avoid changing default behavior for contributors who haven't opted in.
// Always register our alias so tests importing `@playwright/test` will
// resolve to the local fixture that extends the worker-scoped `storageKey`.
// This file is intentionally imported early by `playwright.config.ts`.
if (process.env.WONKY_E2E_EXTEND_TEST === 'true') {
  console.log('WONKY_E2E_EXTEND_TEST is true — installing module alias for @playwright/test -> playwright-fixtures');
  // Step 1: map a safe alias to the real Playwright test module. This lets the
  // fixture require the real implementation without triggering the alias.
  const requireReal = createRequire(import.meta.url);
  const realModulePath = requireReal.resolve('@playwright/test');
  moduleAlias.addAlias('@wonky/playwright-test-original', realModulePath);

  // Step 2: map the public '@playwright/test' identifier to the fixture file.
  const fixturesPath = path.join(process.cwd(), 'tests', 'e2e', 'playwright-fixtures.ts');
  moduleAlias.addAlias('@playwright/test', fixturesPath);
}

// No default export needed; the shim side-effects are sufficient.
