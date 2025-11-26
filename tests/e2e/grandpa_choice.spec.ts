import { test, expect } from "./playwright-fixtures";
import { retryClick } from "./helpers/retryHelpers";
import { byWorkshopOrCockpitTestId } from "./helpers/locators";

test("Grandpa Choice starts a 15-minute timer and stores it in localStorage", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .locator(byWorkshopOrCockpitTestId("main-content"))
    .waitFor({ state: "visible", timeout: 15000 });

  // Navigate to Grandpa Helper view; clickable nav is present in the top bar
  const navGrandpa = page
    .locator('[data-workshop-testid="nav-grandpa-helper"]')
    .first();
  await navGrandpa.waitFor({ state: "visible", timeout: 10000 });
  await retryClick(navGrandpa, {
    tries: 3,
    interval: 200,
    clickOptions: { timeout: 5000 },
  });

  // Wait for the grandpa helper to render
  const grandpaOut = page
    .locator('[data-workshop-testid="grandpa-output"]')
    .first();
  await grandpaOut.waitFor({ state: "visible", timeout: 15000 });

  // Click the new Grandpa Choice button
  const choiceBtn = page
    .locator('[data-workshop-testid="grandpa-choice-start"]')
    .first();
  await choiceBtn.waitFor({ state: "visible" });
  await retryClick(choiceBtn, { tries: 3, interval: 200 });

  // Confirm localStorage keys are set as diagnostics
  const storedTimer = await page.evaluate(() => ({
    startedAt: window.localStorage.getItem("grandpa.timerStartedAt"),
    minutes: window.localStorage.getItem("grandpa.timerMinutes"),
  }));
  expect(storedTimer.startedAt).toBeTruthy();
  expect(storedTimer.minutes).toBe("15");
});
