import { Page } from '@playwright/test';

export async function applyAiStub(page: Page, opts: { text?: string; status?: number; force?: boolean } = {}) {
  // Register the stub when either the env var is set, or the test forces it.
  // For CI we rely on PLAYWRIGHT_AI_STUB=true; for local deterministic runs, pass { force: true }.
  if (!opts.force && process.env.PLAYWRIGHT_AI_STUB !== 'true') return;

  const body = JSON.stringify({
    status: 'ok',
    model: 'stub-v1',
    choices: [
      { text: opts.text || 'ok from ai (stubbed)', index: 0 },
    ],
    // Provide a JSON payload that `useSafeAI` expects for `application/json` responses
    summary: opts.summary || 'ok from ai',
    assist: opts.assist || 'AI stub assist text',
    meta: { stub: true },
  });

  // Register the route at both page and context level to ensure the service worker
  // or other worker contexts don't bypass our stubbed responses.
  try {
     await page.context().route('**/aiProxy**', (route) => {
      route.fulfill({
        status: opts.status || 200,
        headers: { 'Content-Type': 'application/json' },
        body,
      });
    });
    console.log('AI stub: context route for **/aiProxy** registered');
  } catch (e) {
    // Some versions or contexts might not allow context-level routing; fall back to page-level route.
    console.warn('context.route failed; falling back to page.route', e?.message || e);
  }
  await page.route('**/aiProxy**', (route) => {
     route.fulfill({
      status: opts.status || 200,
      headers: { 'Content-Type': 'application/json' },
      body,
    });
  });
    console.log('AI stub: page route for **/aiProxy** registered');

  // If this test requested deterministic local state, set a client flag to
  // skip the DEV-mode state shortcut so seeded localStorage is honored.
  if (opts.force || process.env.PLAYWRIGHT_SKIP_DEV_BYPASS === 'true') {
    await page.addInitScript(() => {
      try { (window as any).__PLAYWRIGHT_SKIP_DEV_BYPASS__ = true; } catch { /* ignore */ }
    });
  }

  // Signal the dev server that a Playwright stub has been installed so we can
  // measure stub usage (test telemetry). This posts to /ai_stub_event on the
  // running server where we increment a Prometheus counter.
  const base = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';
  try {
    await page.request.post(`${base}/ai_stub_event`);
  } catch (e) {
    // Non-fatal — if the server doesn't expose this endpoint in a given environment,
    // we still want tests to continue without telemetry.
    console.warn('aiStub telemetry post failed', e?.message || e);
  }
}

export default applyAiStub;
