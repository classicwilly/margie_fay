import { test, expect, Page } from "@playwright/test";
import { applyAiStub } from "./helpers/aiStub";
import { retryClick } from "./helpers/retryHelpers";
import { byWorkshopOrCockpitTestId } from "./helpers/locators";

// Define a stable click sequence for the floating button
const clickFloatBtn = async (page: Page) => {
  const floatBtn = page.locator(byWorkshopOrCockpitTestId("open-ask-ai"));

  // 1. Wait until the button is visible and enabled (resilient wait)
  await expect(floatBtn).toBeVisible({ timeout: 15000 });

  // 2. Use a retried click with clickOptions to stabilize interaction
  await retryClick(floatBtn, {
    tries: 4,
    interval: 250,
    clickOptions: { force: true, position: { x: 5, y: 5 }, timeout: 15000 },
  });
};

test.describe("Ask Persona Flows (Grandma, Grandpa, Bob, Marge)", () => {
  // Ensure AI stubbing is applied before each test for deterministic persona responses
  test.beforeEach(async ({ page }) => {
    await applyAiStub(page);
  });
  test("shows a response through the sidebar and floating button", async ({
    page,
  }) => {
    await page.goto("/");
    await page.locator(byWorkshopOrCockpitTestId("main-content")).waitFor();

    await clickFloatBtn(page);

    // Focus on the input and type a query
    const input = page.locator(byWorkshopOrCockpitTestId("grandma-input"));
    await expect(input).toBeVisible();
    await input.fill("How do I fix this drawer?");

    // Click ASK
    const ask = page.locator(byWorkshopOrCockpitTestId("grandma-ask-button"));
    await ask.scrollIntoViewIfNeeded();
    await retryClick(ask, { tries: 3 });

    // Assert the response shows and contains the persona signature
    const response = page.locator('[data-testid="grandma-output"]').first();
    // Wait for the output element to be attached (allow up to 30s for slower AI responses)
    await response.waitFor({ state: "attached", timeout: 30000 });
    await expect(response).toHaveText(/Love, Grandma/i, { timeout: 15000 });
  });

  test("shows Grandpa response when persona switched and retains generic quick action compatibility", async ({
    page,
  }) => {
    await page.goto("/");
    await page.locator(byWorkshopOrCockpitTestId("main-content")).waitFor();

    await clickFloatBtn(page);

    const personaSelect = page
      .locator('select[aria-label="AI persona"]')
      .first();
    await personaSelect.waitFor({ state: "visible" });

    // Switch persona to Grandpa
    await personaSelect.selectOption({ value: "grandpa" });

    const input = page.locator(byWorkshopOrCockpitTestId("grandma-input"));
    await expect(input).toBeVisible();
    await input.fill("How do I prune these roses?");

    const askBtn = page.locator(
      byWorkshopOrCockpitTestId("grandma-ask-button"),
    );
    await askBtn.scrollIntoViewIfNeeded();
    await retryClick(askBtn, { tries: 3 });

    const response = page.locator('[data-testid="grandma-output"]').first();
    // Wait for output to be present before checking text — allow long wait for AI stubbed responses
    await response.waitFor({ state: "attached", timeout: 30000 });
    await expect(response).toHaveText(/Love, Grandpa/i, { timeout: 15000 });
  });

  test("shows Bob response when persona switched", async ({ page }) => {
    await page.goto("/");
    await page.locator(byWorkshopOrCockpitTestId("main-content")).waitFor();

    await clickFloatBtn(page);

    const personaSelect = page
      .locator('select[aria-label="AI persona"]')
      .first();
    await personaSelect.waitFor({ state: "visible" });

    await personaSelect.selectOption({ value: "bob" });

    const input = page.locator(byWorkshopOrCockpitTestId("grandma-input"));
    await expect(input).toBeVisible();
    await input.fill("Can I fix a loose fence post?");

    const askBtn = page.locator(
      byWorkshopOrCockpitTestId("grandma-ask-button"),
    );
    await askBtn.scrollIntoViewIfNeeded();
    await retryClick(askBtn, { tries: 3 });

    const response = page.locator('[data-testid="grandma-output"]').first();
    await response.waitFor({ state: "attached", timeout: 30000 });
    await expect(response).toHaveText(/—Bob\./i, { timeout: 15000 });
  });

  test("shows Marge response when persona switched", async ({ page }) => {
    await page.goto("/");
    await page.locator(byWorkshopOrCockpitTestId("main-content")).waitFor();

    await clickFloatBtn(page);

    const personaSelect = page
      .locator('select[aria-label="AI persona"]')
      .first();
    await personaSelect.waitFor({ state: "visible" });

    await personaSelect.selectOption({ value: "marge" });

    const input = page.locator(byWorkshopOrCockpitTestId("grandma-input"));
    await expect(input).toBeVisible();
    await input.fill("Help me organize a small pantry");

    const askBtn = page.locator(
      byWorkshopOrCockpitTestId("grandma-ask-button"),
    );
    await askBtn.scrollIntoViewIfNeeded();
    await retryClick(askBtn, { tries: 3 });

    const response = page.locator('[data-testid="grandma-output"]').first();
    await response.waitFor({ state: "attached", timeout: 30000 });
    await expect(response).toHaveText(/—Marge\./i, { timeout: 15000 });
  });

  test("shows Random persona when selected and returns a supported persona signature", async ({
    page,
  }) => {
    await page.goto("/");
    await page.locator(byWorkshopOrCockpitTestId("main-content")).waitFor();

    await clickFloatBtn(page);

    const personaSelect = page
      .locator('select[aria-label="AI persona"]')
      .first();
    await personaSelect.waitFor({ state: "visible" });

    await personaSelect.selectOption({ value: "random" });

    const input = page.locator(byWorkshopOrCockpitTestId("grandma-input"));
    await expect(input).toBeVisible();
    await input.fill("What's the first step to organize my room?");

    const askBtn = page.locator(
      byWorkshopOrCockpitTestId("grandma-ask-button"),
    );
    await askBtn.scrollIntoViewIfNeeded();
    await retryClick(askBtn, { tries: 3 });

    const response = page.locator('[data-testid="grandma-output"]').first();
    await response.waitFor({ state: "attached", timeout: 30000 });
    // Accept any of the persona signatures since Random picks one of them
    await expect(response).toHaveText(
      /Love, Grandma|—Grandpa\.|—Bob\.|—Marge\./i,
      { timeout: 15000 },
    );
  });

  test("Calm Guide triggers on indecision and returns a single suggestion when accepted", async ({
    page,
  }) => {
    await page.goto("/");
    await page.locator(byWorkshopOrCockpitTestId("main-content")).waitFor();

    await clickFloatBtn(page);

    const personaSelect = page
      .locator('select[aria-label="AI persona"]')
      .first();
    await personaSelect.waitFor({ state: "visible" });

    // Rapidly toggle persona to trigger indecision
    await personaSelect.selectOption({ value: "grandma" });
    await personaSelect.selectOption({ value: "grandpa" });
    await personaSelect.selectOption({ value: "bob" });
    await personaSelect.selectOption({ value: "marge" });
    await personaSelect.selectOption({ value: "grandma" });

    // Wait for Calm Guide CTA
    const calmBanner = page.locator('[data-testid="calm-guide-banner"]');
    await calmBanner.waitFor({ state: "visible", timeout: 30000 });

    const acceptBtn = calmBanner.locator('[data-testid="calm-guide-accept"]');
    await retryClick(acceptBtn, { tries: 3 });

    const response = page.locator('[data-testid="grandma-output"]').first();
    await response.waitFor({ state: "attached", timeout: 30000 });
    // Calm Guide returns a short suggestion — acceptance implies we got a message
    await expect(response).toBeVisible();
    await expect(response).toContainText(
      /Calm Guide|I can help pick|If you disagree/i,
    );
  });
});
