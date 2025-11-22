import './tests/e2e/register_shim';
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 120_000,
  expect: { timeout: 10000 },
  retries: process.env.CI ? 2 : 0,
  reporter: [ ['list'], ['html', { outputFolder: 'playwright-report' }] ],
  // Store artifacts in a known location for CI uploads
  outputDir: 'test-results',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    // launchOptions: disable GPU and use safe flags to avoid host crashes
    launchOptions: {
      args: [
        '--disable-gpu',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-software-rasterizer'
      ],
      // dumpio forces the browser stdout/stderr into the test runner —
      // helps surface native/driver crashes in CI or local logs.
      dumpio: true,
    },
    // Debugging tools for flaky tests in CI
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
  webServer: {
    command: 'npm run dev',
    // Match base URL used for navigation to the web server. Allow override with PLAYWRIGHT_BASE_URL.
    url: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
    // By default we reuse an existing server locally (for faster iteration) but
    // start a fresh server in CI to keep runs deterministic. To override in
    // local environments set PLAYWRIGHT_REUSE_EXISTING_SERVER=true or run a
    // fresh server via `npm run dev` before running tests and set the env var.
    reuseExistingServer: process.env.CI ? false : (process.env.PLAYWRIGHT_REUSE_EXISTING_SERVER !== 'false'),
    timeout: 240_000,
  },
});
