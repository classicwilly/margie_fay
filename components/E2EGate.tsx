import React, { useEffect, useState } from "react";

// E2E gating overlay to block user interactions until the test explicitly
// signals it is ready. This prevents header or route changes from other
// app flows from racing with seeded test state.
export const E2EGate: React.FC = () => {
  const [isE2E, setIsE2E] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const seeded =
        !!(window as any).__WONKY_TEST_INITIALIZE__ ||
        !!(window as any).__WONKY_TEST_STICKY_VIEW__;
      setIsE2E(seeded);
      const initialReady =
        !!(window as any).__WONKY_TEST_READY__ ||
        (window as any).appState?.view === "game-master-dashboard";
      setIsReady(initialReady);

      const handle = () =>
        setIsReady(
          !!(window as any).__WONKY_TEST_READY__ ||
            (window as any).appState?.view === "game-master-dashboard",
        );
      try {
        (window as any).__WONKY_TEST_RELEASE_GATE__ = () => {
          (window as any).__WONKY_TEST_READY__ = true;
          handle();
        };
      } catch (e) {
        /* ignore */
      }
      const interval = setInterval(() => handle(), 200);
      return () => clearInterval(interval);
    } catch (e) {
      setIsE2E(false);
      setIsReady(true);
    }
  }, []);

  if (!isE2E || isReady) {
    return null;
  }

  return (
    <div
      data-testid="e2e-gate"
      className="fixed inset-0 z-[9999] bg-black/5 pointer-events-auto flex items-center justify-center"
    >
      <div className="bg-black/60 text-white p-3 rounded-md">
        <strong>E2E initialization gate</strong>
        <div className="opacity-90 mt-2">
          Tests are preparing the seeded state — waiting for{" "}
          <code>__WONKY_TEST_READY__</code>
        </div>
      </div>
    </div>
  );
};

export default E2EGate;
