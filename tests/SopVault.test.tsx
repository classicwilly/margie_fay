import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SopVault from '@components/SopVault';
import * as AppStateContext from '@contexts/AppStateContext';
import type { AppContextType } from '../../src/contexts/types';
import { createTestAppContext } from './test-utils/appStateTestUtils';

describe('SopVault Component', () => {
  it('Importing neuro templates calls dispatch', async () => {
    const dispatchMock = vi.fn();
    // Mock useAppState to return our provider shape with mocked dispatch
    const ctx = createTestAppContext({ appState: { userSops: [], userSopTemplates: [] } as any });
    ctx.dispatch = dispatchMock;
    const useAppStateSpy = vi.spyOn(AppStateContext, 'useAppState').mockReturnValue(ctx as AppContextType);
    render(<SopVault />);

    // Find the import button by role and accessible name
    const importBtn = screen.getByRole('button', { name: /Import/i });
    fireEvent.click(importBtn);

    // Find the neuro template option
    const neuroOption = await screen.findByText(/Neurodivergent/i);
    fireEvent.click(neuroOption);

    // Wait for dispatch to be called
    await waitFor(() => {
      expect(dispatchMock).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'ADD_SOP' })
      );
    });
    useAppStateSpy.mockRestore();
  });
});
