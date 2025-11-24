import { test, expect } from "@playwright/test";

test("Dashboard modules are visible", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  // Use a single, highly stable heading to detect when the dashboard has finished loading
  // Use stable primary heading and ensure the dashboard grid is mounted
  // Ensure the page is settled by waiting for the cockpit title testid (unique and avoids strict-mode ambiguity)
  await page
    .getByTestId("workshop-title")
    .waitFor({ state: "visible", timeout: 15000 });
  await page
    .getByRole("heading", { name: "Critical Tasks" })
    .first()
    .waitFor({ state: "visible", timeout: 15000 });
  const headers = [
    "🥗 Daily Essentials",
    "👶 Kids Status",
    "🚀 Workspace Launchpad",
    "🎯 Critical Tasks",
    "🧠 Observer",
    "🏆 Achievements",
  ];
  for (const text of headers) {
    const el = page.getByText(text).first();
    await expect(el).toBeVisible();
  }
});
