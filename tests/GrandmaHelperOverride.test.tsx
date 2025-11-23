import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeAll, vi } from 'vitest';
import SettingsView from '../src/views/SettingsView';
import GrandmaHelper from '../components/GrandmaHelper';
import { AppStateProvider } from '@contexts/AppStateContext';

describe('GrandmaHelper uses display name override', () => {
  beforeAll(() => {
    vi.stubGlobal('alert', vi.fn());
  });
  it('shows the overridden persona name in the header', async () => {
    render(
      <AppStateProvider>
        <SettingsView />
        <GrandmaHelper />
      </AppStateProvider>
    );

    // Update override
    const grandmaInput = screen.getByTestId('persona-override-Grandma');
    fireEvent.change(grandmaInput, { target: { value: 'The Guardian' } });
    const saveBtn = screen.getByTestId('save-persona-overrides');
    fireEvent.click(saveBtn);

    // The GrandmaHelper header should update to use the override 'The Guardian'
    await waitFor(() => expect(screen.getByText(/ASK THE GUARDIAN/i)).toBeInTheDocument());
  });
});
