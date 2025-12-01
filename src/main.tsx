import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { logInfo, logWarn } from './utils/logger';
import App from './App';
import { AppStateProvider } from './contexts/AppStateContext';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <AppStateProvider>
      <App />
    </AppStateProvider>
  </React.StrictMode>
);

// Register global error handlers early in the app lifecycle so we capture
// initialization errors before React mounts.
// Register global error handlers once, as early as possible
// Pre-hydrate E2E flags and seeded state references before React mounts.
// This ensures Playwright's `page.addInitScript` or index.html query params
// are honored synchronously and prevents render races where the app mounts
// before test-provided seeds are visible.
  try {
    if (typeof window !== 'undefined') {
      const win = window as Window & {
        __E2E_FORCE_VIEW__?: string;
        __WONKY_E2E_LOG_PUSH__?: (name: string, data?: unknown) => void;
        __WONKY_TEST_INITIALIZE__?: Record<string, unknown>;
        __WONKY_TEST_BLOCK_DB__?: boolean;
        __WONKY_TEST_DB_ALLOW_TIMEOUT__?: number;
        __E2E_STORAGE_KEY__?: string;
        __WONKY_TEST_STICKY_VIEW__?: string;
        appState?: Record<string, unknown>;
        __PLAYWRIGHT_SKIP_DEV_BYPASS__?: boolean;
        __WONKY_TEST_FORCE_VIEW__?: (view: string) => void;
      };
    const url = new URL(win.location.href);
    const forceView = url.searchParams.get('force_e2e_view');
    if (forceView) {
      try { win.__E2E_FORCE_VIEW__ = forceView; } catch { /* ignore */ }
      // Use logger for dev tracing instead of console.* calls
      logInfo('PREHYDRATE: __E2E_FORCE_VIEW__', forceView);
      try { win.__WONKY_E2E_LOG_PUSH__?.('PREHYDRATE_FORCE_VIEW', { view: forceView }); } catch { /* ignore */ }
    }

    // Honor __WONKY_TEST_INITIALIZE__ early if present. Tests may set this
    // helper via page.addInitScript and expect its values to be honored
    // synchronously. If the test seeds an admin dashboard, prefer the Game
    // Master dashboard for deterministic admin E2E flows.
    try {
      const earlyInit = win.__WONKY_TEST_INITIALIZE__;
      if (earlyInit && typeof earlyInit === 'object') {
      try { if (earlyInit.view) document.documentElement.setAttribute('data-e2e-view', earlyInit.view); } catch { /* ignore */ }
        if (earlyInit.view) {
          try { win.__E2E_FORCE_VIEW__ = earlyInit.view; } catch { /* ignore */ }
          logInfo('PREHYDRATE: __WONKY_TEST_INITIALIZE__ view applied', earlyInit.view);
            try { win.__WONKY_E2E_LOG_PUSH__?.('PREHYDRATE_TEST_INIT_VIEW', { view: earlyInit.view }); } catch { /* ignore */ }
        }
        if (earlyInit.dashboardType === 'william') {
          try { win.__E2E_FORCE_GAMEMASTER__ = true; } catch { /* ignore */ }
          logInfo('PREHYDRATE: __WONKY_TEST_INITIALIZE__ dashboardType=william — forcing GameMaster');
            try { win.__WONKY_E2E_LOG_PUSH__?.('PREHYDRATE_TEST_INIT_DASHBOARD', { dashboardType: earlyInit.dashboardType }); } catch { /* ignore */ }
        }
      }
    } catch { /* ignore */ }
    // If E2E seeded state exists, block DB updates until tests allow them
    try {
      if (win.__WONKY_TEST_INITIALIZE__) {
        try { win.__WONKY_TEST_BLOCK_DB__ = true; } catch { /* ignore */ }
        // Default fallback timeout - can be tuned by tests using __WONKY_TEST_DB_ALLOW_TIMEOUT__
        try { win.__WONKY_TEST_DB_ALLOW_TIMEOUT__ = win.__WONKY_TEST_DB_ALLOW_TIMEOUT__ || 6000; } catch { /* ignore */ }
      }
    } catch { /* ignore */ }
    // If a test seeded a full state via __WONKY_TEST_INITIALIZE__, persist it
    // to the configured storage key so AppStateProvider reads it synchronously
    // from localStorage. This ensures `skipDev` and the E2E provider branch
    // are used reliably by test seeds.
    try {
      const earlyInit = win.__WONKY_TEST_INITIALIZE__;
      const seedKey = win.__E2E_STORAGE_KEY__ || 'wonky-sprout-os-state';
      if (earlyInit && typeof earlyInit === 'object') {
        try { if (earlyInit.view) window.localStorage.setItem('__WONKY_TEST_STICKY_VIEW__', earlyInit.view); } catch { /* ignore */ }
        try { win.__WONKY_TEST_STICKY_VIEW__ = earlyInit.view; } catch { /* ignore */ }
          try { win.appState = { ...(win.appState || {}), view: earlyInit.view, dashboardType: earlyInit.dashboardType, initialSetupComplete: earlyInit.initialSetupComplete || true }; } catch { /* ignore */ }
        try { window.localStorage.setItem(seedKey, JSON.stringify(earlyInit)); } catch { /* ignore */ }
        logInfo('PREHYDRATE: wrote __WONKY_TEST_INITIALIZE__ to localStorage', { seedKey });
          try { win.__WONKY_E2E_LOG_PUSH__?.('PREHYDRATE_WRITE_STICKY', { seedKey, view: earlyInit.view }); } catch { /* ignore */ }
      }
    } catch { /* ignore */ }
    // If tests seeded __WONKY_TEST_INITIALIZE__, ensure the provider skips
    // the dev-only bypass so the E2E provider is used and tests can control
    // the seeded state deterministically.
    try {
      const earlyInit = win.__WONKY_TEST_INITIALIZE__;
      if (earlyInit && typeof earlyInit === 'object') {
        try { win.__PLAYWRIGHT_SKIP_DEV_BYPASS__ = true; } catch { /* ignore */ }
        logInfo('PREHYDRATE: __WONKY_TEST_INITIALIZE__ present — enabling PLAYWRIGHT_SKIP_DEV_BYPASS');
      }
    } catch { /* ignore */ }

    // If a seed is present in localStorage, make sure the AppStateProvider
    // will skip the dev-bypass; this mirrors the provider's `skipDev` check
    // and eliminates timing issues.
    const seedKey = win.__E2E_STORAGE_KEY__ || 'wonky-sprout-os-state';
    try {
      const raw = window.localStorage.getItem(seedKey);
      if (raw) {
        try { win.__PLAYWRIGHT_SKIP_DEV_BYPASS__ = true; } catch { /* ignore */ }
        logInfo('PREHYDRATE: seed found — skip dev bypass enabled', { seedKey });
      }
    } catch { /* ignore */ }
    // Add a tiny runtime DOM overlay so Playwright and tests have a deterministic
    // early anchor to check current view/dashboard type even before React mounts.
    try {
      if (typeof document !== 'undefined') {
        const overlayId = 'wonky-e2e-overlay';
        let el = document.getElementById(overlayId);
        const isE2E = !!win.__WONKY_TEST_INITIALIZE__ || !!win.__E2E_FORCE_VIEW__ || !!window.localStorage.getItem(win.__E2E_STORAGE_KEY__ || 'wonky-sprout-os-state');
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
              const view = win.__WONKY_TEST_INITIALIZE__?.view || win.appState?.view || document.documentElement.dataset.e2eView || 'unknown';
              const dashboard = win.__WONKY_TEST_INITIALIZE__?.dashboardType || win.appState?.dashboardType || 'unknown';
              el!.setAttribute('data-e2e-view', view);
              el!.setAttribute('data-e2e-dashboard', dashboard);
              el!.innerHTML = `<div><strong>E2E-VIEW:</strong> ${view}</div><div><strong>DASH:</strong> ${dashboard}</div>`;
            } catch { /* ignore */ }
          };
          updateOverlay();
          // Keep overlay updated briefly during early boot
          const int = setInterval(updateOverlay, 400);
          setTimeout(() => { clearInterval(int); updateOverlay(); }, 6000);
        }
      }
    } catch { /* ignore overlay errors */ }
  }
} catch (e) {
  // Don't block app boot on any accidental failures to parse URL
  logWarn('PREHYDRATE: failed', e);
}

