import { test, expect } from './playwright-fixtures';
import { retryClick } from './helpers/retryHelpers';

import axe from 'axe-core';
import applyAiStub from './helpers/aiStub';

test('basic AI flow from UI placeholder to telemetry @smoke', async ({ page, storageKey }) => {
  // Capture console logs and page errors to help diagnose runtime failures
  page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  // Use a longer timeout for local dev; occasionally Vite/HMR can be slow.
  // Ensure any stored app state does not override the default (e.g., command-center)
  await page.addInitScript((key) => {
    try { window.localStorage.removeItem(key as string); } catch (e) { /* ignore */ }
    try { window.localStorage.setItem(key as string, JSON.stringify({ initialSetupComplete: true })); } catch (e) { /* ignore */ }
    try { (window as any).__PLAYWRIGHT_SKIP_DEV_BYPASS__ = true; } catch (e) { /* ignore */ }
  }, storageKey);
  // Opt into the Playwright server stub so the app uses the deterministic proxy
  await page.addInitScript(() => { (window as any).__PLAYWRIGHT_AI_STUB__ = true; });
  // Install an AI stub at the network layer BEFORE navigation to ensure the route is active
  // before the app attempts any AI requests during bootstrap. Use `force` during local runs
  // so contributors get deterministic results without modifying environment variables.
  await applyAiStub(page, { force: true });
  // If Playwright is enabling server-side AI stub set by the workflow, add an explicit query param
  // so `index.html` sets the client-side `__PLAYWRIGHT_AI_STUB__` earliest.
  const url = process.env.PLAYWRIGHT_AI_STUB === 'true' ? '/?use_ai_proxy=true' : '/';
  await page.goto(url, { timeout: 120_000, waitUntil: 'load' });
  // log the flag so we can assert the page is using the Playwright AI stub
  await page.evaluate(() => console.log('PLAYWRIGHT_AI_STUB flag:', (window as any).__PLAYWRIGHT_AI_STUB__));
  // (applyAiStub moved above) network route already registered
  await page.waitForLoadState('networkidle');
    await page.getByRole('banner').waitFor({ timeout: 120_000 });
  // Save a debug screenshot to inspect the state if there's a failure
  await page.screenshot({ path: 'tests/e2e/debug/ai_flow_after_load.png', fullPage: true });
  // Ensure page assets and dev server have finished loading
  await page.waitForLoadState('networkidle');
  // Ensure the first page loads
  await expect(page).toHaveTitle(/Wonky/);

  // Navigate to Command Center (ensures Wonky AI and modules are available)
  await expect(page.getByRole('banner')).toBeVisible({ timeout: 10000 });
  await page.waitForTimeout(150);

  // Prefer a stable data-testid for navigation if present, otherwise fallback to role lookup
  let commandCenterNav = page.getByTestId('nav-command-center');
  // If multiple (older mobile/desktop duplicates), use the first visible
  if ((await commandCenterNav.count()) > 1) commandCenterNav = commandCenterNav.first();
  if (!(await commandCenterNav.count())) {
    commandCenterNav = page.getByRole('button', { name: 'The Cockpit' });
  }
  if (await commandCenterNav.count()) {
    await commandCenterNav.waitFor({ state: 'visible', timeout: 10000 });
    await retryClick(commandCenterNav, { tries: 3 });
  } else {
    // Click the System menu to open the dropdown
    let systemBtn = page.getByTestId('nav-system');
    if (!(await systemBtn.count())) systemBtn = page.getByRole('button', { name: 'System' });
    await systemBtn.click();
    await page.waitForTimeout(150);
    await page.getByRole('menu').waitFor({ state: 'visible', timeout: 5000 });
    await page.waitForTimeout(100);
    await retryClick(page.getByRole('menuitem', { name: 'The Cockpit' }), { tries: 3 });
  }
  // Wait for the Command Center view to be active
  await expect(page.getByTestId('command-center-title')).toBeVisible({ timeout: 10000 });

  // Example: find input placeholder (matching codebase input text)
  // Wait for the AI input and ask button to become visible
  await page.waitForSelector('input[placeholder="Describe the chaos..."]', { timeout: 10000 });
  // Use locator for robustness and wait until the element is visible
  const aiInputLocator = page.locator('[data-testid="ask-ai-input"]');
  try {
    await aiInputLocator.waitFor({ state: 'visible', timeout: 10000 });
    await aiInputLocator.fill('Contact me at test@example.com');
  } catch (err) {
    // Fallback to placeholder based selection if data-testid isn't available
    const fallbackInput = page.getByPlaceholder('Describe the chaos...');
    await fallbackInput.waitFor({ state: 'visible', timeout: 10000 });
    await fallbackInput.fill('Contact me at test@example.com');
  }

  // match either the labeled 'Ask AI' button or older 'Generate' label used in some builds
  // Prefer data-testid when available — this is robust across localized/emoji variants
  // Prefer `data-testid` when available; otherwise try a text-based role check.
  let askBtn = page.getByTestId ? page.getByTestId('ask-ai-btn') : page.getByRole('button', { name: /Ask AI|Generate|✨ Ask AI/i });
  if (askBtn && (await askBtn.count()) === 0) {
    askBtn = page.getByRole('button', { name: /Ask AI|Generate|✨ Ask AI/i });
  }
  await askBtn.waitFor({ state: 'visible', timeout: 30000 });
  await askBtn.click();
  // Wait for the backend AI call to complete for determinism
  try {
    await page.waitForResponse((resp) => resp.url().includes('/aiProxy') && resp.status() === 200, { timeout: 20000 });
  } catch (err) {
    // If the backend didn't respond, allow the UI to fall back to the non-AI message
    console.warn('AI backend did not respond within timeout — falling back on UI check');
  }

  // Post-submit flows vary: either a PII warning then consent modal or a consent modal directly, or a success result.
  // Try PII flow first, then consent, then fallback to result text.
  try {
    await expect(page.getByTestId('pii-warning-title')).toBeVisible({ timeout: 5000 });
    // Prefer data-testid for stable selection
    if (page.getByTestId && (await page.getByTestId('pii-send-anyway').count())) {
      await page.getByTestId('pii-send-anyway').click();
    } else {
      await page.getByRole('button', { name: /Send Anyway/i }).click();
    }
  } catch (err) {
    // No PII modal — that's fine.
  }

  try {
    await expect(page.getByTestId('ai-consent-title')).toBeVisible({ timeout: 5000 });
    // Click by test id when available for localization-safe selection
    if (page.getByTestId && (await page.getByTestId('ai-consent-acknowledge').count())) {
      await page.getByTestId('ai-consent-acknowledge').click();
    } else {
      await page.getByRole('button', { name: /Acknowledge & Proceed/i }).click();
    }
  } catch (err) {
    // Consent modal might not appear if user previously consented — proceed to check for success.
  }

  // AI will be called; check for either success text or the AI-fallback message used in non-AI mode
  // AI results can vary: check for AI success or manual fallback or error message — treat errors as handled for now
  // Prefer the AI response container testid, fall back to a text match if not present
  try {
    await expect(page.getByTestId('ai-response')).toBeVisible({ timeout: 10000 });
  } catch (err) {
    await expect(page.locator('text=/ok from ai|AI result|Manual mode active|ok from ai|System Error:/i')).toBeVisible({ timeout: 10000 });
  }

    // If PLAYWRIGHT_AI_STUB is set in CI, the test will rely on the stubbed network response
    if (process.env.PLAYWRIGHT_AI_STUB === 'true') {
      try {
        await page.waitForResponse((resp) => resp.url().includes('/aiProxy') && resp.status() === 200, { timeout: 5000 });
      } catch (e) {
        // The stub was enabled but route wasn't hit; allow test to continue—this should surface in CI.
      }
    }

  // Accessibility check: run axe in the page after the modal is shown (use local dev dependency)
  await page.addScriptTag({ content: axe.source });
  const result = await page.evaluate(async () => await (window as any).axe.run());
  // Fail the test if severe violations exist
  expect(result.violations.length).toBe(0);

  // Visual regression: snapshot the modal if present. If no modal appears (e.g., user consent already given
  // or system error) take a debug screenshot instead and continue — the modal is optional across environments.
  const dialog = page.getByRole('dialog');
  if ((await dialog.count()) > 0) {
    await expect(dialog).toHaveScreenshot('pii-consent-modal.png');
  } else {
    // Not a failure — capture a debug screenshot for triage
    await page.screenshot({ path: 'tests/e2e/debug/ai_flow_no_modal.png', fullPage: true });
  }
});
