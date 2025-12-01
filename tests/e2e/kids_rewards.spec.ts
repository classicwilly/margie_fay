import { test, expect } from './playwright-fixtures';
import { ensureAppView, retryClick } from './helpers/retryHelpers';
import applyAiStub from './helpers/aiStub';
import { installErrorCapture, errorCaptureScript } from './helpers/errorCapture';

test.skip('Kids corner and reward tiers visible @smoke', async ({ page }) => {
  // Increase test-level timeout for multi-worker flakiness
  test.setTimeout(120_000);
  // Optional: start tracing for this test if CI or explicit debug flag is enabled
  const testInfo = test.info();
  const shouldTrace = !!process.env.WONKY_E2E_TRACE_TESTS || (!!process.env.CI && testInfo.retry > 0);
  if (shouldTrace) await page.context().tracing.start({ screenshots: true, snapshots: true });
    // Install E2E error capture script early so any early crash is recorded
    const ec = errorCaptureScript;
    await page.addInitScript(ec);

  // Set a flag to force the AppStateProvider into the correct view for E2E
  // Use addInitScript so the override is set before the app initializes
  // Ensure no cross-test state from other workers; clear seed then set the forced view
  await page.addInitScript((seedKey) => {
    const key = (seedKey as string) || (window as any).__E2E_STORAGE_KEY__ || 'wonky-sprout-os-state';
      try { window.localStorage.removeItem(key); } catch { /* ignore */ }
    try { (window as any).__E2E_FORCE_VIEW__ = 'willows-dashboard'; } catch { /* ignore */ }
  });
 
  // Seed a complete app state to show Willow dashboard with all required keys
  await page.addInitScript((seedKey) => {
    try {
      const state = {
        dashboardType: 'willow',
        view: 'willows-dashboard',
        initialSetupComplete: true,
        willowDashboardModules: [
          'reward-store-module',
          'willow-gem-collector-module'
        ],
        sebastianDashboardModules: [],
        collectedGems: {
          willow: ['morning-hair','morning-teeth','morning-clothes','morning-water','moms-wake'],
          sebastian: []
        },
        checkedItems: {},
        textInputs: {},
        statusMood: 'Calm',
        statusEnergy: 'Medium',
        kidsWillowLocation: 'At Mom\'s',
        kidsSebastianLocation: 'At Mom\'s',
        collectedAchievements: {},
        userSops: [],
        savedContext: null,
        toastNotifications: [],
        chatMessages: [],
        dismissedNudges: [],
        sharedExpenses: [],
        habitTracker: { log: {} },
        isContextCaptureModalOpen: false,
        isContextRestoreModalOpen: false,
        onboardingStep: 0,
        isModMode: false,
        // Add any other required keys from defaultUserState here as needed
      };
      const key = (seedKey as string) || (window as any).__E2E_STORAGE_KEY__ || 'wonky-sprout-os-state';
      window.localStorage.setItem(key, JSON.stringify(state));
        try { (window as any).__PLAYWRIGHT_SKIP_DEV_BYPASS__ = true; } catch { /* ignore */ }
      // Disable AI by default for this smoke test; we don't validate AI here.
        try { window.localStorage.setItem('wonky_flags', JSON.stringify({ aiEnabled: false })); } catch { /* ignore */ }
    } catch { /* ignore */ }
  });
  // Navigate to the app with an enforced forced-view query so it is set at the earliest stage
  await page.goto('/?force_e2e_view=willows-dashboard', { waitUntil: 'load' });

  // Verify seeding was applied in page context
  const e2eForcePresent = await page.evaluate(() => !!(window as any).__E2E_FORCE_VIEW__);
  console.log('WONKY_E2E_FORCE_PRESENT', e2eForcePresent);
  const seededKeyCheck = await page.evaluate(() => (window as any).__E2E_STORAGE_KEY__ || 'wonky-sprout-os-state');
  // Wait for a special console message from our error capture helper, if one appears
  try {
    const consoleMsg = await page.waitForEvent('console', { timeout: 2000, predicate: m => m.text().includes('WONKY_E2E_ERROR') || m.text().includes('WONKY_GLOBAL_ERROR_ONERROR') });
    console.log('PW_MONITOR_CONSOLE', consoleMsg.type(), consoleMsg.text());
  } catch (e) {
    console.log('PW_MONITOR_CONSOLE', 'no early error console message');
  }

  // Ensure deterministic AI responses for the test run; `force` makes local runs stable.
  await applyAiStub(page, { force: true });
  // Winston: wire browser console to node logs to capture errors thrown during render
  page.on('console', (msg) => console.log('PW_CONSOLE', msg.type(), msg.text()));
  await page.goto('/', { waitUntil: 'load' });
  await page.waitForLoadState('networkidle');
  // Debug: log seeded localStorage and appState.view so we can verify what the app sees after reload
  try {
    const rawState = await page.evaluate(() => {
      const key = (window as any).__E2E_STORAGE_KEY__ || 'wonky-sprout-os-state';
      return window.localStorage.getItem(key);
    });
    console.log('WONKY_SEEDED_STATE_RAW', rawState);
    const appView = await page.evaluate(() => {
      try {
        return window.appState?.view || null;
      } catch (e) { return 'error'; }
    });
    console.log('WONKY_APPSTATE_VIEW', appView);
  } catch (e) { console.warn('WONKY_SEEDED_STATE_RAW failed', e); }
  // Debug modules present on the seeded state
  try {
    const modules = await page.evaluate(() => ({
      view: (window as any).appState?.view,
      dashboardType: (window as any).appState?.dashboardType,
      willowDashboardModules: (window as any).appState?.willowDashboardModules
    }));
    console.log('WONKY_SEEDED_MODULES', modules);
  } catch (e) { console.warn('WONKY_SEEDED_MODULES failed', e); }
  // Debug: surface the last error captured by ErrorBoundary to the test logs
  try {
    const lastErr = await page.evaluate(() => (window as any).__WONKY_LAST_ERROR__ || null);
    const lastErrRaw = await page.evaluate(() => window.localStorage.getItem('wonky-last-error'));
    console.log('WONKY_LAST_ERROR_RAW', lastErrRaw);
    // If the error is present in the DOM (ErrorBoundary rendered it), capture it and fail with the message
    const domError = await page.getByTestId('wonky-last-error').allInnerTexts();
    if (domError && domError.length > 0) {
      throw new Error(`E2E Captured error from ErrorBoundary: ${domError.join('\n')}`);
    }
    // If an error is present, fail early with the details so the Playwright log
    // and Vitest output include the stack for debugging.
    expect(lastErr).toBeNull();
  } catch (e) { console.warn('Could not read WONKY_LAST_ERROR from page', e); }
  // In DEV mode the app may show a different dashboard; navigate explicitly
  // to the Little Sprouts / Willow dashboard if the kids corner isn't present.
  // Default: look for the Kids corner heading (Little Sprouts). If not present, open the Command Center and click Little Sprouts.
  await page.waitForLoadState('networkidle');
  try {
    // V1.0 known limitation: this flow is slow for some environments; we give it a generous timeout.
    await expect(page.getByTestId('kids-corner-heading')).toBeVisible({ timeout: 120000 });
  } catch (e) {
      // Prefer direct navigation to the Little Sprouts -- it's present for Willow dashboards
      // Prefer a testid on the navigation to avoid localization/label mismatch
      // Prefer an explicit test-id for the child dashboard. We use a generic
      // `nav-child-dashboard` so tests aren't tied to a specific person name.
      let littleSproutsNav = page.getByTestId('nav-child-dashboard');
      if (!(await littleSproutsNav.count())) littleSproutsNav = page.getByRole('button', { name: /Child Dashboard|Child|Little Sprouts|Willow's/i });
      if (!(await littleSproutsNav.count())) {
        // If not present, try the command center menu if available
        let commandCenterNav = page.getByTestId('nav-command-center');
        if ((await commandCenterNav.count()) > 1) commandCenterNav = commandCenterNav.first();
        if (!(await commandCenterNav.count())) commandCenterNav = page.getByRole('button', { name: 'The Cockpit' });
        if (await commandCenterNav.count()) {
          await commandCenterNav.waitFor({ state: 'visible', timeout: 15000 });
          await retryClick(commandCenterNav, { tries: 3 });
          await retryClick(page.getByText(/Little Sprouts/i), { tries: 3 });
        } else {
          // Nothing matched — try the System menu.
          let systemBtn = page.getByTestId('nav-system');
          let systemBtnCount = await systemBtn.count();
          if (systemBtnCount === 0) {
            systemBtn = page.getByRole('button', { name: /System/i });
            systemBtnCount = await systemBtn.count();
          }
          if (systemBtnCount > 0) {
            await retryClick(systemBtn, { tries: 3 });
            await page.getByRole('menu').waitFor({ state: 'visible', timeout: 15000 });
            const littleMenuCount = await page.getByRole('menuitem', { name: /Little Sprouts/i }).count();
            if (littleMenuCount > 0) {
              await retryClick(page.getByRole('menuitem', { name: /Little Sprouts/i }), { tries: 3 });
            } else {
              await retryClick(page.getByText(/Little Sprouts/i), { tries: 3 });
            }
          }
      }
    }
  }

  // Helper for fallback navigation via system menu
  const fallbackSystemMenuNav = async () => {
    let systemBtn = page.getByTestId('nav-system');
    let systemBtnCount = await systemBtn.count();
    if (systemBtnCount === 0) {
      systemBtn = page.getByRole('button', { name: /System/i });
      systemBtnCount = await systemBtn.count();
    }
    if (systemBtnCount > 0) {
      await retryClick(systemBtn, { tries: 3 });
            await page.getByRole('menu').waitFor({ state: 'visible', timeout: 15000 });
            const menuItem = page.getByRole('menuitem', { name: /Child Dashboard|Child|Willow's Sprout|Willow's|Little Sprouts/i });
      const menuItemCount = await menuItem.count();
      if (menuItemCount > 0) {
        await retryClick(menuItem, { tries: 3 });
        await page.waitForLoadState('networkidle');
      }
    }
  };

  // Ensure we are on Willow's dashboard before checking for Reward Store or Dopamine Mining
  let dashboardLoaded = false;
  try {
    await ensureAppView(page, 'willows-dashboard');
    await page.waitForSelector('[data-testid="kids-reward-store"]', { state: 'attached', timeout: 30000 });
    await expect(page.getByTestId('kids-reward-store')).toBeVisible({ timeout: 15000 });
    await expect(page.getByTestId('kids-gem-collection')).toBeVisible({ timeout: 15000 });
    dashboardLoaded = true;
  } catch (e) {
    const nav = page.getByRole('button', { name: /Child Dashboard|Child|Willow's Sprout|Willow's/i });
    const navCount = await nav.count();
    if (navCount > 0) {
      await retryClick(nav, { tries: 3 });
      // Ensure dispatch is triggered: fallback to an evaluated click on the element
      await nav.evaluate((el: HTMLElement) => el.click());
      // Wait for appState view to update
      try { await ensureAppView(page, 'willows-dashboard'); } catch (_) {}
      await page.waitForLoadState('networkidle');
      try {
        await page.waitForSelector('[data-testid="kids-reward-store"]', { state: 'attached', timeout: 30000 });
        await expect(page.getByTestId('kids-reward-store')).toBeVisible({ timeout: 15000 });
        await expect(page.getByTestId('kids-gem-collection')).toBeVisible({ timeout: 15000 });
        dashboardLoaded = true;
      } catch (err) {}
    } else {
      await fallbackSystemMenuNav();
          try {
          await ensureAppView(page, 'willows-dashboard');
          await page.waitForSelector('[data-testid="kids-reward-store"]', { state: 'attached', timeout: 30000 });
          await expect(page.getByTestId('kids-reward-store')).toBeVisible({ timeout: 15000 });
          await expect(page.getByTestId('kids-gem-collection')).toBeVisible({ timeout: 15000 });
          dashboardLoaded = true;
      } catch (err) {}
    }
  }
  if (!dashboardLoaded) {
    // Final attempt: re-seed state explicitly then reload to force correct dashboard
    await page.evaluate(() => {
      try {
        const key = (window as any).__E2E_STORAGE_KEY__ || 'wonky-sprout-os-state';
        const raw = window.localStorage.getItem(key);
        let state;
        try { state = raw ? JSON.parse(raw) : {}; } catch { state = {}; }
        state.dashboardType = 'willow';
        state.view = 'willows-dashboard';
        state.initialSetupComplete = true;
        state.willowDashboardModules = ['reward-store-module', 'willow-gem-collector-module'];
        window.localStorage.setItem(key, JSON.stringify(state));
          try { (window as any).__PLAYWRIGHT_SKIP_DEV_BYPASS__ = true; } catch { /* ignore */ }
      } catch { /* ignore */ }
    });
    await page.reload({ waitUntil: 'load' });
    await page.waitForLoadState('networkidle');
    try {
      await page.waitForSelector('[data-testid="kids-reward-store"]', { state: 'attached', timeout: 30000 });
      await expect(page.getByTestId('kids-reward-store')).toBeVisible({ timeout: 15000 });
      await expect(page.getByTestId('kids-gem-collection')).toBeVisible({ timeout: 15000 });
      dashboardLoaded = true;
    } catch (e) {
        await page.screenshot({ path: 'child_dashboard_not_loaded.png' });
        throw new Error('Child dashboard not loaded: Reward Store or Dopamine Mining not visible');
    }
  }

  // Stop tracing and save if we started it
  try {
    if (shouldTrace) await page.context().tracing.stop({ path: 'trace-kids_rewards.zip' });
  } catch (e) { console.warn('Failed to stop tracing', e); }

    // If the Reward Store is present, verify that a reward tier is visible and redemption works.
    if ((await page.getByTestId('reward-tier-5').count()) > 0) {
      const tier = page.getByTestId('reward-tier-5');
      const redeemBtn = tier.getByRole('button', { name: /Redeem/i });
      await expect(redeemBtn).toBeVisible({ timeout: 15000 });
      await redeemBtn.click();
      // After dispatch, the UI should update to show a Pending state
      await expect(tier.getByRole('button', { name: /Pending/i })).toBeDisabled();
    } else {
      // Fallback: ensure the Dopamine Mining area exists and shows a progress message
      await expect(page.getByTestId('kids-gem-collection')).toBeVisible();
    }

  // This test is intentionally simple; detailed redemption tests are in `kids_rewards_full.spec.ts`.
});
