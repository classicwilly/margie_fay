const moduleAlias = require('module-alias');
const path = require('path');

// Only install alias if the shim is explicitly enabled
if (process.env.WONKY_E2E_EXTEND_TEST === 'true') {
  try {
    const fixturesPath = path.join(process.cwd(), 'tests', 'e2e', 'playwright-fixtures.ts');
    moduleAlias.addAlias('@playwright/test', fixturesPath);
    // Also add a safe alias to the original package for the fixture to require
    const realPath = require.resolve('@playwright/test');
    moduleAlias.addAlias('@wonky/playwright-test-original', realPath);
    console.log('Alias installed: @playwright/test ->', fixturesPath);
  } catch (e) {
    console.error('Failed to install test alias:', e);
  }
} else {
  console.log('WONKY_E2E_EXTEND_TEST != true; skipping test alias installation');
}
