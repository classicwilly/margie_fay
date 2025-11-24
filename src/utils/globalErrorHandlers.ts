// Global error capture utility - clean single copy
export default function registerGlobalErrorHandlers(): void {
  // No-op placeholder for non-browser environments
  if (typeof window === "undefined") {
    return;
  }
  // Single global marker prevents multiple registrations
  if ((window as any).__WONKY_GLOBAL_ERROR_HANDLERS__) {
    return;
  }
  (window as any).__WONKY_GLOBAL_ERROR_HANDLERS__ = true;

  const saveError = (message: string, stack?: string) => {
    try {
      const payload = JSON.stringify({
        message,
        stack,
        ts: new Date().toISOString(),
      });
      window.localStorage.setItem("wonky-last-error", payload);
    } catch (_) {
      // ignore
    }
  };

  window.onerror = (
    message: any,
    source?: string,
    lineno?: number,
    colno?: number,
    err?: any,
  ) => {
    console.error("GLOBAL_ONERROR", message, {
      source,
      lineno,
      colno,
      stack: err?.stack,
    });
    saveError(String(message), err?.stack);
  };

  window.onunhandledrejection = (evt: any) => {
    console.error("GLOBAL_UNHANDLEDREJECTION", evt?.reason);
    const reason = evt?.reason;
    saveError(reason?.message || String(reason), reason?.stack);
  };

  const origConsoleError = console.error.bind(console);
  console.error = (...args: any[]) => {
    try {
      const msg = args.map((a) => (a && a.stack) || String(a)).join(" ");
      saveError(msg, (args[0] && args[0].stack) || undefined);
    } catch (_) {
      // ignore
    }
    origConsoleError(...args);
  };
}

export { registerGlobalErrorHandlers };
