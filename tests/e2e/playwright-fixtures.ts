// Import the real Playwright module directly for extension.
// Prefer the original Playwright import that may have been aliased by register_shim
// to avoid recursively importing this fixture file. The shim installs an alias
// for `@wonky/playwright-test-original` pointing at the real module path.
let base: typeof import('@playwright/test').test;
let expect: typeof import('@playwright/test').expect;
// Use top-level await to dynamically import the underlying Playwright module
// — this allows us to prefer `@wonky/playwright-test-original` when the shim
// is active but fall back to `@playwright/test` in non-shim environments.
try {
  // Try the shim alias path first
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const m = await import('@wonky/playwright-test-original');
  base = m.test;
  expect = m.expect;
} catch (_e) {
  const m = await import('@playwright/test');
  base = m.test;
  expect = m.expect;
}
// Debugging logs to inspect the resolved base
try { console.log('PW_FIXTURES: base loaded?', !!base, 'extend property present?', !!(base as any)?.extend, 'extend.toString', (base as any)?.extend?.toString?.().slice(0,180)); } catch {};
import type { BrowserContext, Page } from '@playwright/test';

// Default seed timeout can be overridden via environment variables in CI or local runs
const DEFAULT_E2E_SEED_TIMEOUT = Number(process.env.E2E_SEED_TIMEOUT ?? process.env.PLAYWRIGHT_E2E_SEED_TIMEOUT ?? 10000);
export const test = base.extend<{ storageKey: string, validateSeededState: (timeout?: number) => Promise<void> }>({
  // This fixture is worker-scoped so each worker gets a unique storageKey
  storageKey: [async ({}, use, workerInfo) => {
    const key = `wonky-sprout-os-state-${workerInfo.workerIndex || Math.random().toString(36).slice(2)}`;
    await use(key);
  }, { scope: 'worker' }],

  // Override the `page` fixture to inject the storageKey into the page
  page: async ({ page, storageKey }, use) => {
    // Ensure the worker key is available to the page before any script runs
    await page.addInitScript((key) => {
      try { (window as any).__E2E_STORAGE_KEY__ = key; } catch { /* ignore */ }
    }, storageKey);
    // Mark this run as an E2E test mode so components can accelerate timers.
    await page.addInitScript(() => {
      try { (window as any).__WONKY_E2E_TEST_MODE__ = true; } catch { /* ignore */ }
    });

    // Add global error and console logging for all pages in this context
    page.on('pageerror', (exception) => {
      console.error(`PW_PAGE_ERROR [${test.info().title}]:`, exception);
      // Additionally, store the error in localStorage so tests can retrieve it
      // and assert against it if necessary (e.g., if the error boundary fails).
      try { window.localStorage.setItem('wonky-last-error', exception.stack || exception.message); } catch { /* ignore */ }
    });
    page.on('requestfailed', (request) => {
      try { console.error(`PW_REQUEST_FAILED [${test.info().title}]:`, request.url(), request.failure()?.errorText); } catch { /* ignore */ }
    });
    page.on('response', (res) => {
      try {
        if (res.status() === 404) console.warn(`PW_404 [${test.info().title}] ${res.status()} ${res.url()}`);
      } catch { /* ignore */ }
    });
    page.on('console', (msg) => {
      // Only log warnings and errors to avoid spamming the console
      if (msg.type() === 'error' || msg.type() === 'warn') {
        console.log(`PW_CONSOLE_LOG [${test.info().title}][${msg.type()}]:`, msg.text());
      }
    });
    // Intercept storage writes to catch writes of 'undefined' (diagnostic only)
    await page.addInitScript(() => {
      try {
        const orig = Storage.prototype.setItem;
        Storage.prototype.setItem = function (k: string, v: any) {
          try {
            if (v === undefined || v === 'undefined') console.warn(`STORAGE_SET_ITEM_WITH_UNDEFINED ${String(k)} ${String(v)}`);
          } catch { /* ignore */ }
          return orig.apply(this, [k, v]);
        };
      } catch { /* ignore */ }
    });
    // Capture lifecycle events for better triage when pages close/crash unexpectedly.
    page.on('close', () => console.log(`PW_PAGE_CLOSE [${test.info().title}] page closed`));
    page.on('crash', () => console.error(`PW_PAGE_CRASH [${test.info().title}] page crashed`));
    await use(page);
  },
  validateSeededState: async ({ page, storageKey }, use) => {
    // Provide a helper that tests can call after `page.goto` to assert that the
    // seeded storage key contains valid JSON and is present in the page context.
    await use(async (timeout = DEFAULT_E2E_SEED_TIMEOUT) => {
      const pollInterval = 50;
      const start = Date.now();
      while (true) {
        const valid = await page.evaluate((k) => {
          try {
            const raw = window.localStorage.getItem(k as string);
            if (!raw) return false;
            if (raw === 'undefined' || raw === 'null') {
              // These are common mis-seeding cases — bail out with false so the fixture can retry
              return false;
            }
            JSON.parse(raw);
            return true;
          } catch {
            return false;
          }
        }, storageKey);
        if (valid) return;
        // Provide lightweight diagnostic feedback for triage
        const rawVal = await page.evaluate((k) => { try { return window.localStorage.getItem(k as string); } catch { return null; } }, storageKey);
        if (!rawVal) console.warn(`validateSeededState: key ${storageKey} not found yet`);
        else if (rawVal === 'undefined' || rawVal === 'null') console.warn(`validateSeededState: key ${storageKey} contains literal '${rawVal}'`);
        if (Date.now() - start > timeout) {
          // Provide detailed diagnostic snapshot for CI logs
          const snapshot = await page.evaluate((k) => {
            try { return { raw: window.localStorage.getItem(k as string), keys: Object.keys(window.localStorage) }; } catch { return null; }
          }, storageKey);
          throw new Error(`E2E seed missing or invalid for key ${storageKey}: ${JSON.stringify(snapshot)}`);
        }

        await new Promise((r) => setTimeout(r, pollInterval));
      }
    });
  },
});

export { expect };
