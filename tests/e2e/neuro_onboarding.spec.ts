import { test, expect } from '@playwright/test';

test.describe('Neuro Onboarding', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?forceView=game-master-dashboard');
    await page.waitForLoadState('networkidle');
  });

  test('Neuro Onboarding can be opened from command palette @smoke', async ({ page }) => {
    // Open Command Palette
    await page.keyboard.press('Meta+K');
    await page.waitForTimeout(500); // Allow animation
    
    // Type "Neuro"
    const input = page.getByPlaceholder(/Type a command|Search/i);
    await input.fill('Neuro');
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
    
    // Force the click on the first found element
    await navItem.click();
    await page.waitForLoadState('networkidle');

    // Verify Import Button exists
    await expect(page.getByText(/Import/i).first()).toBeVisible();
    await page.getByText(/Import/i).first().click();

    // Verify Neurodivergent Templates exist
    await expect(page.getByText(/Neurodivergent/i).first()).toBeVisible();
  });
});