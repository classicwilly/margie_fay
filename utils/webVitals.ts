import { getCLS, getFID, getLCP } from 'web-vitals';
import type { Metric } from 'web-vitals';
import { trackEvent } from './telemetryBackend';
import { logWarn } from './logger';

export function initWebVitals() {
  if (typeof window === 'undefined') return;

  const sendToTelemetry = (name: string) => (metric: Metric) => {
    try {
      trackEvent(`vital_${name}`, {
        value: metric.value,
        id: metric.id,
        delta: metric.delta,
      });
    } catch (err) {
      logWarn('webVitals telemetry error', err);
    }
  };

  getCLS(sendToTelemetry('cls'));
  getFID(sendToTelemetry('fid'));
  getLCP(sendToTelemetry('lcp'));
}
