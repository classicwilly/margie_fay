// Simple telemetry backend adapter. This file attempts to initialize optional backends
// via environment variables and falls back to console logging for local testing.
import type { TelemetryPayload } from '../src/types/telemetry';
import { logDebug, logWarn } from './logger';

type SentryLike = {
  addBreadcrumb?: (arg: { category?: string; message?: string; data?: Record<string, unknown> }) => void;
  captureMessage?: (m: string) => void;
  init?: (opts?: unknown) => void;
};
let backend: 'console' | 'sentry' = 'console';
let sentry: SentryLike | null = null;

export function initTelemetry(opts?: { backend?: 'sentry' | 'console'; sentryDsn?: string }) {
  const chosen = opts?.backend ?? (process.env as Record<string, string> | undefined)?.TELEMETRY_BACKEND;
  backend = chosen === 'sentry' ? 'sentry' : 'console';
  if (backend === 'sentry') {
    // dynamic import to avoid required dependency in dev/local. Import returns a promise
    import('@sentry/browser')
      .then(mod => {
        const modAny = mod as unknown as { default?: unknown } & Record<string, unknown>;
        sentry = (modAny.default ?? mod) as SentryLike;
        sentry.init?.({ dsn: opts?.sentryDsn ?? (process.env as Record<string, string> | undefined)?.SENTRY_DSN, tracesSampleRate: 0.1 });
      })
      .catch(() => {
        logWarn('Sentry not available, falling back to console telemetry.');
        backend = 'console';
        sentry = null;
      });
  }
}

export function trackEvent(name: string, payload: TelemetryPayload = {}) {
  try {
    if (backend === 'sentry' && sentry) {
      // Attach as a breadcrumb so it shows up in Sentry
      sentry.addBreadcrumb?.({ category: 'ai', message: name, data: payload });
      // Optionally capture a message as an event
      sentry.captureMessage?.(`[Telemetry] ${name}`);
    } else {
      logDebug('[Telemetry] ' + name, payload as unknown as Record<string, unknown>);
    }
  } catch (err) {
    logWarn('Telemetry trackEvent failed', err);
  }
}

export default { initTelemetry, trackEvent };
