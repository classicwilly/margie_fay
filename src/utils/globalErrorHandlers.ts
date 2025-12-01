/* eslint-disable no-console */
// Global error capture utility. Registers handlers early in app startup
import { logError } from './logger';
// to capture errors that happen before React error boundaries can catch them.
function registerGlobalErrorHandlers(): void {
  if (typeof window === 'undefined') return;

  // Avoid registering multiple times using a typed window augmentation
  const win = window as Window & { __WONKY_GLOBAL_ERROR_HANDLERS__?: boolean };
  if (win.__WONKY_GLOBAL_ERROR_HANDLERS__) return;
  win.__WONKY_GLOBAL_ERROR_HANDLERS__ = true;

  // Save errors to localStorage for E2E capture
  const saveError = (message: string, stack?: string) => {
    if (typeof window !== 'undefined') {
      try {
        const payload = JSON.stringify({ message, stack, ts: new Date().toISOString() });
        window.localStorage.setItem('wonky-last-error', payload);
      } catch {
        // ignore
      }
    }
  };

  window.onerror = function (message: unknown, source?: string, lineno?: number, colno?: number, error?: Error) {
    logError('GLOBAL_ONERROR', message, { source, lineno, colno, stack: error?.stack });
    saveError(String(message), error?.stack);
  };

  // Catch unhandled promise rejections
  window.onunhandledrejection = function (event: PromiseRejectionEvent) {
    // Try to extract a readable message/stack from the rejection reason
    const reason: unknown = event.reason;
    const reasonInfo = (() => {
      if (typeof reason === 'object' && reason !== null) {
        const obj = reason as Record<string, unknown>;
        const message = typeof obj['message'] === 'string' ? (obj['message'] as string) : String(reason);
        const stack = typeof obj['stack'] === 'string' ? (obj['stack'] as string) : undefined;
        return { message, stack };
      }
      return { message: String(reason), stack: undefined };
    })();
    logError('GLOBAL_UNHANDLEDREJECTION', reasonInfo.message);
    saveError(reasonInfo.message, reasonInfo.stack);
  };

  // Hook console.error to also write the last-known error for E2E
  const origConsoleError: (...args: unknown[]) => void = console.error.bind(console) as (...args: unknown[]) => void;
  console.error = (...args: unknown[]) => {
    try {
      const msg = args
        .map(a => {
          if (typeof a === 'object' && a !== null) {
            const obj = a as Record<string, unknown>;
            return (typeof obj.stack === 'string' ? obj.stack : String(a));
          }
          return String(a);
        })
        .join(' ');
      const firstArgStack = (typeof args[0] === 'object' && args[0] !== null) ? (args[0] as Record<string, unknown>)['stack'] as string | undefined : undefined;
      saveError(msg, firstArgStack);
    } catch {
      // ignore
    }
    origConsoleError(...args);
  };
}

export default registerGlobalErrorHandlers;
export { registerGlobalErrorHandlers };
