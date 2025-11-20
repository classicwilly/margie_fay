#!/usr/bin/env node
// Lightweight wrapper that preloads our test shim and runs Playwright's CLI
// NOTE: We do not import `register_shim.cjs` here because it aliases
// `@playwright/test` to our local fixtures. If we install that alias
// before resolving the Playwright CLI path the alias will interfere
// with resolving `@playwright/test/lib/cli.js` which expects to come
// from the Playwright package. We'll register the test shim after the
// CLI path is resolved below so our alias doesn't break module resolution.

async function run() {
  try {
    // Import Playwright CLI directly (runs in the same node process)
    // Resolve Playwright CLI path via createRequire so we can import its
    // internal module even when the package export map doesn't expose it.
    const { createRequire } = await import('module');
    const localRequire = createRequire(import.meta.url);
    const cliPath = localRequire.resolve('@playwright/test/lib/cli.js');
    // Register test shim (install module alias) before running the CLI so
    // tests that import `@playwright/test` pick up our fixtures.
    try {
      await import('./../tests/e2e/register_shim.cjs');
    } catch (shimErr) {
      // Log and continue; tests may not need the shim.
      console.error('Could not register test shim:', shimErr);
    }

    const { runCLI } = await import(cliPath);
    // runCLI returns a Promise or similar; call with provided args
    const args = process.argv.slice(2);
    const res = await runCLI(args);
    process.exit(res ?? 0);
  } catch (e) {
    console.error('Failed to launch Playwright CLI via script', e);
    // As fallback, spawn the normal CLI
    const { spawnSync } = await import('child_process');
    // When fallback to spawn is needed (like on Windows), ensure we preload
    // our test shim so fixtures like `storageKey` are available to the
    // Playwright worker process. Use NODE_OPTIONS to preload the shim.
    const shimRel = './tests/e2e/register_shim.cjs';
    const env = { ...process.env, NODE_OPTIONS: `${process.env.NODE_OPTIONS || ''} -r ${shimRel}` };
    const r = spawnSync('npx', ['playwright', 'test', ...process.argv.slice(2)], { stdio: 'inherit', shell: true, env });
    process.exit(r.status || 1);
  }
}

run();
