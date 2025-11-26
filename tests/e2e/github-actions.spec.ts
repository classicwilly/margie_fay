import { test, expect } from "@playwright/test";

test("Create PR shows success toast", async ({ page }) => {
  await page.goto("/");
  try {
    await page.waitForSelector("text=Google Workspace Showcase", {
      timeout: 3000,
    });
  } catch {
    /* ignore */
  }
  // Mock the create PR API to simulate success
  await page.route("**/api/github/repos/*/pulls", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ pr: { number: 456, title: "Test PR" } }),
    }),
  );
  // Fill owner & repo & pr details
  await page.fill('input[placeholder="owner"]', "myorg");
  await page.fill('input[placeholder="repo"]', "myrepo");
  await page.fill('input[placeholder="PR title"]', "Test PR");
  await page.fill('input[placeholder="head"]', "feature");
  await page.click("text=Create PR");
  // Wait for toast to appear
  await page.waitForSelector("text=PR created: #456 Test PR", {
    timeout: 5000,
  });
  const toast = await page.locator("text=PR created: #456 Test PR").isVisible();
  expect(toast).toBeTruthy();
});
