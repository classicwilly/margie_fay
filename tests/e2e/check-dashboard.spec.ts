import { test, expect } from '@playwright/test';

test('Dashboard modules are visible', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  // Wait for the grid to render
  await page.waitForSelector('text=Critical Tasks', { timeout: 5000 });
  const headers = [
    '🥗 Daily Essentials',
    '👶 Kids Status',
    '🚀 Workspace Launchpad',
    '🎯 Critical Tasks',
    '🧠 Mood',
    '🏆 Achievements'
  ];
  for (const text of headers) {
    const el = page.getByText(text).first();
    await expect(el).toBeVisible();
  }
});
