const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString(), err.stack));
  await page.addInitScript(() => {
    try {
      window.__E2E_FORCE_VIEW__ = 'command-center';
      window.__WONKY_TEST_INITIALIZE__ = { dashboardType: 'william', view: 'command-center', initialSetupComplete: true };
      window.__PLAYWRIGHT_SKIP_DEV_BYPASS__ = true;
    } catch (e) { /* ignore */ }
  });
  await page.goto('http://localhost:4173', { waitUntil: 'load' });
  await page.waitForLoadState('networkidle');
  console.log('Page loaded after seeding');
  const found = await page.$('h1[data-testid="command-center-title"]');
  if (found) {
    console.log('Command Center title present');
    const text = await page.evaluate(el => el.textContent, found);
    console.log('Title:', text);
  } else {
    console.log('Command Center title not found');
  }
  // Also check for card element
  const card = await page.$('section[class*="bg-surface-800"]');
  if (card) {
    const className = await page.evaluate(el => el.className, card);
    console.log('Found card with classes:', className);
  } else {
    console.log('Card not found');
  }
  await browser.close();
})();
