// Simple telemetry backend adapter. This file attempts to initialize optional backends
// via environment variables and falls back to console logging for local testing.
let backend: 'console' | 'sentry' = 'console';
let sentry: any = null;

export function initTelemetry(opts?: { backend?: 'sentry' | 'console'; sentryDsn?: string }) {
  const chosen = opts?.backend ?? process.env.TELEMETRY_BACKEND;
  backend = chosen === 'sentry' ? 'sentry' : 'console';
  if (backend === 'sentry') {
    try {
      // dynamic import to avoid required dependency in dev/local
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      // Browser Sentry for client-side
      sentry = require('@sentry/browser');
      sentry.init({ dsn: opts?.sentryDsn ?? process.env.SENTRY_DSN, tracesSampleRate: 0.1 });
    } catch (err) {
      console.warn('Sentry not available, falling back to console telemetry.');
      backend = 'console';
      sentry = null;
    }
  }
}

export function trackEvent(name: string, payload: Record<string, any> = {}) {
  try {
    if (backend === 'sentry' && sentry) {
      // Attach as a breadcrumb so it shows up in Sentry
      sentry.addBreadcrumb({ category: 'ai', message: name, data: payload });
      // Optionally capture a message as an event
      sentry.captureMessage(`[Telemetry] ${name}`);
    } else {
      console.debug('[Telemetry]', name, payload);
    }
  } catch (e) {
    // don't blow up the app
  }
}

export default { initTelemetry, trackEvent };
