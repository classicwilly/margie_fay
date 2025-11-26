import { test, expect } from "@playwright/test";

test("Discord sign-in redirects to Discord OAuth", async ({ page }) => {
  await page.goto("/");
  // Open the Google Workspace Showcase and click the Discord sign-in
  // The showcase might be hidden in some dashboards; wait for it or fallback to searching for the sign-in button.
  try {
    await page.waitForSelector("text=Google Workspace Showcase", {
      timeout: 3000,
    });
  } catch {
    // ignore — fallback to searching for the sign-in button
  }
  const signInButton = page.locator("text=Sign in with Discord");
  await expect(signInButton).toBeVisible();
  // Click the button; it should trigger a redirect to Discord's OAuth screen
  await signInButton.click();
  await page.waitForLoadState("domcontentloaded");
  const url = page.url();
  expect(url).toContain("https://discord.com/api/oauth2/authorize");
});
