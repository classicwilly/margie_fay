export function errorCaptureScript() {
  // This function will be serialized and run in page context.
  // It mirrors `registerGlobalErrorHandlers` but for test runner usage.
  if (typeof window === 'undefined') return;

  window.onerror = function (message, source, lineno, colno, error) {
    try {
      const payload = {
        message: String(message),
        source: String(source),
        lineno: Number(lineno),
        colno: Number(colno),
        stack: error?.stack || null,
        timestamp: new Date().toISOString(),
      };
      try { window.localStorage.setItem('wonky-last-error', JSON.stringify(payload)); } catch { /* ignore */ }
      console.error('WONKY_E2E_ERROR', payload);
    } catch { /* ignore */ }
  };

  window.onunhandledrejection = function (event) {
    try {
      const reason = event?.reason || event;
      const payload = {
        message: String(reason?.message || reason),
        stack: reason?.stack || null,
        timestamp: new Date().toISOString(),
      };
      try { window.localStorage.setItem('wonky-last-unhandledrejection', JSON.stringify(payload)); } catch { /* ignore */ }
      console.error('WONKY_E2E_UNHANDLED_REJECTION', payload);
    } catch { /* ignore */ }
  };
}

export default errorCaptureScript;
// Helper for Playwright tests to install global error handlers so we get stacks
// in Playwright logs and localStorage for triage by tests.
export async function installErrorCapture(page: any) {
  await page.addInitScript(() => {
    // Mirror the app's global error capture so it runs prior to app import
    (window as any).__PLAYWRIGHT_ERROR_CAPTURE__ = true;

    window.onerror = function (message, source, lineno, colno, error) {
      try {
        const s = (error && error.stack) || `${message} @ ${source}:${lineno}:${colno}`;
        try { window.localStorage.setItem('wonky-last-error', JSON.stringify({ message, stack: s, ts: new Date().toISOString() })); } catch { /* ignore */ }
      } catch { /* ignore */ }
      // Emit to Playwright console
      console.error('PW_WINDOW_ONERROR', message, source, lineno, colno, error && error.stack);
    };

    window.onunhandledrejection = function (event: any) {
      try {
        const s = event?.reason?.stack || String(event?.reason);
        try { window.localStorage.setItem('wonky-last-error', JSON.stringify({ message: String(event?.reason), stack: s, ts: new Date().toISOString() })); } catch { /* ignore */ }
      } catch { /* ignore */ }
      console.error('PW_UNHANDLEDREJECTION', event?.reason);
    };

    // Also intercept console.error to persist messages
    const origError = console.error.bind(console);
    console.error = (...args: any[]) => {
      try {
        const msg = args.map(a => (a && a.stack) || String(a)).join(' ');
        try { window.localStorage.setItem('wonky-last-error', JSON.stringify({ message: msg, stack: msg, ts: new Date().toISOString() })); } catch { /* ignore */ }
      } catch { /* ignore */ }
      origError(...args);
    };

  });
}
