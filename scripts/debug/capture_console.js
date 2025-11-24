import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', (msg) => console.log('PAGE LOG:', msg.type(), msg.text()));
  page.on('pageerror', (err) => console.log('PAGE ERROR:', err.message));

  try {
    await page.goto('http://localhost:4176/');
    await page.waitForLoadState('networkidle');

    await page.waitForTimeout(1000);

    const debugError = await page.evaluate(() => window.localStorage.getItem('wonky-last-error'));
    console.log('DEBUG_LOCAL_STORAGE_WONKY_LAST_ERROR:', debugError);

    const errDomText = await page.$eval('[data-testid="wonky-last-error"]', (el) => el.textContent).catch(() => null);
    console.log('ERR_DOM_TEXT:', errDomText);
  } catch (e) {
    console.error('ERR_CAT', e);
  } finally {
    await browser.close();
  }
})();
