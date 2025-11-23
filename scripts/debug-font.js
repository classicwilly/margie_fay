const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  const bodyFont = await page.evaluate(() => window.getComputedStyle(document.body).getPropertyValue('font-family'));
  const h1 = await page.evaluate(() => {
    const h = document.querySelector('h1');
    return window.getComputedStyle(h).getPropertyValue('font-family');
  });
  console.log('Body font:', bodyFont);
  console.log('H1 font:', h1);
  await browser.close();
})();