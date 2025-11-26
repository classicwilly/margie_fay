import { test, expect } from "@playwright/test";

test("GitHub sign-in redirects to GitHub OAuth", async ({ page, baseURL }) => {
  await page.goto("/");
  // Open the Google Workspace Showcase and click the GitHub sign-in
  try {
    await page.waitForSelector("text=Google Workspace Showcase", {
      timeout: 3000,
    });
  } catch {
    /* ignore */
  }
  const signInButton = page.locator("text=Sign in with GitHub");
  await expect(signInButton).toBeVisible();
  // Click the button; it should trigger a redirect to GitHub's OAuth screen
  await signInButton.click();
  await page.waitForLoadState("domcontentloaded");
  const url = page.url();
  expect(url).toContain("https://github.com/login/oauth/authorize");
});
