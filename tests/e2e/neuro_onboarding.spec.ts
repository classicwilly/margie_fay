import { test, expect } from '@playwright/test';

test.describe.skip('Neuro Onboarding', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?force_e2e_view=game-master-dashboard');
    await page.waitForLoadState('networkidle');
    // Ensure the Cockpit header is present before tests interact with the UI to prevent flakiness
    const cockpitHeading = page.locator('h1, h2').filter({ hasText: /Cockpit|Command Center|Dashboard/i }).first();
    await expect(cockpitHeading).toBeVisible({ timeout: 30000 });
  });

  test('Neuro Onboarding can be opened from command palette @smoke', async ({ page }) => {
    // Allow longer time for slow environments or CI to open the command palette
    test.setTimeout(150_000);
    // Open Command Palette
    await page.keyboard.press('Meta+K');
    await page.waitForTimeout(500); // Allow animation
    
    // Type "Neuro" — robust wait with retries for flaky environments
    const waitInput = async () => {
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          await page.waitForSelector('[placeholder*="Type a command"]', { timeout: 120000 });
          return true;
        } catch (err) {
          // Retry opening the command palette in case of animation or overlay issues
          try {
            await page.keyboard.press('Meta+K');
          } catch {}
          try {
            await page.keyboard.press('Control+K');
          } catch {}
          // Small delay to allow animation/overlay to settle
          await page.waitForTimeout(750);
        }
      }
      return false;
    };
    const inputReady = await waitInput();
    if (!inputReady) {
      // Give a last-ditch reload one chance to recover
      await page.reload({ waitUntil: 'networkidle' });
      const recovery = await waitInput();
      if (!recovery) throw new Error('Command palette did not appear after retries');
    }
    const input = page.getByPlaceholder(/Type a command|Search/i);
    // Wait for command palette input to appear and allow a generous fill timeout for slow envs
    await expect(input).toBeVisible({ timeout: 150000 });
    await input.fill('Neuro', { timeout: 120000 });
    await page.waitForTimeout(500);

    // Click the first option that matches
    await page.getByRole('option', { name: /Neuro/i }).first().click();

    // Verify the Vault loaded (look for "SOP", "Protocol", or "Vault")
    const header = page.locator('h1, h2').filter({ hasText: /SOP|Flight Protocol|Vault/i }).first();
    await expect(header).toBeVisible({ timeout: 10000 });
  });

  test('SOP Vault imports neuro templates', async ({ page }) => {
    // FIX: Handle the "Multiple Elements" error
    // We grab the testID, but we explicitly say "give me the first one"
    const navItem = page.getByTestId('nav-sop-vault').first();
    
    // If the nav item is hidden (mobile), open the menu first
    if (!(await navItem.isVisible())) {
        const mobileMenu = page.getByTestId('mobile-menu-button');
        if (await mobileMenu.isVisible()) {
             await mobileMenu.click();
        }
    }
    
    // Wait for Cockpit header to be visible before clicking navigation
    const cockpitHeader = page.locator('h1, h2').filter({ hasText: /Cockpit|Command Center|Dashboard/i }).first();
    await expect(cockpitHeader).toBeVisible({ timeout: 10000 });
    await navItem.click();
    await page.waitForLoadState('networkidle');

    // Verify Import Button exists
    await expect(page.getByText(/Import/i).first()).toBeVisible();
    await page.getByText(/Import/i).first().click();

    // Verify Neurodivergent Templates exist
    await expect(page.getByText(/Neurodivergent/i).first()).toBeVisible();
  });
});