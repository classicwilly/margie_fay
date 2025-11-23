const { chromium } = require('playwright');

(async () => {
  const url = process.env.VISUAL_URL || 'http://localhost:4173';
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForLoadState('networkidle');
  console.log('Page loaded: ' + url);

  // Wait for H1 if present
  let h1 = null;
  try {
    await page.waitForSelector('h1[data-testid="cockpit-title"]', { timeout: 10000 });
    h1 = await page.$('h1[data-testid="cockpit-title"]');
  } catch (e) {
    // Not found
  }

  // Wait for a card with surface classes (either as card-base or direct class)
  let card = null;
  try {
    await page.waitForSelector('section[class*="bg-surface-800"], section.card-base', { timeout: 10000 });
    card = await page.$('section[class*="bg-surface-800"], section.card-base');
  } catch (e) {
    // Not found
  }

  if (h1) {
    const text = await page.evaluate(el => el.textContent, h1);
    const font = await page.evaluate(el => getComputedStyle(el).fontFamily, h1);
    console.log('H1 found:', text);
    console.log('H1 font-family:', font);
  } else {
    console.warn('H1 not found (data-testid=cockpit-title)');
  }

  if (card) {
    const classes = await page.evaluate(el => el.className, card);
    const style = await page.evaluate(el => ({ background: getComputedStyle(el).backgroundColor, boxShadow: getComputedStyle(el).boxShadow }), card);
    console.log('Card classes:', classes);
    console.log('Card style:', style);
  } else {
    console.warn('No card section found with bg-surface-800 or card-base');
    // List top-level sections and their classes for debugging
    const sections = await page.$$eval('section', nodes => nodes.map(s => ({ className: s.className, text: s.textContent?.trim().slice(0,30) })));
    console.log('Top-level sections count:', sections.length);
    for (let i = 0; i < sections.length; i++) {
      console.log(`section[${i}]`, sections[i]);
    }
  }

  // Print a snippet of the root HTML for debugging
  const rootHtml = await page.$eval('#root', el => el.innerHTML);
  console.log('Root HTML snippet (first 1000 chars):\n', rootHtml.slice(0, 1000));

  // For truth, print localStorage keys to show if test seeds are present
  const storageKeys = await page.evaluate(() => Object.keys(window.localStorage));
  console.log('localStorage keys:', storageKeys);

  await browser.close();
})();