// Install a tiny, early stub for the E2E view helper so tests can call it
// immediately after navigation, even before React mounts. The provider will
// later replace this stub with a fully functional version during E2E runs.
    try {
      if (typeof window !== 'undefined' && !win.__WONKY_TEST_FORCE_VIEW__) {
        try { if (win) win.__WONKY_TEST_FORCE_VIEW__ = (view: string) => { try { if (win) win.__E2E_FORCE_VIEW__ = view; } catch { /* ignore */ }; try { if (win) win.appState = { ...(win.appState || {}), view }; } catch { /* ignore */ }; logInfo('E2E STUB: __WONKY_TEST_FORCE_VIEW__ used to set', view); }; } catch { /* ignore */ }
      }
    } catch { /* ignore */ }

registerGlobalErrorHandlers();

// For E2E debugging, attach window-level listeners for errors and unhandled
// promise rejections so Playwright picks them up in the console logs.
try {
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (ev) => {
      try { console.error('UNHANDLED_ERROR:', ev.message, ev.error && ev.error.stack); } catch { /* ignore */ }
    });
    window.addEventListener('unhandledrejection', (ev) => {
      try { console.error('UNHANDLED_REJECTION:', ev.reason); } catch { /* ignore */ }
    });
    window.addEventListener('beforeunload', (ev) => {
      try { console.warn('PAGE_BEFORE_UNLOAD: Unloading page', ev); } catch { /* ignore */ }
      try { const win = window as any; if (win.__WONKY_TEST_BEHAVIOR__) win.__WONKY_TEST_BEHAVIOR__.lastEvent = 'beforeunload' } catch { /* ignore */ }
      try { const win = window as any; if (win.__WONKY_TEST_BEHAVIOR__) { try { window.localStorage.setItem('__WONKY_TEST_BEHAVIOR__', JSON.stringify(win.__WONKY_TEST_BEHAVIOR__)); } catch(e){ } } } catch(e) { /* ignore */ }
    });
    try { window.addEventListener('pagehide', (ev) => { const win = window as any; try { if (win.__WONKY_TEST_BEHAVIOR__) win.__WONKY_TEST_BEHAVIOR__.lastEvent = 'pagehide'; } catch{ } console.warn('PAGE_PAGEHIDE event', ev); }); } catch(e) { /* ignore */ }
      try { window.addEventListener('visibilitychange', (ev) => { const win = window as any; try { if (win.__WONKY_TEST_BEHAVIOR__) win.__WONKY_TEST_BEHAVIOR__.lastEvent = 'visibilitychange:' + document.visibilityState; } catch(e) { /* ignore */ }; console.warn('PAGE_VISIBILITY_CHANGE', document.visibilityState); }); } catch (e) { /* ignore */ }
    try { window.addEventListener('unload', (ev) => { const win = window as any; try { if (win.__WONKY_TEST_BEHAVIOR__) win.__WONKY_TEST_BEHAVIOR__.lastEvent = 'unload'; } catch{ } console.warn('PAGE_UNLOAD event', ev); }); } catch(e) { /* ignore */ }
  }
} catch { /* ignore */ }

