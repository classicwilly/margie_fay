import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeAll, vi } from 'vitest';
import SettingsView from '../src/views/SettingsView';
import { AppStateProvider } from '@contexts/AppStateContext';

describe('SettingsView persona overrides', () => {
  beforeAll(() => {
    // Prevent window.alert side effects in tests
    vi.stubGlobal('alert', vi.fn());
  });
  it('allows the user to enter a custom display name and saves it to app state', async () => {
    render(
      <AppStateProvider>
        <SettingsView />
      </AppStateProvider>
    );

    const grandmaInput = screen.getByTestId('persona-override-Grandma');
    fireEvent.change(grandmaInput, { target: { value: 'The Guardian' } });

    const saveBtn = screen.getByTestId('save-persona-overrides');
    fireEvent.click(saveBtn);


    // Wait for the AppState to re-render and show the updated display name
    await waitFor(() => expect(screen.getByText('The Guardian')).toBeInTheDocument());
  });
});
