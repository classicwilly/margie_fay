import { test, expect, Page } from '@playwright/test';
import { applyAiStub } from './helpers/aiStub';
import { retryClick } from './helpers/retryHelpers';

// Define a stable click sequence for the floating button
const clickFloatBtn = async (page: Page) => {
  const floatBtn = page.getByTestId('open-ask-ai');

  // 1. Wait until the button is visible and enabled (resilient wait)
  await expect(floatBtn).toBeVisible({ timeout: 15000 });

  // 2. Use a retried click with clickOptions to stabilize interaction
  await retryClick(floatBtn, {
    tries: 4,
    interval: 250,
    clickOptions: { force: true, position: { x: 5, y: 5 }, timeout: 15000 }
  });
};

test.describe('Ask Persona Flows (Grandma, Grandpa, Bob, Marge)', () => {
    // Ensure AI stubbing is applied before each test for deterministic persona responses
    test.beforeEach(async ({ page }) => {
      await applyAiStub(page);
    });
  test('shows a response through the sidebar and floating button', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#main-content');

    await clickFloatBtn(page);

    // Focus on the input and type a query
    const input = page.getByTestId('grandma-input');
    await expect(input).toBeVisible();
    await input.fill('How do I fix this drawer?');

    // Click ASK
    const ask = page.getByTestId('grandma-ask-button');
    await ask.scrollIntoViewIfNeeded();
    await ask.click();

    // Assert the response shows and contains the persona signature
    const response = page.locator('[data-testid="grandma-output"]').first();
    // Wait for the output element to be attached (allow up to 30s for slower AI responses)
    await response.waitFor({ state: 'attached', timeout: 30000 });
    await expect(response).toHaveText(/Love, Grandma/i, { timeout: 15000 });
  });

  test('shows Grandpa response when persona switched and retains generic quick action compatibility', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#main-content');

    await clickFloatBtn(page);

    const personaSelect = page.locator('select[aria-label="AI persona"]').first();
    await personaSelect.waitFor({ state: 'visible' });

    // Switch persona to Grandpa
    await personaSelect.selectOption({ value: 'grandpa' });

    const input = page.getByTestId('grandma-input');
    await expect(input).toBeVisible();
    await input.fill('How do I prune these roses?');

    const askBtn = page.getByTestId('grandma-ask-button');
    await askBtn.scrollIntoViewIfNeeded();
    await askBtn.click();

    const response = page.locator('[data-testid="grandma-output"]').first();
    // Wait for output to be present before checking text — allow long wait for AI stubbed responses
    await response.waitFor({ state: 'attached', timeout: 30000 });
    await expect(response).toHaveText(/Love, Grandpa/i, { timeout: 15000 });
  });

  test('shows Bob response when persona switched', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#main-content');

    await clickFloatBtn(page);

    const personaSelect = page.locator('select[aria-label="AI persona"]').first();
    await personaSelect.waitFor({ state: 'visible' });

    await personaSelect.selectOption({ value: 'bob' });

    const input = page.getByTestId('grandma-input');
    await expect(input).toBeVisible();
    await input.fill('Can I fix a loose fence post?');

    const askBtn = page.getByTestId('grandma-ask-button');
    await askBtn.scrollIntoViewIfNeeded();
    await askBtn.click();

    const response = page.locator('[data-testid="grandma-output"]').first();
    await response.waitFor({ state: 'attached', timeout: 30000 });
    await expect(response).toHaveText(/—Bob\./i, { timeout: 15000 });
  });

  test('shows Marge response when persona switched', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#main-content');

    await clickFloatBtn(page);

    const personaSelect = page.locator('select[aria-label="AI persona"]').first();
    await personaSelect.waitFor({ state: 'visible' });

    await personaSelect.selectOption({ value: 'marge' });

    const input = page.getByTestId('grandma-input');
    await expect(input).toBeVisible();
    await input.fill('Help me organize a small pantry');

    const askBtn = page.getByTestId('grandma-ask-button');
    await askBtn.scrollIntoViewIfNeeded();
    await askBtn.click();

    const response = page.locator('[data-testid="grandma-output"]').first();
    await response.waitFor({ state: 'attached', timeout: 30000 });
    await expect(response).toHaveText(/—Marge\./i, { timeout: 15000 });
  });
});
 
