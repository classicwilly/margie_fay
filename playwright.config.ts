import "./tests/e2e/register_shim";
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  // Increase global timeout to allow for network backoff and complex UI rendering
  timeout: 60000,
  expect: { timeout: 10000 },
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"], ["html", { outputFolder: "playwright-report" }]],
  // Store artifacts in a known location for CI uploads
  outputDir: "test-results",
  use: {
    // Action timeout controls operations like clicks, fills – larger actionTimeout stabilizes flaky actions
    actionTimeout: 15000,
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000",
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    // launchOptions: disable GPU and use safe flags to avoid host crashes
    launchOptions: {
      args: [
        "--disable-gpu",
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-software-rasterizer",
      ],
      // dumpio forces the browser stdout/stderr into the test runner —
      // helps surface native/driver crashes in CI or local logs.
      dumpio: true,
    },
    // Debugging tools for flaky tests in CI
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
  ],
  webServer: {
    // Explicitly configure the preview server command to bind to a fixed port
    // and to be strict about port binding. This helps Playwright detect
    // if a server is already running and avoid race conditions.
    command:
      process.env.PLAYWRIGHT_USE_PREVIEW_SERVER === "true"
        ? "npm run build && npm run preview"
        : "npm run dev",
    // By default prefer the preview server URL and common preview port 4173.
    url: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:4173",
    // By default we reuse an existing server locally (for faster iteration) but
    // start a fresh server in CI to keep runs deterministic. To override in
    // local environments set PLAYWRIGHT_REUSE_EXISTING_SERVER=true or run a
    // fresh server via `npm run dev` before running tests and set the env var.
    // For local debugging we want Playwright to reuse an existing server
    // by default so you can run dev server and run tests without collisions.
    reuseExistingServer:
      process.env.PLAYWRIGHT_REUSE_EXISTING_SERVER === "true"
        ? true
        : process.env.PLAYWRIGHT_USE_PREVIEW_SERVER !== "true" &&
          process.env.CI !== "true",
    timeout: 240_000,
  },
});
