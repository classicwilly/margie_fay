import { chromium } from 'playwright';

(async () => {
  console.log('DEBUG CAPTURE START');
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', (msg) => console.log('PAGE LOG:', msg.type(), msg.text()));
  page.on('pageerror', (err) => console.log('PAGE ERROR:', err.message));

  try {
    const port = process.env.WONKY_PREVIEW_PORT || '4176';
    const url = `http://localhost:${port}/`;
    console.log('NAVIGATING TO', url);
    await page.goto(url);
    await page.waitForLoadState('networkidle');

    console.log('Page title:', await page.title());
    await page.waitForTimeout(1000);

    const debugError = await page.evaluate(() => window.localStorage.getItem('wonky-last-error'));
    console.log('DEBUG_LOCAL_STORAGE_WONKY_LAST_ERROR:', debugError);

    const errDomText = await page.$eval('[data-testid="wonky-last-error"]', (el) => el.textContent).catch(() => null);
    console.log('ERR_DOM_TEXT:', errDomText);

    // Check for ErrorBoundary DOM
    const boundary = await page.$('[data-testid="wonky-error-boundary"]');
    console.log('ErrorBoundary DOM present?', !!boundary);

  } catch (e) {
    console.error('ERR_CAT', e);
  } finally {
    await browser.close();
    console.log('DEBUG CAPTURE FINISHED');
  }
})();
