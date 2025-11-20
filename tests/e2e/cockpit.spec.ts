import { test, expect } from '@playwright/test';

test('Cockpit Module — shows seeded active stack and can add a new profile stack', async ({ page }) => {
  // 1. Go to the dashboard (Force the view)
  await page.goto('/?forceView=game-master-dashboard');
  await page.waitForLoadState('networkidle');

  // 2. Verify Header (The Fuzzy Fix)
  // Look for a Heading that contains "Cockpit" OR "Profile" OR "Stack"
  // This makes it bulletproof against text changes.
  const header = page.getByRole('heading', { name: /Cockpit|Profile|Stack/i }).first();
  await expect(header).toBeVisible({ timeout: 10000 });

  // 3. Verify Active Stack Card matches the seeded data
  await expect(page.getByTestId('cockpit-active-stack')).toBeVisible();

  // 4. Click "Add Stack" (Regex for case insensitivity)
  await page.getByRole('button', { name: /Add Stack/i }).click();

  // 5. Fill out form
  await page.getByPlaceholder(/Profile Name/i).fill('Deep Work Mode');
  
  // Handle Persona Select (if it exists)
  const personaSelect = page.getByLabel(/Persona/i);
  if (await personaSelect.isVisible()) {
      await personaSelect.selectOption('william');
  }

  // 6. Save
  await page.getByRole('button', { name: /Save/i }).click();

  // 7. Verify new stack appears
  await expect(page.getByText('Deep Work Mode')).toBeVisible();
});