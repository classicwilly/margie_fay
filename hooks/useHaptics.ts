import { useCallback } from 'react';
import win from '../utils/win';
import { logDebug, logWarn } from '../src/utils/logger';

/**
 * Hook for haptic feedback using navigator.vibrate API
 * Includes E2E stubbing for deterministic testing
 */
export const useHaptics = () => {
  const vibrate = useCallback((pattern: number | number[] = 200) => {
    // E2E stub check - allows tests to control vibration behavior
    if (win?.__E2E_HAPTICS_STUB__) {
      // In E2E tests, vibration is stubbed — log for test verification.
      // Also attempt to call navigator.vibrate if it's present and stubbed
      logDebug('Haptics: vibrate called with pattern:', pattern);
      try {
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          return navigator.vibrate(pattern);
        }
      } catch { logWarn('Haptics: vibration failed:', /* error? */); /* ignore */ }
      return true;
    }

    // Check if vibration is supported
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        return navigator.vibrate(pattern);
      } catch (e) { logWarn('Haptics: vibration failed:', e); return false; }
    }

    // Fallback: vibration not supported
  // Fallback for unsupported vibrate
  logDebug('Haptics: vibration not supported, falling back silently');
    return false;
  }, []);

  return { vibrate };
};