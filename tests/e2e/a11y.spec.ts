import { test, expect } from './playwright-fixtures';
import axe from 'axe-core';
import fs from 'fs';

test('axe accessibility scan', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.addScriptTag({ content: axe.source });
  const result = await page.evaluate(async () => await (window as any).axe.run());

  // Save raw results for debugging
  const out = JSON.stringify(result, null, 2);
  await page.context().storageState();
  fs.mkdirSync('playwright-axe-results', { recursive: true });
  fs.writeFileSync('playwright-axe-results/axe-results.json', out);

  // Fail if any serious or critical violations
  const severe = result.violations.filter(v => v.impact === 'serious' || v.impact === 'critical');
  expect(severe.length).toBe(0);
});
