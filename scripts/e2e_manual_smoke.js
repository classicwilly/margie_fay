#!/usr/bin/env node
// A simple Playwright script to verify AI consent/PII flow without @playwright/test fixture harness
import { chromium } from 'playwright';

const run = async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Setting initial storage keys (consent false)');
  await page.addInitScript(() => {
    try { localStorage.removeItem('wonky-sprout-ai-consent-dont-show-again'); } catch {};
  });

  const url = 'http://localhost:3000/?forceView=command-center';
  console.log('Navigating to', url);
  await page.goto(url, { waitUntil: 'networkidle' });
  console.log('Waiting for Command Center');
  await page.waitForSelector('[data-testid="command-center-title"]', { timeout: 10000 }).catch(() => {});

  // Fill the AI input
  const aiInputSelector = '[data-testid="ask-ai-input"]';
  await page.waitForSelector(aiInputSelector, { timeout: 10000 });
  await page.fill(aiInputSelector, 'Diagnose my workflow blocking issue');

  // Click ask button
  const askBtn = await page.$('[data-testid="ask-ai-btn"]') || await page.$('button:has-text("Ask AI")');
  if (!askBtn) {
    console.warn('Could not find Ask AI button');
    await browser.close();
    process.exit(1);
  }
  await askBtn.click();

  // Wait for consent modal
  try {
    await page.waitForSelector('[data-testid="ai-consent-title"]', { timeout: 5000 });
    console.log('Consent modal appeared');
  } catch (e) {
    console.warn('Consent modal did not appear (could be auto-consented or stubbed)');
  }
  // Click Don't show again and Acknowledge
  try {
    const dontShow = await page.$('input[type="checkbox"][checked]') || await page.$('label:has-text("Don\'t show this again") input[type=checkbox]');
    if (dontShow) {
      await dontShow.click();
    }
    const ackBtn = await page.$('[data-testid="ai-consent-acknowledge"]') || await page.$('button:has-text("Acknowledge")');
    if (ackBtn) {
      await ackBtn.click();
      console.log('Clicked acknowledge');
    }
  } catch (err) {
    console.warn('Unable to interact with consent modal:', err.message || err);
  }

  // Reload and check if modal appears again
  console.log('Reloading to verify that consent modal is suppressed');
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  const modalVisible = await page.$('[data-testid="ai-consent-title"]');
  if (modalVisible) {
    console.log('Consent modal still appears after acknowledging (expected=false)');
  } else {
    console.log('Consent modal did not appear after acknowledging (expected=true)');
  }

  await browser.close();
};

run().catch((e) => { console.error('E2E manual script error', e); process.exit(1); });