// E2E guard: in test mode, ensure the page can't be closed or redirected by app code.
try {
  if (typeof window !== 'undefined' && (window as any).__WONKY_TEST_INITIALIZE__) {
    const win = window as any;
    try { if (!win.__WONKY_TEST_BEHAVIOR__) win.__WONKY_TEST_BEHAVIOR__ = { closeCalled: false, openedUrls: [], attemptedNavigations: [] }; } catch { /* ignore */ }
    try {
      const origClose = win.close;
      win.close = function() { try { win.__WONKY_TEST_BEHAVIOR__.closeCalled = true; console.warn('E2E: prevented window.close()'); } catch (e) { /* ignore */ }; return undefined; };
    } catch (e) { /* ignore */ }
    try {
      const origOpen = win.open;
      win.open = function(url?: string, name?: string, features?: string) { try { win.__WONKY_TEST_BEHAVIOR__.openedUrls.push({ url, name, features }); console.warn('E2E: prevented window.open()', url); } catch(e) { /* ignore */ }; return { url, name, features } as any; };
    } catch (e) { /* ignore */ }
    try {
      const origAssign = (win.location && win.location.assign) ? win.location.assign : undefined;
      if (origAssign) {
        try { win.location.assign = function(url: string) { try { win.__WONKY_TEST_BEHAVIOR__.attemptedNavigations.push(url); console.warn('E2E: prevented location.assign', url); } catch(e){}; } } catch(e) { /* ignore */ }
      }
      const origReplace = (win.location && win.location.replace) ? win.location.replace : undefined;
      if (origReplace) {
        try { win.location.replace = function(url: string) { try { win.__WONKY_TEST_BEHAVIOR__.attemptedNavigations.push(url); console.warn('E2E: prevented location.replace', url); } catch(e){}; } } catch(e) { /* ignore */ }
      }
      // Attempt to intercept direct href assignment (best effort)
      try {
        const loc = win.location as Location & { __setter__?: any };
        const originalHrefDescriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(window.location), 'href');
        if (originalHrefDescriptor && originalHrefDescriptor.set) {
          Object.defineProperty(loc, 'href', {
            set(h: string) {
              try { win.__WONKY_TEST_BEHAVIOR__.attemptedNavigations.push(h); console.warn('E2E: prevented location.href assignment', h); } catch (e) { /* ignore */ }
            },
            get() { return window.location.href; },
            configurable: true,
            enumerable: true,
          });
        }
      } catch (e) { /* ignore */ }
    } catch (e) { /* ignore */ }
    // Attempt to override location.replace/href assign to prevent redirecting during E2E.
    try {
      if (win.location) {
        try { if (win.location.replace) { const orig = win.location.replace; (win.location as any).replace = function(url: string) { try { win.__WONKY_TEST_BEHAVIOR__.attemptedNavigations.push(url); console.warn('E2E: prevented location.replace', url); } catch(e){}; }; } } catch (e) { /* ignore replacement */ }
        try { const proto = Object.getPrototypeOf(win.location); if (proto && Object.getOwnPropertyDescriptor(proto, 'href')?.set) {
          const origHrefSetter = Object.getOwnPropertyDescriptor(proto, 'href')!.set!;
          Object.defineProperty(proto, 'href', { set: function(url: string) { try { win.__WONKY_TEST_BEHAVIOR__.attemptedNavigations.push(url); console.warn('E2E: prevented setting location.href', url); } catch(e){}; }, configurable: true });
        } }
        catch(e) { /* ignore if not allowed */ }
      }
    } catch(e) { /* ignore */ }
    // Add message listener to detect whether an iframe/script is requesting a close
    try {
      window.addEventListener('message', (ev) => {
        try {
          const win = window as any;
          if (!win.__WONKY_TEST_BEHAVIOR__) return;
          if (ev?.data === 'CLOSE') { win.__WONKY_TEST_BEHAVIOR__.closeCalled = true; win.__WONKY_TEST_BEHAVIOR__.closeMessage = ev; console.warn('E2E: intercepted CLOSE message', ev); }
          if (ev?.data === 'NAVIGATE') { win.__WONKY_TEST_BEHAVIOR__.attemptedNavigations.push(JSON.stringify(ev)); console.warn('E2E: intercepted NAVIGATE message', ev); }
        } catch (err) { /* ignore */ }
      });
    } catch (err) { /* ignore */ }
      // Persist the behavior object to localStorage every few seconds to capture
      // any close/navigation attempts even if the page unloads immediately.
      try {
        const win = window as any;
        const interval = setInterval(() => {
          try {
            if (win.__WONKY_TEST_BEHAVIOR__) {
              try { window.localStorage.setItem('__WONKY_TEST_BEHAVIOR__', JSON.stringify(win.__WONKY_TEST_BEHAVIOR__)); } catch (e) { /* ignore */ }
            }
          } catch (e) { /* ignore */ }
        }, 500);
        setTimeout(() => clearInterval(interval), 120000);
      } catch (e) { /* ignore */ }
  }
} catch (e) { /* ignore */ }

const root = ReactDOM.createRoot(rootElement);
// Install global error handlers as early as possible to capture runtime
// errors that happen before React mounts.
// already registered above
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);