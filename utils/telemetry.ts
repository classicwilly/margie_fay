import telemetryBackend from './telemetryBackend';
import type { TelemetryPayload as TelemetryPayloadType } from '../src/types/telemetry';
import { logWarn } from './logger';

export type TelemetryPayload = TelemetryPayloadType;
export function logTelemetry(event: string, payload: TelemetryPayload = {}) {
  // Bridge into telemetryBackend which can be extended for Sentry/Datadog.
  try {
    telemetryBackend.trackEvent(event, payload);
  } catch (err) {
    logWarn('telemetry error', err);
  }
}

export default logTelemetry;
