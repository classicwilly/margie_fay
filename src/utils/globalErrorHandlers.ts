// Global error capture utility. Registers handlers early in app startup
// to capture errors that happen before React error boundaries can catch them.
function registerGlobalErrorHandlers() {
  if (typeof window === 'undefined') return;

  // Avoid registering multiple times
  if ((window as any).__WONKY_GLOBAL_ERROR_HANDLERS__) return;
  (window as any).__WONKY_GLOBAL_ERROR_HANDLERS__ = true;

  // Save errors to localStorage for E2E capture
  const saveError = (message: string, stack: string | undefined) => {
    if (typeof window !== 'undefined') {
      try {
        const payload = JSON.stringify({ message, stack, ts: new Date().toISOString() });
        window.localStorage.setItem('wonky-last-error', payload);
      } catch (e) {
        // ignore
      }
    }
  };

  if (typeof window !== 'undefined') {
    window.onerror = function (message, source, lineno, colno, error) {
      // eslint-disable-next-line no-console
      console.error('GLOBAL_ONERROR', message, { source, lineno, colno, stack: error?.stack });
      saveError(String(message), error?.stack);
    };

    // Catch unhandled promise rejections
    window.onunhandledrejection = function (event: any) {
      // eslint-disable-next-line no-console
      console.error('GLOBAL_UNHANDLEDREJECTION', event?.reason);
      const reason = event?.reason;
      saveError(reason?.message || String(reason), reason?.stack);
    };

    // Hook console.error to also write the last-known error for E2E
    const origConsoleError = console.error.bind(console);
    console.error = (...args: any[]) => {
      try {
        const msg = args.map(a => (a && a.stack) || String(a)).join(' ');
        saveError(msg, (args[0] && args[0].stack) || undefined);
      } catch (e) {
        origConsoleError(...args);
      }
      origConsoleError(...args);
    };
  }
      // ignore
    }
    origConsoleError(...args);
  };
}

export default registerGlobalErrorHandlers;
export { registerGlobalErrorHandlers };
  if (typeof window === 'undefined') return;

  // Avoid registering multiple times
  if ((window as any).__WONKY_GLOBAL_ERROR_HANDLERS__) return;
  (window as any).__WONKY_GLOBAL_ERROR_HANDLERS__ = true;

  // Save errors to localStorage for E2E capture
  const saveError = (message: string, stack: string | undefined) => {
    try {
      const payload = JSON.stringify({ message, stack, ts: new Date().toISOString() });
      window.localStorage.setItem('wonky-last-error', payload);
    } catch (e) {
      // ignore
    }
  };

  window.onerror = function (message, source, lineno, colno, error) {
    // eslint-disable-next-line no-console
    console.error('GLOBAL_ONERROR', message, { source, lineno, colno, stack: error?.stack });
    saveError(String(message), error?.stack);
  };

  // Catch unhandled promise rejections
  window.onunhandledrejection = function (event: any) {
    // eslint-disable-next-line no-console
    console.error('GLOBAL_UNHANDLEDREJECTION', event?.reason);
    const reason = event?.reason;
    saveError(reason?.message || String(reason), reason?.stack);
  };

  // Hook console.error to also write the last-known error for E2E
  const origConsoleError = console.error.bind(console);
  console.error = (...args: any[]) => {
    try {
      // Try to convert to a meaningful string for localStorage
      const msg = args.map(a => (a && a.stack) || String(a)).join(' ');
      saveError(msg, (args[0] && args[0].stack) || undefined);
    } catch (e) {
      // ignore
    }
    origConsoleError(...args);
  };
}
