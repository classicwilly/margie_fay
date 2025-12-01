declare module 'marked';
declare module '../types/telemetry' {
  export interface TelemetryPayload {
    event: string;
    data?: Record<string, unknown>;
  }
}