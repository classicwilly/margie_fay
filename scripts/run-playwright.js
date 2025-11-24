#!/usr/bin/env node
// Lightweight wrapper that preloads our test shim and runs Playwright's CLI
// NOTE: We do not import `register_shim.cjs` here because it aliases
// `@playwright/test` to our local fixtures. If we install that alias
// before resolving the Playwright CLI path the alias will interfere
// with resolving `@playwright/test/lib/cli.js` which expects to come
// from the Playwright package. We'll register the test shim after the
// CLI path is resolved below so our alias doesn't break module resolution.

async function run() {
  // Avoid importing Playwright internal CLI path (which isn't exported
  // in newer Playwright versions) and instead execute it using the
  // `npx playwright test` CLI wrapped in a child process. This approach
  // is more compatible across versions and avoids export-map related
  // runtime failures (ERR_PACKAGE_PATH_NOT_EXPORTED).
  try {
    const { spawnSync } = await import("child_process");

    // register test shim so that `@playwright/test` resolves to our fixtures
    try {
      await import("./../tests/e2e/register_shim.cjs");
    } catch (shimErr) {
      console.info(
        "No test shim found or could not register:",
        shimErr?.message || shimErr,
      );
    }

    // Check Node.js version for Vite compatibility and warn if too low.
    const semver = (version) => version.split(".").map((n) => parseInt(n, 10));
    const nodeVer = semver(process.versions.node || "0.0.0");
    const required = semver("20.19.0");
    for (let i = 0; i < 3; i++) {
      if ((nodeVer[i] || 0) < (required[i] || 0)) {
        console.error(
          `Your Node.js ${process.versions.node} is older than recommended ${required.join(".")} for Vite. Tests may fail. Please upgrade Node.js.`,
        );
        break;
      }
      if ((nodeVer[i] || 0) > (required[i] || 0)) break;
    }

    const shimRel = "./tests/e2e/register_shim.cjs";
    const env = {
      ...process.env,
      NODE_OPTIONS: `${process.env.NODE_OPTIONS || ""} -r ${shimRel}`,
    };
    const args = ["playwright", "test", ...process.argv.slice(2)];
    const r = spawnSync("npx", args, { stdio: "inherit", shell: true, env });
    process.exit(r.status || 0);
  } catch (e) {
    console.error("Failed to spawn Playwright CLI via script", e);
    process.exit(1);
  }
}

run();
