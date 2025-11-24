import telemetryBackend from "./telemetryBackend";

export function logTelemetry(event: string, payload: Record<string, any> = {}) {
  // Bridge into telemetryBackend which can be extended for Sentry/Datadog.
  try {
    telemetryBackend.trackEvent(event, payload);
  } catch (e) {
    // Non-fatal
  }
}

export default logTelemetry;
