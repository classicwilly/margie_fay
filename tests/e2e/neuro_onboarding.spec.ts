import { test, expect } from "@playwright/test";

test.describe("Neuro Onboarding", () => {
  test.afterEach(async ({ page }, testInfo) => {
    // Collect helpful E2E logs when a test fails so CI artifacts are
    // helpful for diagnosing state and timing races.
    if (testInfo.status !== testInfo.expectedStatus) {
      try {
        const logs = await page.evaluate(() =>
          (window as any).__WONKY_E2E_LOG_GET__
            ? (window as any).__WONKY_E2E_LOG_GET__()
            : [],
        );
        // Print logs to stdout so Playwright retains them in the test output.
        // eslint-disable-next-line no-console
        console.log("E2E Logs on Failure:", JSON.stringify(logs, null, 2));
      } catch (e) {
        /* ignore logging issues */
      }
      try {
        const appState = await page.evaluate(
          () => (window as any).appState || {},
        );
        // eslint-disable-next-line no-console
        console.log(
          "E2E window.appState on Failure:",
          JSON.stringify(appState, null, 2),
        );
      } catch (e) {
        /* ignore */
      }
    }
  });
  test.beforeEach(async ({ page, context }) => {
    // Forward page console messages to test output for easier debugging
    page.on("console", (msg) => {
      try {
        // eslint-disable-next-line no-console
        console.log("PAGE LOG:", msg.text());
      } catch (e) {
        /* ignore */
      }
    });
    // Ensure a fresh onboarding run by setting the E2E test init object AND
    // writing it directly to localStorage early. This guarantees the provider
    // reads the seeded state before React mounts and avoids timing races.
    const seed = {
      initialSetupComplete: false,
      view: "neuro-onboarding",
      onboardingStep: 0,
      // Add a few nested keys used by the app so safeMerge doesn't
      // fall back to defaults that could map to the workshop view.
      dashboardType: "workshop",
      moduleStates: {
        neurodivergent: {
          preferences: {
            focusMode: "default",
            visualDensity: "comfortable",
          },
        },
      },
    };
    // Add both context-level and page-level init scripts to increase the
    // chance the seed is applied before any app script runs in all
    // environment permutations (CI, Windows, browser differences).
    await context.addInitScript({
      content: `try {
        window.__E2E_STORAGE_KEY__ = window.__E2E_STORAGE_KEY__ || 'wonky-sprout-os-state';
        window.__WONKY_TEST_INITIALIZE__ = ${JSON.stringify(seed)};
        window.__PLAYWRIGHT_SKIP_DEV_BYPASS__ = true;
        window.__WONKY_TEST_BLOCK_DB__ = true;
        // Use plain JS (no TS casts) in injected script
        try { window.localStorage.setItem(window.__E2E_STORAGE_KEY__ || 'wonky-sprout-os-state', JSON.stringify(${JSON.stringify(seed)})); } catch(e) { /* ignore */ }
        try { console.info('E2E: context.initScript applied'); } catch(e) { /* ignore */ }
      } catch (e) { /* ignore */ }`,
    });
    await page.addInitScript({
      content: `try {
        window.__E2E_STORAGE_KEY__ = window.__E2E_STORAGE_KEY__ || 'wonky-sprout-os-state';
        window.__WONKY_TEST_INITIALIZE__ = ${JSON.stringify(seed)};
        window.__PLAYWRIGHT_SKIP_DEV_BYPASS__ = true;
        window.__WONKY_TEST_BLOCK_DB__ = true;
        try { window.localStorage.setItem(window.__E2E_STORAGE_KEY__ || 'wonky-sprout-os-state', JSON.stringify(${JSON.stringify(seed)})); } catch(e) { /* ignore */ }
        try { console.info('E2E: page.initScript applied'); } catch(e) { /* ignore */ }
      } catch (e) { /* ignore */ }`,
    });
    // Navigate and retry if the dev server restarts or causes a transient 500
    // Use a few attempts to reduce flakiness caused by Vite HMR & rebuilds.
    const tryNavigate = async (attempts = 3) => {
      for (let i = 0; i < attempts; i++) {
        try {
          await page.goto("/");
          await page.waitForLoadState("networkidle");
          return;
        } catch (e) {
          // Retry after a short delay; allow HMR/dev server to stabilize
          await page.waitForTimeout(250 + i * 500);
          try {
            await page.reload({ waitUntil: "networkidle" });
          } catch (err) {
            /* ignore */
          }
        }
      }
      // Last attempt - let it throw if it still fails
      await page.goto("/");
      await page.waitForLoadState("networkidle");
    };
    await tryNavigate();

    // Wait for the test seed to be visible/available on the page so we know
    // pre-hydration succeeded. This isolates the failure to missing early
    // injection rather than a subsequent UI rendering/merge issue.
    await page.waitForFunction(
      () => {
        try {
          if ((window as any).__WONKY_TEST_INITIALIZE__) return true;
          const seedKey =
            (window as any).__E2E_STORAGE_KEY__ || "wonky-sprout-os-state";
          if (window.localStorage.getItem(seedKey)) return true;
          return false;
        } catch (e) {
          return false;
        }
      },
      { timeout: 10000 },
    );

    // Wait for the pre-hydrate runtime overlay (native overlay or React one)
    // to appear. This reduces flakiness where an overlay is created by the
    // prehydrate `main.tsx` script but not the React debug component.
    // Wait for either the prehydrate overlay/UI or the appState to report our view.
    await page.waitForFunction(
      () => {
        try {
          // If the app exposes appState, prefer that check as it is stable across reloads
          if (
            (window as any).appState &&
            (window as any).appState.view === "neuro-onboarding"
          )
            return true;
          // Otherwise, check for runtime/debug overlay or module presence
          if (document.getElementById("wonky-e2e-overlay")) return true;
          if (document.querySelector('[data-testid="e2e-runtime-view"]'))
            return true;
          if (document.querySelector('[data-testid="neuro-onboarding-title"]'))
            return true;
          if (document.querySelector(".onboarding-fixed-overlay")) return true;
          if (
            document.documentElement.getAttribute("data-e2e-view") ===
            "neuro-onboarding"
          )
            return true;
          return false;
        } catch (e) {
          return false;
        }
      },
      { timeout: 30000 },
    );

    // Confirm the runtime view reports the expected seeded `neuro-onboarding` view.
    const e2eRuntime = page.getByTestId("e2e-runtime-view").first();
    // If our React E2E debug component isn't present, fallback to the
    // pre-hydrate overlay element which uses `id=wonky-e2e-overlay`.
    const overlayExists = await page.evaluate(
      () => !!document.getElementById("wonky-e2e-overlay"),
    );
    const runtimeExists = await page.evaluate(
      () => !!document.querySelector('[data-testid="e2e-runtime-view"]'),
    );
    if (!overlayExists && !runtimeExists) {
      // If neither overlay is present, collect diagnostics to help triage
      const e2eLogs = await page.evaluate(() =>
        (window as any).__WONKY_E2E_LOG_GET__
          ? (window as any).__WONKY_E2E_LOG_GET__()
          : [],
      );
      const appStateRaw = await page.evaluate(
        () => (window as any).appState || null,
      );
      const seedRaw = await page.evaluate(() => {
        try {
          const key =
            (window as any).__E2E_STORAGE_KEY__ || "wonky-sprout-os-state";
          return window.localStorage.getItem(key);
        } catch (e) {
          return null;
        }
      });
      const domE2EAttr = await page.evaluate(() =>
        document.documentElement.getAttribute("data-e2e-view"),
      );
      // eslint-disable-next-line no-console
      console.error("E2E DIAGNOSTIC: overlay missing; fallback logs & state:", {
        e2eLogs,
        appStateRaw,
        seedRaw,
        domE2EAttr,
      });
    }
    if (overlayExists) {
      // Ensure the pre-hydrate overlay reflects our view
      const attrView = await page
        .locator("#wonky-e2e-overlay")
        .getAttribute("data-e2e-view");
      expect(attrView).toBe("neuro-onboarding");
    } else {
      await expect(e2eRuntime).toBeVisible({ timeout: 15000 });
      await expect(e2eRuntime).toHaveAttribute(
        "data-e2e-view",
        "neuro-onboarding",
      );
    }
    // Confirm the runtime view reports the expected seeded `neuro-onboarding` view.
    await expect(e2eRuntime).toHaveAttribute(
      "data-e2e-view",
      "neuro-onboarding",
    );

    // Force the view to ensure UI reflects the seeded state and to avoid
    // cases where `appState` has the seeded view but the UI hasn't navigated.
    try {
      await page.evaluate(() => {
        if ((window as any).__WONKY_TEST_FORCE_VIEW__) {
          (window as any).__WONKY_TEST_FORCE_VIEW__("neuro-onboarding");
          try {
            console.info(
              "E2E: forced neuro-onboarding view (before overlay wait)",
            );
          } catch (e) {
            /* ignore */
          }
        }
      });
    } catch (e) {
      /* ignore */
    }
    // Ensure the Onboarding Stepper is present (accept either the overlay or the module title)
    const onboardingStepper = page.locator(".onboarding-fixed-overlay");
    const neuroTitle = page
      .locator('[data-testid="neuro-onboarding-title"]')
      .first();
    await Promise.race([
      onboardingStepper.waitFor({ state: "visible", timeout: 30000 }),
      neuroTitle.waitFor({ state: "visible", timeout: 30000 }),
    ]);
    // Sanity-check window.appState so we can diagnose if the seed was applied
    const appState = await page.evaluate(() => (window as any).appState || {});
    await expect(appState.view).toBe("neuro-onboarding");
    await expect(appState.initialSetupComplete).toBe(false);

    // Allow DB snapshots to apply after we've verified the seeded state and
    // overlays; this prevents early DB snapshots from clobbering our seed.
    try {
      await page.evaluate(
        () =>
          (window as any).__WONKY_TEST_ALLOW_DB_UPDATES__ &&
          (window as any).__WONKY_TEST_ALLOW_DB_UPDATES__(true),
      );
    } catch (e) {
      // Ignore — it's okay if the helper isn't defined in non-E2E runs
    }
  });

  test("Neuro Onboarding can be opened from command palette @smoke", async ({
    page,
  }) => {
    // Allow longer time for slow environments or CI to open the command palette
    test.setTimeout(150_000);
    // Open Command Palette
    await page.keyboard.press("Meta+K");
    await page.waitForTimeout(500); // Allow animation

    // Type "Neuro" — robust wait with retries for flaky environments
    const waitInput = async () => {
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          await page.waitForSelector('[placeholder*="Type a command"]', {
            timeout: 120000,
          });
          return true;
        } catch (err) {
          // Retry opening the command palette in case of animation or overlay issues
          try {
            await page.keyboard.press("Meta+K");
          } catch {}
          try {
            await page.keyboard.press("Control+K");
          } catch {}
          // Small delay to allow animation/overlay to settle
          await page.waitForTimeout(750);
        }
      }
      return false;
    };
    const inputReady = await waitInput();
    if (!inputReady) {
      // Give a last-ditch reload one chance to recover
      await page.reload({ waitUntil: "networkidle" });
      const recovery = await waitInput();
      if (!recovery)
        throw new Error("Command palette did not appear after retries");
    }
    const input = page.getByPlaceholder(/Type a command|Search/i);
    // Wait for command palette input to appear and allow a generous fill timeout for slow envs
    await expect(input).toBeVisible({ timeout: 150000 });
    await input.fill("Neuro", { timeout: 120000 });
    await page.waitForTimeout(500);

    // Click the first option that matches
    await page.getByRole("option", { name: /Neuro/i }).first().click();

    // Verify the Vault loaded (look for "SOP", "Protocol", or "Vault")
    const header = page
      .locator("h1, h2")
      .filter({ hasText: /SOP|Flight Protocol|Vault/i })
      .first();
    await expect(header).toBeVisible({ timeout: 10000 });
  });

  test("SOP Vault imports neuro templates", async ({ page }) => {
    // FIX: Handle the "Multiple Elements" error
    // We grab the testID, but we explicitly say "give me the first one"
    const navItem = page.getByTestId("nav-sop-vault").first();

    // If the nav item is hidden (mobile), open the menu first
    if (!(await navItem.isVisible())) {
      const mobileMenu = page.getByTestId("mobile-menu-button");
      if (await mobileMenu.isVisible()) {
        await mobileMenu.click();
      }
    }

    // Wait for Workshop header to be visible before clicking navigation
    const cockpitHeader = page
      .locator("h1, h2")
      .filter({ hasText: /Workshop|Command Center|Dashboard/i })
      .first();
    await expect(cockpitHeader).toBeVisible({ timeout: 10000 });
    await navItem.click();
    await page.waitForLoadState("networkidle");

    // Verify Import Button exists
    await expect(page.getByText(/Import/i).first()).toBeVisible();
    await page
      .getByText(/Import/i)
      .first()
      .click();

    // Verify Neurodivergent Templates exist
    await expect(page.getByText(/Neurodivergent/i).first()).toBeVisible();
  });
});
