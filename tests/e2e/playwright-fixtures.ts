// Import the real Playwright module directly for extension.
import { test as base, expect } from '@playwright/test';
import type { BrowserContext, Page } from '@playwright/test';

export const test = base.extend<{ storageKey: string }>({
  // This fixture is worker-scoped so each worker gets a unique storageKey
  storageKey: [async ({}, use, workerInfo) => {
    const key = `wonky-sprout-os-state-${workerInfo.workerIndex || Math.random().toString(36).slice(2)}`;
    await use(key);
  }, { scope: 'worker' }],

  // Override the `page` fixture to inject the storageKey into the page
  page: async ({ page, storageKey }, use) => {
    // Ensure the worker key is available to the page before any script runs
    await page.addInitScript((key) => {
      try { (window as any).__E2E_STORAGE_KEY__ = key; } catch (e) { /* ignore */ }
    }, storageKey);
    // Add global error and console logging for all pages in this context
    page.on('pageerror', (exception) => {
      console.error(`PW_PAGE_ERROR [${test.info().title}]:`, exception);
      // Additionally, store the error in localStorage so tests can retrieve it
      // and assert against it if necessary (e.g., if the error boundary fails).
      try { window.localStorage.setItem('wonky-last-error', exception.stack || exception.message); } catch (e) { /* ignore */ }
    });
    page.on('console', (msg) => {
      // Only log warnings and errors to avoid spamming the console
      if (msg.type() === 'error' || msg.type() === 'warn') {
        console.log(`PW_CONSOLE_LOG [${test.info().title}][${msg.type()}]:`, msg.text());
      }
    });
    await use(page);
  },
});

export { expect };
