import { chromium } from "playwright";

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("http://localhost:3000/?forceView=cockpit");
  await page.waitForLoadState("networkidle");
  // Prefer new workshop test id 'test-estop-btn' but fallback to legacy 'test-airlock-btn'
  const estopSelector = '[data-workshop-testid="test-estop-btn"]';
  const legacySelector = '[data-testid="test-airlock-btn"]';
  if (await page.$(estopSelector)) {
    await page.waitForSelector(estopSelector);
    await page.click(estopSelector);
  } else {
    await page.waitForSelector(legacySelector);
    await page.click(legacySelector);
  }
  await page.waitForTimeout(500);
  const mounted = await page.evaluate(
    () => window.__WONKY_CONTEXT_RESTORE_MODAL_MOUNTED__ || false,
  );
  console.log("MODAL_MOUNTED_FLAG", mounted);
  const exists = await page.evaluate(
    () => !!document.querySelector('[data-testid="context-restore-modal"]'),
  );
  console.log("MODAL_PRESENT_IN_DOM", exists);
  await browser.close();
})();
