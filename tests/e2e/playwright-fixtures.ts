// Import the real Playwright module directly for extension.
import { test as base, expect } from '@playwright/test';
import type { BrowserContext, Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

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
    // Mark this run as an E2E test mode so components can accelerate timers.
    await page.addInitScript(() => {
      try { (window as any).__WONKY_E2E_TEST_MODE__ = true; } catch (e) { /* ignore */ }
    });
    // If the test runner requests AI stubbing via env var, expose it to the client
    if (process.env.PLAYWRIGHT_AI_STUB === 'true') {
      await page.addInitScript(() => {
        try { (window as any).__PLAYWRIGHT_AI_STUB__ = true; } catch (e) { /* ignore */ }
      });
    }
    // Add global error and console logging for all pages in this context
    page.on('pageerror', async (exception) => {
      console.error(`PW_PAGE_ERROR [${test.info().title}]:`, exception);
      try { window.localStorage.setItem('wonky-last-error', exception.stack || exception.message); } catch (e) { /* ignore */ }
      // Save a screenshot and HTML snapshot for triage
      try {
        const dir = path.resolve(process.cwd(), 'test-results');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        const time = Date.now();
        const png = path.join(dir, `${test.info().title.replace(/\s+/g, '_')}-pageerror-${time}.png`);
        const htmlp = path.join(dir, `${test.info().title.replace(/\s+/g, '_')}-pageerror-${time}.html`);
        await page.screenshot({ path: png, fullPage: true });
        const html = await page.content();
        fs.writeFileSync(htmlp, html, 'utf-8');
        console.error(`PW_PAGE_ERROR: snapshot saved to ${png} and ${htmlp}`);
      } catch (err) { console.error('Failed to save diagnostic snapshot on pageerror', err); }
    });
    page.on('console', (msg) => {
      // Only log warnings and errors to avoid spamming the console
      if (msg.type() === 'error' || msg.type() === 'warn') {
        console.log(`PW_CONSOLE_LOG [${test.info().title}][${msg.type()}]:`, msg.text());
      }
    });
    // Capture lifecycle events for better triage when pages close/crash unexpectedly.
    page.on('close', () => console.log(`PW_PAGE_CLOSE [${test.info().title}] page closed`));
    page.on('crash', async () => {
      console.error(`PW_PAGE_CRASH [${test.info().title}] page crashed`);
      try {
        const dir = path.resolve(process.cwd(), 'test-results');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        const time = Date.now();
        const png = path.join(dir, `${test.info().title.replace(/\s+/g, '_')}-crash-${time}.png`);
        const htmlp = path.join(dir, `${test.info().title.replace(/\s+/g, '_')}-crash-${time}.html`);
        await page.screenshot({ path: png, fullPage: true });
        const html = await page.content();
        fs.writeFileSync(htmlp, html, 'utf-8');
        console.error(`PW_PAGE_CRASH: snapshot saved to ${png} and ${htmlp}`);
      } catch (err) { console.error('Failed to save diagnostic snapshot on crash', err); }
    });
    // If test runner asks for AI stub, intercept requests to the proxy and return a canned response.
    if (process.env.PLAYWRIGHT_AI_STUB === 'true') {
      await page.route('**/api/gemini', async (route) => {
        // Inspect the request to give persona-specific canned responses for E2E tests
        const req = route.request();
        let sig = 'Love, Grandma.';
        try {
          const post = req.postData();
          if (post) {
            const parsed = JSON.parse(post as string);
            const sys = parsed?.systemInstruction || '';
            if (typeof sys === 'string') {
              if (sys.includes('William') || sys.includes('Grandpa')) sig = 'Love, Grandpa.';
              else if (sys.includes('Bob Haddock') || sys.includes('—Bob')) sig = '—Bob.';
              else if (sys.includes('Marge Watson') || sys.includes('—Marge')) sig = '—Marge.';
            }
          }
        } catch (e) {
          // default persona is Grandma
        }
        const text = `Here is a helpful tip for you. ${sig}`;
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ output: { text } }) });
      });
    }
    await use(page);
  },
});

export { expect };
