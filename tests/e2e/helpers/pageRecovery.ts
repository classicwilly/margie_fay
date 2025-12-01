import type { Page, Browser, Locator } from '@playwright/test';

export async function ensurePageOpen(browser: Browser, p: Page | null | undefined) : Promise<Page> {
  try {
    if (!p || await p.isClosed()) {
      if (!browser.isConnected?.()) {
        console.warn('E2E: browser disconnected; ensurePageOpen will not open new context');
        throw new Error('browser disconnected');
      }
      console.warn('E2E: source page closed — opening a new one (ensurePageOpen)');
      const newContext = await browser.newContext();
      const newPage = await newContext.newPage();
      await newPage.addInitScript(() => {
        try {
          const seed = (window as any).__WONKY_TEST_INITIALIZE__;
          if (seed) {
            try { window.__WONKY_TEST_INITIALIZE__ = seed; } catch { }
            try { window.localStorage.setItem('wonky-sprout-os-state', JSON.stringify(seed)); } catch { }
          }
          (window as any).__WONKY_TEST_BEHAVIOR__ = (window as any).__WONKY_TEST_BEHAVIOR__ || { closeCalled: false, openedUrls: [], attemptedNavigations: [] };
          const _origOpen = (window as any).open;
          (window as any).open = function(url?: string, name?: string, features?: string) { try { (window as any).__WONKY_TEST_BEHAVIOR__.openedUrls.push({ url, name, features }); } catch(e){}; return window as any; };
          const _origClose = (window as any).close;
          (window as any).close = function() { try { (window as any).__WONKY_TEST_BEHAVIOR__.closeCalled = true; } catch(e){} };
        } catch (e) { /* ignore */ }
      });
      await newPage.goto('/?forceView=command-center');
      await newPage.waitForLoadState('networkidle');
      return newPage;
    }
  } catch (er) {
    console.warn('E2E: ensurePageOpen failed', er);
  }
  return p as Page;
}

export async function safeFill(browser: Browser, p: Page | null | undefined, locatorFn: () => Locator, value: string) {
  try {
    p = await ensurePageOpen(browser, p);
    const locator = locatorFn();
    await locator.fill(value);
    return p;
  } catch (err) {
    console.warn('E2E: safeFill encountered', err);
    try {
      await new Promise((r) => setTimeout(r, 500));
      p = await ensurePageOpen(browser, p);
      const locator = locatorFn();
      await locator.fill(value);
    } catch (er) {
      console.warn('E2E: safeFill retry failed', er);
    }
  }
  return p as Page;
}

export async function safeClick(browser: Browser, p: Page | null | undefined, locator: Locator) {
  try {
    p = await ensurePageOpen(browser, p);
    await locator.click();
  } catch (err) {
    console.warn('E2E: safeClick encountered', err);
    try {
      p = await ensurePageOpen(browser, p);
      await locator.click();
    } catch (er) {
      console.warn('E2E: safeClick retry failed', er);
    }
  }
  return p as Page;
}

export default { ensurePageOpen, safeFill, safeClick };
