import React from "react";
import { useAppState } from "@contexts/AppStateContext";

// Small test-only component that exposes the current active view on the page
// to Playwright as a deterministic DOM hook for neurodivergent-friendly test flows.
// - Renders only when E2E flags are present
// - Exposes `data-testid="e2e-runtime-view"` with the current view name
// - Also writes to window.__WONKY_E2E_LOG__ for diagnostics
const E2EDebugView = () => {
  let appStateVal: any;
  try {
    const ctx = useAppState();
    appStateVal = ctx?.appState;
  } catch (e) {
    // If provider isn't ready yet, fallback to the global window.appState
    // so Playwright can still read the effective seeded view early.
    // This ensures the debug chip renders even before React's provider
    // has fully initialised in rare race conditions.
    // eslint-disable-next-line no-console
    console.debug("E2EDebugView: no provider, falling back to window.appState");
    appStateVal =
      typeof window !== "undefined" ? (window as any).appState : undefined;
  }

  if (typeof window === "undefined") {
    return null;
  }

  let isE2E = false;
  if (typeof window !== "undefined") {
    isE2E =
      !!(window as any).__WONKY_TEST_INITIALIZE__ ||
      !!(window as any).__E2E_FORCE_VIEW__ ||
      !!window.localStorage.getItem(
        (window as any).__E2E_STORAGE_KEY__ || "wonky-sprout-os-state",
      );
  }
  if (!isE2E) {
    return null;
  }

  const view =
    appStateVal?.view ||
    (typeof window !== "undefined"
      ? (window as any).__WONKY_TEST_INITIALIZE__?.view
      : "unknown") ||
    "unknown";
  const dashboard =
    appStateVal?.dashboardType ||
    (typeof window !== "undefined"
      ? (window as any).__WONKY_TEST_INITIALIZE__?.dashboardType
      : "unknown") ||
    "unknown";
  try {
    if ((window as any).__WONKY_E2E_LOG_PUSH__) {
      (window as any).__WONKY_E2E_LOG_PUSH__("E2E_DEBUG_VIEW_RENDER", { view });
    }
  } catch (e) {
    /* ignore */
  }

  // Render a small accessible element with a testid so Playwright can confirm
  // the current view without depending on the header. This reduces flakiness
  // and is beneficial for neurodivergent users who prefer deterministic UI.
  return (
    <div
      data-testid="e2e-runtime-view"
      data-e2e-view={view}
      data-e2e-dashboard={dashboard}
      aria-live="polite"
      className="e2e-debug"
    >
      <div>
        <strong>E2E-VIEW:</strong> {view}
      </div>
      <div>
        <strong>DASH:</strong> {dashboard}
      </div>
      <div className="e2e-meta">
        <small>
          {typeof window !== "undefined"
            ? `sticky:${!!(window as any).__WONKY_TEST_STICKY_VIEW__} allowDB:${(window as any).__WONKY_TEST_CAN_UPDATE_DB__ ? (window as any).__WONKY_TEST_CAN_UPDATE_DB__() : "n/a"}`
            : ""}
        </small>
      </div>
    </div>
  );
};

export { E2EDebugView };
export default E2EDebugView;
