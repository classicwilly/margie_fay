import type { AppState, AppContextType } from '../../src/contexts/types';
import { defaultUserState } from '../../defaultStates';
import { vi } from 'vitest';

export function createTestAppState(overrides?: Partial<AppState>): AppState {
  return { ...defaultUserState, ...(overrides || {}) } as AppState;
}

export function createTestAppContext(overrides?: Partial<AppContextType>): AppContextType {
  const appState = createTestAppState(overrides?.appState || undefined);
  const dispatch = vi.fn();
  return { authUser: undefined, appState, dispatch, isTestMode: true, ...(overrides || {}) } as AppContextType;
}
