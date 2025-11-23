import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/?forceView=cockpit');
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('[data-testid="test-airlock-btn"]');
  await page.click('[data-testid="test-airlock-btn"]');
  await page.waitForTimeout(500);
  const mounted = await page.evaluate(() => (window.__WONKY_CONTEXT_RESTORE_MODAL_MOUNTED__ || false));
  console.log('MODAL_MOUNTED_FLAG', mounted);
  const exists = await page.evaluate(() => !!document.querySelector('[data-testid="context-restore-modal"]'));
  console.log('MODAL_PRESENT_IN_DOM', exists);
  await browser.close();
})();
