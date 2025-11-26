import { test, expect } from "./playwright-fixtures";

// This test runs a basic page load and prints the global error info
// to the Playwright runner console so we can capture the concrete error
// for triage.

test("debug: capture wonky-last-error via localStorage", async ({ page }) => {
  const logs: string[] = [];
  page.on("console", (msg) => {
    const text = msg.text();
    logs.push(`console:${msg.type()}:${text}`);
    console.log("PAGE LOG:", msg.type(), text);
  });
  page.on("pageerror", (err) => {
    logs.push(`pageerror:${err.message}`);
    console.log("PAGE ERROR:", err.message);
  });

  // Force the workout view to load with seeded minimal state
  await page.goto("/?force_e2e_view=cockpit");
  await page.waitForLoadState("networkidle");

  await page.waitForTimeout(1000);
  const lastError = await page.evaluate(() =>
    window.localStorage.getItem("wonky-last-error"),
  );
  console.error("DEBUG_WONKY_LAST_ERROR:", lastError);
  const lastErrorDomText = await page
    .locator('[data-testid="wonky-last-error"]')
    .allInnerTexts();
  console.error(
    "DEBUG_WONKY_LAST_ERROR_DOM_TEXT:",
    lastErrorDomText.join("\n"),
  );

  // Fail only if we captured details
  if (lastError) {
    console.error("DEBUG_COLLECTED_CONSOLE_LOGS:", logs.join("\n"));
    throw new Error("E2E DEBUG: Error present: see logs");
  }
});
