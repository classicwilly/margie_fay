import './tests/e2e/register_shim';
import { defineConfig, devices } from '@playwright/test';

// Allow dynamic port configuration for Playwright webServer via env vars
const port = Number(process.env.PLAYWRIGHT_DEV_SERVER_PORT || process.env.PORT || 3000);
const baseURL = process.env.PLAYWRIGHT_BASE_URL || `http://localhost:${port}`;

// Whether to use the preview server (built `dist`) instead of the dev server.
// Set either PLAYWRIGHT_USE_PREVIEW=true or rely on CI to opt-in to preview mode.
const usePreviewServer = process.env.PLAYWRIGHT_USE_PREVIEW === 'true' || process.env.CI === 'true';
const webServerCommand = usePreviewServer ? 'npm run build && npm run preview' : 'npm run dev';
const webServerReuseDefault = process.env.PLAYWRIGHT_REUSE_EXISTING_SERVER !== 'false';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 120_000,
  expect: { timeout: 10000 },
  retries: process.env.CI ? 2 : 0,
  reporter: [ ['list'], ['html', { outputFolder: 'playwright-report' }] ],
  // Store artifacts in a known location for CI uploads
  outputDir: 'test-results',
  // Limit parallelism on CI agents to avoid resource contention and improve stability
  workers: process.env.CI ? 1 : undefined,
  use: {
    baseURL: baseURL,
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
  projects: process.env.CI ? [
    // Limit to Chromium on CI by default to reduce variability and resource pressure.
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ] : [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
  webServer: {
    // Use `npm run build && npm run preview` in CI and when PLAYWRIGHT_USE_PREVIEW=true
    command: webServerCommand,
    // Match base URL used for navigation to the web server. Allow override with PLAYWRIGHT_BASE_URL.
    url: baseURL,
    // By default we reuse an existing server locally (for faster iteration) but
    // start a fresh server in CI to keep runs deterministic. To override in
    // local environments set PLAYWRIGHT_REUSE_EXISTING_SERVER=true or run a
    // fresh server via `npm run dev` before running tests and set the env var.
    reuseExistingServer: process.env.CI ? false : webServerReuseDefault,
    timeout: 300_000,
  },
});
