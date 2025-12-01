import { Page } from '@playwright/test';
import applyAiStub from './aiStub';

export async function seedE2EState(page: Page, storageKey: string, opts: { view?: string; dashboardType?: string; initialSetupComplete?: boolean; userId?: string; aiConsent?: boolean; applyAiStub?: boolean } = {}) {
  const defaultSeed = {
    view: opts.view || 'command-center',
    dashboardType: opts.dashboardType || 'william',
    initialSetupComplete: typeof opts.initialSetupComplete === 'boolean' ? opts.initialSetupComplete : true,
    userId: opts.userId || 'e2e-test-user',
    aiConsent: typeof opts.aiConsent === 'boolean' ? opts.aiConsent : true,
    applyAiStub: typeof opts.applyAiStub === 'boolean' ? opts.applyAiStub : true,
  };
  // Remove sticky view to avoid landing on a previously persisted view
  await page.addInitScript((key, seed) => {
    try { window.localStorage.removeItem('__WONKY_TEST_STICKY_VIEW__'); } catch { /* ignore */ }
    try { if (typeof key === 'string') window.localStorage.removeItem(key); } catch { /* ignore */ }
    try { window.localStorage.setItem((key as string) || 'wonky-sprout-os-state', JSON.stringify(seed)); } catch { /* ignore */ }
    if (seed.aiConsent) {
      try { window.localStorage.setItem('wonky-sprout-ai-consent-dont-show-again', 'true'); } catch { /* ignore */ }
    } else {
      try { window.localStorage.removeItem('wonky-sprout-ai-consent-dont-show-again'); } catch { /* ignore */ }
    }
    if (seed.applyAiStub) {
      // Signal to the page that a stub will be installed by the test harness.
      try { (window as any).__E2E_AI_STUB_ENABLED__ = true; } catch { /* ignore */ }
    }
    try { (window as any).__WONKY_TEST_INITIALIZE__ = seed; } catch { /* ignore */ }
    try { (window as any).__E2E_FORCE_VIEW__ = seed.view; } catch { /* ignore */ }
    try { (window as any).__WONKY_TEST_READY__ = false; } catch { /* ignore */ }
  }, storageKey, defaultSeed);
  // Timeout for safety - allow scripts to execute
  await page.waitForTimeout(50);
  // Also set the same value in the current page context to reduce timing
  // and ordering issues if the test uses page.evaluate or inspects localStorage
  // before navigation. This avoids addInitScript ordering pitfalls.
  try {
    await page.evaluate((k, s) => {
      try { window.localStorage.setItem((k as string) || 'wonky-sprout-os-state', JSON.stringify(s)); } catch { /* ignore */ }
    }, storageKey, defaultSeed);
  } catch (e) { /* ignore evaluation errors */ }

  // If requested, install a deterministic AI stub now using the test-level
  // helper to ensure routing is registered at the context and/or page level.
  if (defaultSeed.applyAiStub) {
    try {
      await applyAiStub(page, { force: true });
    } catch (e) {
      // Non-fatal; best-effort to install the stub
      console.warn('Failed to apply AI stub via seedE2EState', e?.message || e);
    }
  }
}

export default seedE2EState;
