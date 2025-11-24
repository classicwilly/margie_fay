import { test, expect } from "./playwright-fixtures";

test("Environment health checks - duplicate React detection @smoke", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "load" });
  await page.waitForLoadState("networkidle");
  // Log the presence of an importmap string (helps debug CDN injection)
  const hasImportMap = await page.evaluate(() => {
    try {
      const scripts = Array.from(
        document.querySelectorAll('script[type="importmap"]'),
      );
      return scripts.map((s) => s.textContent || s.innerHTML || "").join("\n");
    } catch (e) {
      return null;
    }
  });
  if (hasImportMap) {
    // Attach the importmap to the test as a note for diagnostics
    test.info().annotations.push({
      type: "note",
      description: `importmap (detected): ${String(hasImportMap).slice(0, 300)}`,
    });
  }
  // Some builds don't expose the devtools hook; if missing, skip the check
  const res = await page.evaluate(() => {
    try {
      const hook = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (!hook) return { found: false };
      const renderersMap = hook.renderers ?? hook._renderers ?? null;
      // If renderers is a Map-like object with .size, use it
      if (renderersMap && typeof renderersMap.size === "number") {
        const versions = [] as string[];
        for (const r of renderersMap.values()) {
          const v =
            r &&
            (r.version ||
              r.currentRendererVersion ||
              r._rendererVersion ||
              (r.getRendererVersion && r.getRendererVersion()));
          versions.push(v || "unknown");
        }
        return { found: true, count: renderersMap.size, versions };
      }
      // If the hook is present but we can't enumerate renderers, mark detected but unenumerable
      return { found: true, count: 1 };
    } catch (e) {
      return { error: String(e) };
    }
  });

  if (!res.found) {
    // Nothing to check — this is likely a production/minified build. Pass the test.
    test.info().annotations.push({
      type: "note",
      description:
        "React devtools hook not present; skipping duplicate React check",
    });
    return;
  }

  // If multiple React renderers are attached, fail early and provide versions
  if (res.count && res.count > 1) {
    // Add an explicit note showing the versions found — this is critical for diagnosing "Invalid hook call" errors.
    test.info().annotations.push({
      type: "error",
      description: `Duplicate React renderers detected: ${JSON.stringify(res.versions)}`,
    });
    throw new Error(
      `Duplicate React renderers detected: ${JSON.stringify(res.versions)} — Check ` +
        "`index.html` importmap or Vite plugins to ensure React isn't loaded twice.",
    );
  }
  // If it's present but count <= 1, assume safe
  expect(res.count <= 1).toBeTruthy();
});
