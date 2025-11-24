const moduleAlias = require("module-alias");
const path = require("path");

// Map @playwright/test to our fixture so tests importing it see the extended fixtures.
try {
  const fixturesPath = path.join(
    process.cwd(),
    "tests",
    "e2e",
    "playwright-fixtures.ts",
  );
  moduleAlias.addAlias("@playwright/test", fixturesPath);
  // Also add a safe alias to the original package for the fixture to require
  const realPath = require.resolve("@playwright/test");
  moduleAlias.addAlias("@wonky/playwright-test-original", realPath);
  console.log("Alias installed: @playwright/test ->", fixturesPath);
} catch (e) {
  console.error("Failed to install test alias:", e);
}
