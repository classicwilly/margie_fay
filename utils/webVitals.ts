import { getCLS, getFID, getLCP } from "web-vitals";
import { trackEvent } from "./telemetryBackend";

export function initWebVitals() {
  if (typeof window === "undefined") {
    return;
  }

  const sendToTelemetry = (name: string) => (metric: any) => {
    try {
      trackEvent(`vital_${name}`, {
        value: metric.value,
        id: metric.id,
        delta: metric.delta,
      });
    } catch (e) {}
  };

  getCLS(sendToTelemetry("cls"));
  getFID(sendToTelemetry("fid"));
  getLCP(sendToTelemetry("lcp"));
}
