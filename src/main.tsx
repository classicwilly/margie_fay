import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import registerGlobalErrorHandlers from './utils/globalErrorHandlers';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount React application to.");
}

// Register global error handlers early in the app lifecycle so we capture
// initialization errors before React mounts.
// Register global error handlers once, as early as possible
// Pre-hydrate E2E flags and seeded state references before React mounts.
// This ensures Playwright's `page.addInitScript` or index.html query params
// are honored synchronously and prevents render races where the app mounts
// before test-provided seeds are visible.
try {
  if (typeof window !== 'undefined') {
    const url = new URL(window.location.href);
    const forceView = url.searchParams.get('force_e2e_view');
    if (forceView) {
      try { (window as any).__E2E_FORCE_VIEW__ = forceView; } catch (e) { /* ignore */ }
      // Set a debug console message so Playwright logs show the early value
      // eslint-disable-next-line no-console
      console.info('PREHYDRATE: __E2E_FORCE_VIEW__', forceView);
      try { (window as any).__WONKY_E2E_LOG_PUSH__('PREHYDRATE_FORCE_VIEW', { view: forceView }); } catch (e) { /* ignore */ }
    }

    // Honor __WONKY_TEST_INITIALIZE__ early if present. Tests may set this
    // helper via page.addInitScript and expect its values to be honored
    // synchronously. If the test seeds an admin dashboard, prefer the Game
    // Master dashboard for deterministic admin E2E flows.
    try {
      const earlyInit = (window as any).__WONKY_TEST_INITIALIZE__;
      if (earlyInit && typeof earlyInit === 'object') {
      try { if (earlyInit.view) document.documentElement.setAttribute('data-e2e-view', earlyInit.view); } catch(e) { /* ignore */ }
        if (earlyInit.view) {
          try { (window as any).__E2E_FORCE_VIEW__ = earlyInit.view; } catch (e) { /* ignore */ }
          console.info('PREHYDRATE: __WONKY_TEST_INITIALIZE__ view applied', earlyInit.view);
          try { (window as any).__WONKY_E2E_LOG_PUSH__('PREHYDRATE_TEST_INIT_VIEW', { view: earlyInit.view }); } catch (e) { /* ignore */ }
        }
        if (earlyInit.dashboardType === 'william') {
          try { (window as any).__E2E_FORCE_GAMEMASTER__ = true; } catch (e) { /* ignore */ }
          console.info('PREHYDRATE: __WONKY_TEST_INITIALIZE__ dashboardType=william — forcing GameMaster');
          try { (window as any).__WONKY_E2E_LOG_PUSH__('PREHYDRATE_TEST_INIT_DASHBOARD', { dashboardType: earlyInit.dashboardType }); } catch (e) { /* ignore */ }
        }
      }
    } catch (e) { /* ignore */ }
    // If E2E seeded state exists, block DB updates until tests allow them
    try {
      if ((window as any).__WONKY_TEST_INITIALIZE__) {
        try { (window as any).__WONKY_TEST_BLOCK_DB__ = true; } catch(e) { /* ignore */ }
        // Default fallback timeout - can be tuned by tests using __WONKY_TEST_DB_ALLOW_TIMEOUT__
        try { (window as any).__WONKY_TEST_DB_ALLOW_TIMEOUT__ = (window as any).__WONKY_TEST_DB_ALLOW_TIMEOUT__ || 6000; } catch(e) { /* ignore */ }
      }
    } catch (e) { /* ignore */ }
    // If a test seeded a full state via __WONKY_TEST_INITIALIZE__, persist it
    // to the configured storage key so AppStateProvider reads it synchronously
    // from localStorage. This ensures `skipDev` and the E2E provider branch
    // are used reliably by test seeds.
    try {
      const earlyInit = (window as any).__WONKY_TEST_INITIALIZE__;
      const seedKey = (window as any).__E2E_STORAGE_KEY__ || 'wonky-sprout-os-state';
      if (earlyInit && typeof earlyInit === 'object') {
        try { if (earlyInit.view) window.localStorage.setItem('__WONKY_TEST_STICKY_VIEW__', earlyInit.view); } catch(e) { /* ignore */ }
        try { (window as any).__WONKY_TEST_STICKY_VIEW__ = earlyInit.view; } catch(e) { /* ignore */ }
        try { (window as any).appState = { ...(window as any).appState || {}, view: earlyInit.view, dashboardType: earlyInit.dashboardType, initialSetupComplete: earlyInit.initialSetupComplete || true }; } catch (e) { /* ignore */ }
        try { window.localStorage.setItem(seedKey, JSON.stringify(earlyInit)); } catch (e) { /* ignore */ }
        console.info('PREHYDRATE: wrote __WONKY_TEST_INITIALIZE__ to localStorage', { seedKey });
        try { (window as any).__WONKY_E2E_LOG_PUSH__('PREHYDRATE_WRITE_STICKY', { seedKey, view: earlyInit.view }); } catch (e) { /* ignore */ }
      }
    } catch (e) { /* ignore */ }
    // If tests seeded __WONKY_TEST_INITIALIZE__, ensure the provider skips
    // the dev-only bypass so the E2E provider is used and tests can control
    // the seeded state deterministically.
    try {
      const earlyInit = (window as any).__WONKY_TEST_INITIALIZE__;
      if (earlyInit && typeof earlyInit === 'object') {
        try { (window as any).__PLAYWRIGHT_SKIP_DEV_BYPASS__ = true; } catch (e) { /* ignore */ }
        console.info('PREHYDRATE: __WONKY_TEST_INITIALIZE__ present — enabling PLAYWRIGHT_SKIP_DEV_BYPASS');
      }
    } catch (e) { /* ignore */ }

    // If a seed is present in localStorage, make sure the AppStateProvider
    // will skip the dev-bypass; this mirrors the provider's `skipDev` check
    // and eliminates timing issues.
    const seedKey = (window as any).__E2E_STORAGE_KEY__ || 'wonky-sprout-os-state';
    try {
      const raw = window.localStorage.getItem(seedKey);
      if (raw) {
        try { (window as any).__PLAYWRIGHT_SKIP_DEV_BYPASS__ = true; } catch (e) { /* ignore */ }
        // eslint-disable-next-line no-console
        console.info('PREHYDRATE: seed found — skip dev bypass enabled', { seedKey });
      }
    } catch (e) { /* ignore */ }
    // Add a tiny runtime DOM overlay so Playwright and tests have a deterministic
    // early anchor to check current view/dashboard type even before React mounts.
    try {
      if (typeof document !== 'undefined') {
        const overlayId = 'wonky-e2e-overlay';
        let el = document.getElementById(overlayId);
        const isE2E = !!(window as any).__WONKY_TEST_INITIALIZE__ || !!(window as any).__E2E_FORCE_VIEW__ || !!window.localStorage.getItem((window as any).__E2E_STORAGE_KEY__ || 'wonky-sprout-os-state');
        if (isE2E) {
          if (!el) {
            el = document.createElement('div');
            el.id = overlayId;
            el.setAttribute('data-testid', 'e2e-runtime-view');
            el.className = 'e2e-debug';
            document.body.appendChild(el);
          }
          const updateOverlay = () => {
            try {
              const view = (window as any).__WONKY_TEST_INITIALIZE__?.view || (window as any).appState?.view || document.documentElement.dataset.e2eView || 'unknown';
              const dashboard = (window as any).__WONKY_TEST_INITIALIZE__?.dashboardType || (window as any).appState?.dashboardType || 'unknown';
              el!.setAttribute('data-e2e-view', view);
              el!.setAttribute('data-e2e-dashboard', dashboard);
              el!.innerHTML = `<div><strong>E2E-VIEW:</strong> ${view}</div><div><strong>DASH:</strong> ${dashboard}</div>`;
            } catch (e) { /* ignore */ }
          };
          updateOverlay();
          // Keep overlay updated briefly during early boot
          const int = setInterval(updateOverlay, 400);
          setTimeout(() => { clearInterval(int); updateOverlay(); }, 6000);
        }
      }
    } catch (e) { /* ignore overlay errors */ }
  }
} catch (e) {
  // Don't block app boot on any accidental failures to parse URL
  // eslint-disable-next-line no-console
  console.warn('PREHYDRATE: failed', e);
}

// Install a tiny, early stub for the E2E view helper so tests can call it
// immediately after navigation, even before React mounts. The provider will
// later replace this stub with a fully functional version during E2E runs.
try {
  if (typeof window !== 'undefined' && !(window as any).__WONKY_TEST_FORCE_VIEW__) {
    (window as any).__WONKY_TEST_FORCE_VIEW__ = (view: string) => {
      try { (window as any).__E2E_FORCE_VIEW__ = view; } catch (e) { /* ignore */ }
      try { window.appState = { ...(window as any).appState || {}, view }; } catch (e) { /* ignore */ }
      // Provide a console indicator so Playwright logs show usage of the stub
      // eslint-disable-next-line no-console
      console.info('E2E STUB: __WONKY_TEST_FORCE_VIEW__ used to set', view);
    };
  }
} catch (e) { /* ignore */ }

registerGlobalErrorHandlers();

const root = ReactDOM.createRoot(rootElement);
// Install global error handlers as early as possible to capture runtime
// errors that happen before React mounts.
// already registered above
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);