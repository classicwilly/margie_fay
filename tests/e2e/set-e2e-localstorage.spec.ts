import { test, expect } from "@playwright/test";

test.describe("set-e2e-localstorage helper", () => {
  test("writes seed state and flags to localStorage", async ({ page }) => {
    await page.goto("/");
    const storedState = await page.evaluate(() =>
      window.localStorage.getItem("wonky-sprout-os-state"),
    );
    const flags = await page.evaluate(() =>
      window.localStorage.getItem("wonky_flags"),
    );
    expect(storedState).toBeTruthy();
    expect(flags).toBeTruthy();
  });
});
