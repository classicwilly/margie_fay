import { test, expect } from './playwright-fixtures';
import seedE2EState from './helpers/seedE2EState';

const consentModalLocator = '[data-testid="ai-consent-title"]';

test('consent key present => consent modal not shown', async ({ page, storageKey }) => {
  await seedE2EState(page, storageKey, { view: 'command-center', dashboardType: 'william', initialSetupComplete: true, aiConsent: true, applyAiStub: true });
  await page.goto('/?forceView=command-center');
  await page.waitForLoadState('networkidle');
  await expect(page.locator(consentModalLocator)).toBeHidden({ timeout: 10000 });
});

test('consent key absent => consent modal shown', async ({ page, storageKey }) => {
  await seedE2EState(page, storageKey, { view: 'command-center', dashboardType: 'william', initialSetupComplete: true, aiConsent: false, applyAiStub: true });
  await page.goto('/?forceView=command-center');
  await page.waitForLoadState('networkidle');
  await expect(page.locator(consentModalLocator)).toBeVisible({ timeout: 10000 });
});
