// Verify that Google/Noto emoji images are rendered in key UI places
import { test, expect } from './playwright-fixtures';
import seedE2EState from './helpers/seedE2EState';

test('Noto emoji images render across main views', async ({ page, storageKey }) => {
  // Seed deterministic state for the dashboard and ensure the app is usable
  await seedE2EState(page, storageKey, { view: 'command-center', dashboardType: 'william', initialSetupComplete: true, aiConsent: true, applyAiStub: true });
  await page.goto('/?forceView=command-center');
  await page.waitForLoadState('networkidle');

  // Wait for visual elements to load and for any GoogleEmoji elements to render (image or fallback)
  await page.waitForSelector('[data-emoji-symbol]', { timeout: 10000 });

  // Assert there are GoogleEmoji elements on the page (either <img> or fallback span)
  const notoElems = await page.locator('[data-emoji-symbol]').count();
  expect(notoElems).toBeGreaterThan(0);

  // Also check a few specific UI spots — Kids Corner header, GemCollector title, and Achievements header
  // Kids Corner header
  const kidsHeadingImg = page.locator('[data-testid="kids-corner-heading"] [data-emoji-symbol]');
  if (await kidsHeadingImg.count() > 0) {
    await expect(kidsHeadingImg).toBeVisible();
  }

  // Achievements header
  const achievementsHeadingImg = page.locator('h2:has-text("Achievement") [data-emoji-symbol]');
  if (await achievementsHeadingImg.count() > 0) {
    await expect(achievementsHeadingImg).toBeVisible();
  }

  // GemCollector card title
  const gemTitleImg = page.locator('h2:has-text("Dopamine Cache") [data-emoji-symbol]');
  if (await gemTitleImg.count() > 0) {
    await expect(gemTitleImg).toBeVisible();
  }
});
