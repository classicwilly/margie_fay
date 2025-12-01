import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SopVault from '../../components/SopVault';
import * as AppStateContext from '../../src/contexts/AppStateContext';
import type { AppContextType, AppState } from '../../src/contexts/types';
import { createTestAppContext } from '../test-utils/appStateTestUtils';

describe('SopVault Component', () => {
  it('Importing neuro templates calls dispatch with ADD_SOP', async () => {
    const providerProps: { value: Partial<AppContextType> } = {
      value: {
        appState: {
          userSops: [],
          userSopTemplates: [],
          neuroPrefs: {},
          activeProfileStackId: 'default',
          // FIX: Add missing state objects to prevent runtime errors
          modifiedSops: {}, 
          snoozedTaskIds: [],
          tasks: []
        },
        dispatch: vi.fn()
      }
    } as { value: AppContextType };

    const ctx = createTestAppContext({ appState: providerProps.value.appState as AppState });
    ctx.dispatch = providerProps.value.dispatch as AppContextType['dispatch'];
    const useAppStateSpy = vi.spyOn(AppStateContext, 'useAppState').mockReturnValue(ctx as AppContextType);
    render(<SopVault />);

    // STEP 1: Open the Import Menu
    const mainImportBtn = screen.getByRole('button', { name: /Import/i });
    fireEvent.click(mainImportBtn);

    // STEP 2: Click the "Neurodivergent" Option
    // await findByText handles the async render of the dropdown
    const neuroOption = await screen.findByText(/Neurodivergent/i);
    fireEvent.click(neuroOption);

    // STEP 3: Verify Dispatch
    // We expect ADD_SOP because the reducer splits the import into individual adds
    await waitFor(() => {
      expect(providerProps.value.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'ADD_SOP' })
      );
    });
    useAppStateSpy.mockRestore();
  });
});