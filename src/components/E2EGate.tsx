import React, { useEffect, useState } from 'react';
import win from '../../utils/win';
type E2EWin = Window & {
  __WONKY_TEST_INITIALIZE__?: { view?: string };
  __WONKY_TEST_STICKY_VIEW__?: string;
  __WONKY_TEST_READY__?: boolean;
  __WONKY_TEST_RELEASE_GATE__?: () => void;
  appState?: { view?: string } | undefined;
};

// E2E gating overlay to block user interactions until the test explicitly
// signals it is ready. This prevents header or route changes from other
// app flows from racing with seeded test state.
const E2EGate: React.FC = () => {
  const [isE2E, setIsE2E] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      // Consider tests present if we have an explicit init or sticky view
      const seeded = !!win?.__WONKY_TEST_INITIALIZE__ || !!win?.__WONKY_TEST_STICKY_VIEW__;
      setIsE2E(seeded);
      const initialReady = !!win?.__WONKY_TEST_READY__ || win?.appState?.view === 'game-master-dashboard';
      setIsReady(initialReady);

      const typedWin = win as unknown as E2EWin;
      const handle = () => setIsReady(!!typedWin?.__WONKY_TEST_READY__ || typedWin?.appState?.view === 'game-master-dashboard');
      // expose a global setter to allow tests to release the gate
      try { typedWin.__WONKY_TEST_RELEASE_GATE__ = () => { typedWin.__WONKY_TEST_READY__ = true; handle(); }; } catch { /* ignore */ }

      // Listen to a global property change via polling - cheap and fine for E2E
      const interval = setInterval(() => handle(), 200);
      return () => clearInterval(interval);
    } catch {
      setIsE2E(false);
      setIsReady(true);
    }
  }, []);

  // Don't render anything outside E2E runs or if the test has already released the gate
  if (!isE2E || isReady) return null;

  return (
    <div data-testid="e2e-gate" className="fixed inset-0 z-[9999] bg-black/5 pointer-events-auto flex items-center justify-center">
      <div className="bg-black/60 text-white p-3 rounded-md">
        <strong>E2E initialization gate</strong>
        <div className="opacity-90 mt-2">
          Tests are preparing the seeded state — waiting for <code>__WONKY_TEST_READY__</code>
        </div>
      </div>
    </div>
  );
};

export { E2EGate };
export default E2EGate;
