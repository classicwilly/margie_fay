import { Page, Locator } from '@playwright/test';

export async function retryUntil<T>(fn: () => Promise<T>, retries = 3, interval = 500): Promise<T> {
  let lastErr: any;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      await new Promise((r) => setTimeout(r, interval));
    }
  }
  throw lastErr;
}

export async function waitForAppView(page: Page, view: string, timeout = 3000): Promise<void> {
  await page.waitForFunction(
    (v) => (window as any).appState?.view === v,
    view,
    { timeout }
  );
}

export async function ensureAppView(page: Page, view: string, tries = 3, interval = 500): Promise<void> {
  await retryUntil(async () => {
    await page.waitForTimeout(100); // small breathing room
    // If the test debug chip is present, prefer that as the canonical signal
    // to avoid relying on header/menu ordering. This helps tests be
    // deterministic for neurodivergent users who want the same visible
    // anchor during checks.
    try {
      const e2e = await page.$('[data-testid="e2e-runtime-view"]');
      if (e2e) {
        const txt = await page.getByTestId('e2e-runtime-view').innerText();
        if (txt && txt.includes(view)) return;
      }
    } catch { /* ignore */ }
    if ((await page.evaluate((v) => (window as any).appState?.view === v, view))) return;
    // Try clicking the nav-child-dashboard to force a view change if present
    const nav = page.locator('[data-testid="nav-child-dashboard"]');
    if ((await nav.count()) > 0) {
      await nav.first().click();
      await page.waitForLoadState('networkidle');
      await waitForAppView(page, view, 2000);
      return;
    }
    // Otherwise attempt a menu fallback
    const systemBtn = page.locator('[data-testid="nav-system"]');
    if ((await systemBtn.count()) > 0) {
      await systemBtn.first().click();
      // Scope the menu lookup to the System menu instance to avoid strict-mode
      // violations when more than one menu is present on the page.
      // The menu may be rendered as a sibling in the header; scope it to the header
      const systemMenu = page.locator('header').getByRole('menu').first();
      await systemMenu.waitFor({ state: 'visible', timeout: 2000 });
      const childMenu = systemMenu.getByRole('menuitem', { name: /Child Dashboard|Little Sprouts|Child/i }).first();
      if ((await childMenu.count()) > 0) {
        await childMenu.click();
        await page.waitForLoadState('networkidle');
        await waitForAppView(page, view, 2000);
        return;
      }
    }
    throw new Error('Failed to ensure app view: ' + view);
  }, tries, interval);
}

export async function retryClick(locator: Locator, options?: { tries?: number, interval?: number }) {
  const tries = options?.tries ?? 3;
  const interval = options?.interval ?? 300;
  await retryUntil(async () => {
    await locator.waitFor({ state: 'visible', timeout: 2000 });
    await locator.click();
  }, tries, interval);
}
