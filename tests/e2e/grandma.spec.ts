import { test, expect } from '@playwright/test';

test.describe('Ask Grandma', () => {
  test('shows a response through the sidebar and floating button', async ({ page }) => {
    await page.goto('/');
    // Wait for app to load
    await page.waitForSelector('#main-content');
    // Ensure the Ask Grandma floating button exists and click
    const floatBtn = page.locator('[aria-label="Open Ask Grandma"]');
    await expect(floatBtn).toBeVisible();
    await floatBtn.click();
    // Focus on the input and type a query
    const input = page.locator('#grandma-input');
    await expect(input).toBeVisible();
    await input.fill('How do I fix this drawer?');
    // Click ASK
    const ask = page.locator('button:has-text("ASK")');
    await ask.click();
    // Assert the response shows and contains the grandma signature
    const response = page.locator('text=Love, Grandma');
    await expect(response).toBeVisible({ timeout: 15000 });
  });
});
