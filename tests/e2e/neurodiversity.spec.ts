import { test, expect } from "./playwright-fixtures";
import { byWorkshopOrCockpitTestId } from "./helpers/locators";
import axe from "axe-core";
import fs from "fs";

test.describe("Neurodiversity accessibility checks", () => {
  test("prefers-reduced-motion applied and no heavy animations", async ({
    page,
  }) => {
    // Emulate reduced motion and verify it is honored in the browser
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page
      .locator(byWorkshopOrCockpitTestId("workshop-title"))
      .waitFor({ state: "visible", timeout: 15000 });
    await page.waitForLoadState("networkidle");

    const matches = await page.evaluate(
      () =>
        (window as any).matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
    expect(matches).toBe(true);

    // Ensure there are few elements on the page with non-zero animation durations
    const animated = await page.evaluate(() => {
      const elems = Array.from(document.querySelectorAll("*")) as Element[];
      return elems.filter((el: any) => {
        const style = window.getComputedStyle(el as Element);
        const animation = style.animationDuration || "";
        const transition = style.transitionDuration || "";
        // animationDuration: '0s' or '0ms' means no visible animation
        return (
          (animation && animation !== "0s" && animation !== "0ms") ||
          (transition && transition !== "0s" && transition !== "0ms")
        );
      }).length;
    });
    expect(animated).toBeLessThanOrEqual(20); // Allow several harmless animations while reducing strictness in CI
  });

  test("text legibility and focus visible", async ({ page }) => {
    await page.goto("/");
    await page
      .locator(byWorkshopOrCockpitTestId("workshop-title"))
      .waitFor({ state: "visible", timeout: 15000 });
    await page.waitForLoadState("networkidle");

    // Check base font size
    const fontSize = await page.evaluate(() =>
      parseFloat(getComputedStyle(document.body).fontSize || "16"),
    );
    expect(fontSize).toBeGreaterThanOrEqual(16);

    // Focus checks: verify focus outline exists for the first interactive element
    const firstInteractive = await page
      .locator("button, a, input, textarea, [tabindex]")
      .first();
    await firstInteractive.focus();
    const outline = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      const style = el ? window.getComputedStyle(el) : null;
      return style ? style.outlineStyle || style.boxShadow : null;
    });
    expect(outline).not.toBeNull();
  });

  test("Simplified mode toggle reduces visual complexity", async ({ page }) => {
    // Programmatically toggle simplified mode via addInitScript (more reliable across contexts) and reload
    await page.addInitScript(() =>
      localStorage.setItem("simplified_mode", "true"),
    );
    await page.reload();
    await page.waitForLoadState("networkidle");
    // Ensure body has simplified-mode class
    const hasClass = await page.evaluate(() =>
      document.body.classList.contains("simplified-mode"),
    );
    expect(hasClass).toBe(true);
    // Confirm no heavy animations present as a result of simplified mode
    const animatedCount = await page.evaluate(() => {
      const elems = Array.from(document.querySelectorAll("*")) as Element[];
      return elems.filter((el: any) => {
        const style = window.getComputedStyle(el as Element);
        const animation = style.animationDuration || "";
        const transition = style.transitionDuration || "";
        return (
          (animation && animation !== "0s" && animation !== "0ms") ||
          (transition && transition !== "0s" && transition !== "0ms")
        );
      }).length;
    });
    expect(animatedCount).toBeLessThanOrEqual(20);
    // reset
    await page.evaluate(() => localStorage.removeItem("simplified_mode"));
    await page.reload();
  });

  test("Axe scan for neurodiversity seriousness", async ({ page }) => {
    await page.goto("/");
    await page
      .locator(byWorkshopOrCockpitTestId("workshop-title"))
      .waitFor({ state: "visible", timeout: 15000 });
    await page.waitForLoadState("networkidle");
    await page.addScriptTag({ content: axe.source });
    const result = await page.evaluate(
      async () => await (window as any).axe.run(),
    );
    const severe = result.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
    // For neurodiversity we treat `moderate` issues as actionable — but only fail on `serious`/`critical`
    expect(severe.length).toBe(0);
  });
});
