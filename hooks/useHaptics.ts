import { useCallback } from 'react';

/**
 * Hook for haptic feedback using navigator.vibrate API
 * Includes E2E stubbing for deterministic testing
 */
export const useHaptics = () => {
  const vibrate = useCallback((pattern: number | number[] = 200) => {
    // E2E stub check - allows tests to control vibration behavior
    if (typeof window !== 'undefined' && (window as any).__E2E_HAPTICS_STUB__) {
      // In E2E tests, vibration is stubbed - log for test verification
      console.log('Haptics: vibrate called with pattern:', pattern);
      return true;
    }

    // Check if vibration is supported
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        return navigator.vibrate(pattern);
      } catch (error) {
        console.warn('Haptics: vibration failed:', error);
        return false;
      }
    }

    // Fallback: vibration not supported
    console.log('Haptics: vibration not supported, falling back silently');
    return false;
  }, []);

  return { vibrate };
};