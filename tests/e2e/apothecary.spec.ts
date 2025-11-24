import { test, expect } from "./playwright-fixtures";
import { ensureAppView, retryClick } from "./helpers/retryHelpers";
import percySnapshot from "@percy/playwright";

test("Apothecary — Navigation and content verification @smoke", async ({
  page,
  storageKey,
}) => {
  test.setTimeout(120_000);
  // 1) Seed the app to the Workshop view
  await page.addInitScript(
    (init) => {
      try {
        (window as any).__WONKY_TEST_INITIALIZE__ = init;
      } catch (e) {
        /* ignore */
      }
    },
    { dashboardType: "william", view: "workshop", initialSetupComplete: true },
  );
  await page.addInitScript((key) => {
    try {
      (window as any).__E2E_STORAGE_KEY__ = key;
    } catch (e) {
      /* ignore */
    }
    try {
      const seeded = {
        initialSetupComplete: true,
        view: "workshop",
        dashboardType: "william",
      };
      const k =
        (key as string) ||
        (window as any).__E2E_STORAGE_KEY__ ||
        "wonky-sprout-os-state";
      window.localStorage.setItem(k, JSON.stringify(seeded));
      try {
        (window as any).__E2E_FORCE_VIEW__ = "workshop";
      } catch (e) {
        /* ignore */
      }
    } catch (e) {
      /* ignore */
    }
  }, storageKey);
  await page.goto("/?force_e2e_view=cockpit");
  await page.waitForLoadState("networkidle");
  await ensureAppView(page, "workshop");

  // 2) Click the Apothecary button — prefer deterministic test ids but
  // fall back to role-based regex lookups which might include emoji.
  let apothecaryBtn = page.getByTestId("nav-bio-hacks").first();
  if (!(await apothecaryBtn.count())) {
    apothecaryBtn = page
      .getByRole("button", { name: /The Apothecary|Apothecary|💊/i })
      .first();
  }
  await expect(apothecaryBtn).toBeVisible({ timeout: 15000 });
  await retryClick(apothecaryBtn);

  // 3) Assert we reached the bio-hacks view — check header and three recipe cards
  await page.waitForLoadState("networkidle");
  await ensureAppView(page, "bio-hacks");
  await expect(
    page.getByRole("heading", { name: /💊 The Apothecary/i }),
  ).toBeVisible({ timeout: 10000 });

  // Verify the three recipes are present on the page
  await expect(page.getByText(/The Lime Drag/i)).toBeVisible();
  await expect(page.getByText(/The Shield/i)).toBeVisible();
  await expect(page.getByText(/The Heavy Work/i)).toBeVisible();

  // Percy snapshot for visual diffing (if Percy is enabled for the run)
  try {
    await percySnapshot(page, "BioHacks — Apothecary View");
  } catch (e) {
    console.warn("Percy snapshot skipped or percy not configured", e);
  }
});
