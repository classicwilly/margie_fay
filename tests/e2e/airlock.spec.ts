import { test, expect } from './playwright-fixtures';
import { ensureAppView, retryClick } from './helpers/retryHelpers';

test('Airlock — Test Airlock Protocol opens modal and starts decompression timer @smoke', async ({ page }) => {
  test.setTimeout(60_000);
  // 1) Force the app to the Game Master Dashboard / Cockpit view
  await page.goto('/?forceView=game-master-dashboard');
  await page.waitForLoadState('networkidle');
  try { await ensureAppView(page, 'game-master-dashboard'); } catch (e) { /* ignore — fallbacks below will make it visible */ }

  // 2) Find the Test Airlock Protocol button — prefer role-based lookup for stability
  const testAirlockBtn = page.getByRole('button', { name: /Test Airlock Protocol/i }).first();
  await expect(testAirlockBtn).toBeVisible({ timeout: 10000 });

  // 3) Click it and validate the modal appears
  await retryClick(testAirlockBtn, { tries: 3 });

  // The modal has a heading with 'Airlock' or 'Decompression' in the title
  const modalHeading = page.getByRole('heading', { name: /Airlock|Decompression/i });
  await expect(modalHeading).toBeVisible({ timeout: 5000 });

  // The decompression timer is rendered as e.g. '60s' — select the second span in the timer row
  const timerContainer = page.getByText('Decompression Timer:');
  const timerValueSpan = timerContainer.locator('..').locator('span').nth(1);
  await expect(timerValueSpan).toBeVisible({ timeout: 2000 });
  const t1Raw = (await timerValueSpan.innerText()).trim();
  expect(t1Raw).toMatch(/^\d+s$/);
  const t1 = parseInt(t1Raw.replace('s', ''), 10);

  // Wait a bit and assert that it has decreased
  await page.waitForTimeout(1200);
  const t2Raw = (await timerValueSpan.innerText()).trim();
  const t2 = parseInt(t2Raw.replace('s', ''), 10);
  expect(t2).toBeLessThan(t1);

  // Verify the restore button starts disabled while timer > 0 and physical task unchecked
  const restoreBtn = page.getByRole('button', { name: /Complete Decompression to Restore|Restore Context & Resume/i }).first();
  await expect(restoreBtn).toBeDisabled();
});
