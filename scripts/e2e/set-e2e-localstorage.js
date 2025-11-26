  // Read flags JSON
  try {
    const rawFlags = process.env.E2E_FLAGS_JSON || fs.readFileSync(FLAGS_FILE, 'utf8');
    flags = JSON.parse(rawFlags || '{}');
  } catch (e) {
    console.warn('Warning: could not read flags JSON; proceeding with empty flags', e.message || e);
    flags = {};
  }

  // Allow an explicit `wonky_flags` field in seed to override flags.json
  const flagsToSet = seed.wonky_flags || flags || {};

  const browser = await playwright.chromium.launch({ headless: true });
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(BASE_URL);
    // Set the canonical E2E storage key used by the app
    await page.evaluate((key, value) => localStorage.setItem(key, value), STORAGE_KEY, JSON.stringify(seed));
    // set feature flags
    await page.evaluate((flags) => localStorage.setItem('wonky_flags', JSON.stringify(flags)), flagsToSet);
    // Set any extra preferences if provided (conservative/human-friendly key)
    if (seed.preferences) {
      await page.evaluate((prefs) => localStorage.setItem('wonky_preferences', JSON.stringify(prefs)), seed.preferences);
    }
    console.log(`Set E2E seed for key="${STORAGE_KEY}" and populated wonky_flags at ${BASE_URL}`);
    await context.close();
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error('set-e2e-localstorage failed', e);
  process.exit(1);
#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const playwright = require("playwright");

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:4173";
const STORAGE_KEY = process.env.E2E_STORAGE_KEY || "wonky-sprout-os-state";
const SEED_FILE =
  process.env.E2E_SEED_FILE || path.resolve(__dirname, "default-seed.json");
const FLAGS_FILE =
  process.env.E2E_FLAGS_FILE || path.resolve(__dirname, "default-flags.json");

async function main() {
  let seed = {};
  let flags = {};
  // Read seed JSON (env overrides file path)
  try {
    const rawSeed =
      process.env.E2E_SEED_JSON || fs.readFileSync(SEED_FILE, "utf8");
    seed = JSON.parse(rawSeed || "{}");
  } catch (e) {
    console.warn(
      "Warning: could not read seed JSON; proceeding with empty seed",
      e.message || e,
    );
    seed = {};
  }
  // Read flags JSON
  try {
    const rawFlags =
      process.env.E2E_FLAGS_JSON || fs.readFileSync(FLAGS_FILE, "utf8");
    flags = JSON.parse(rawFlags || "{}");
  } catch (e) {
    console.warn(
      "Warning: could not read flags JSON; proceeding with empty flags",
      e.message || e,
    );
    flags = {};
  }

  // Allow an explicit `wonky_flags` field in seed to override flags.json
  const flagsToSet = seed.wonky_flags || flags || {};

  const browser = await playwright.chromium.launch({ headless: true });
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(BASE_URL);
    // Set the canonical E2E storage key used by the app
    await page.evaluate(
      (key, value) => localStorage.setItem(key, value),
      STORAGE_KEY,
      JSON.stringify(seed),
    );
    // set feature flags
    await page.evaluate(
      (flags) => localStorage.setItem("wonky_flags", JSON.stringify(flags)),
      flagsToSet,
    );
    // Set any extra preferences if provided (conservative/human-friendly key)
    if (seed.preferences) {
      await page.evaluate(
        (prefs) => localStorage.setItem("wonky_preferences", JSON.stringify(prefs)),
        seed.preferences,
      );
    }
    console.log(
      `Set E2E seed for key="${STORAGE_KEY}" and populated wonky_flags at ${BASE_URL}`,
    );
    await context.close();
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error("set-e2e-localstorage failed", e);
  process.exit(1);
});
#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const playwright = require('playwright');

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:4173';
const STORAGE_KEY = process.env.E2E_STORAGE_KEY || 'wonky-sprout-os-state';
const SEED_FILE = process.env.E2E_SEED_FILE || path.resolve(__dirname, 'e2e-accessibility-seed.json');

async function main() {
  let seed = {};
  try {
    const raw = process.env.E2E_SEED_JSON || fs.readFileSync(SEED_FILE, 'utf-8');
    seed = JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read seed JSON from file or E2E_SEED_JSON env variable:', e.message || e);
    process.exit(1);
  }

  const browser = await playwright.chromium.launch({ headless: true });
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(BASE_URL);
    // Set the canonical E2E storage key used by the test harness
    await page.evaluate((key, value) => localStorage.setItem(key, value), STORAGE_KEY, JSON.stringify(seed));
    // Also set the friendly wonky_flags key for the app's feature toggles
    if (seed.wonky_flags) {
      await page.evaluate((flags) => localStorage.setItem('wonky_flags', JSON.stringify(flags)), seed.wonky_flags);
    }
    // If preferences are present, store them under a generic key
    if (seed.preferences) {
      await page.evaluate((prefs) => localStorage.setItem('wonky_preferences', JSON.stringify(prefs)), seed.preferences);
    }
    console.log(`Set E2E seed for key="${STORAGE_KEY}" at ${BASE_URL}`);
    await context.close();
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
