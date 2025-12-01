import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

// Mock @services/firebaseLazy so dynamic imports resolve in unit tests
vi.mock('@services/firebaseLazy', async () => {
  return {
    onAuthChanged: async (cb: (u: any) => void) => {
      // Simulate no user signed in and return no-op unsub
      setTimeout(() => cb(null), 0);
      return () => {};
    },
    init: async () => ({})
  };
});
import { AppStateProvider, useAppState } from '@contexts/AppStateContext';

function SnapshotConsumer() {
  const state = useAppState();
  // Render something that depends on the provider state to ensure it mounts
  return <div data-testid="app-view">{String(state?.view || 'no-view')}</div>;
}

describe('AppStateProvider resilience', () => {
  beforeEach(() => {
    // Simulate invalid storage value written as the literal string 'undefined'
    localStorage.setItem('wonky-sprout-os-state', 'undefined');
  });
  afterEach(() => {
    localStorage.removeItem('wonky-sprout-os-state');
  });

  it('mounts without throwing and provides default state', () => {
    render(
      <AppStateProvider>
        <SnapshotConsumer />
      </AppStateProvider>
    );
    const el = screen.getByTestId('app-view');
    expect(el).toBeInTheDocument();
    // The default provider should render some fallback view name that is not 'undefined'
    expect(el.textContent).not.toBe('undefined');
  });
});
