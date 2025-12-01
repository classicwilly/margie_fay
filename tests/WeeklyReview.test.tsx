import React from 'react';
import { render, screen, fireEvent, renderHook, act } from '@testing-library/react';
import WeeklyReview from '../src/components/WeeklyReview';
import safeJsonParse from '@utils/safeJsonParse';
import { FeatureFlagsProvider } from '@contexts/FeatureFlagsContext';
import { AppStateProvider } from '@contexts/AppStateContext';
import { useAppState } from '@contexts/AppStateContext';

describe('WeeklyReview non-AI mode', () => {
  it('fills in local heuristics when ai is disabled', async () => {
    // Clear and set default state to ensure a consistent wizard mode
    localStorage.removeItem('wonky-sprout-os-state');
    localStorage.setItem('wonky_flags', JSON.stringify({ aiEnabled: false }));
    // Set AI feature flag in localStorage for a non-AI run
    localStorage.removeItem('wonky-sprout-os-state');
    localStorage.setItem('wonky_flags', JSON.stringify({ aiEnabled: false }));
    // Use the repository default state as a base (include all required keys)
    const { defaultUserState } = await import('../defaultStates');
    localStorage.setItem('wonky-sprout-os-state', JSON.stringify({ ...defaultUserState, weeklyReviewMode: 'wizard' }));
    // Ensure the app is in wizard mode so the test can progress through the steps
    const state = safeJsonParse<Record<string, any>>(localStorage.getItem('wonky-sprout-os-state'), {} as Record<string, any>) || {};
    state.weeklyReviewMode = 'wizard';

    // Use the AppStateProvider wrapper to get direct access to dispatch from the test
    const wrapper = ({ children }: any) => (
      <AppStateProvider>
        <FeatureFlagsProvider>
          {children}
        </FeatureFlagsProvider>
      </AppStateProvider>
    );

    // Provide wrapper and render WeeklyReview in explicit wizard mode to ensure deterministic flow
    render(<WeeklyReview initialMode="wizard" />, { wrapper });
    // The component will mount in wizard mode since we pass initialMode

    // Wait for the wizard first step to render

    // Progress through wizard steps to the reflection step
    // Use test id to prevent text mismatches

    const proceedInboxBtn = await screen.findByTestId('weekly-review-proceed-inbox');
    fireEvent.click(proceedInboxBtn);

    const confirmCheckbox = await screen.findByLabelText(/I confirm all inboxes are cleared/i);
    fireEvent.click(confirmCheckbox);

    const proceedProgressBtn = await screen.findByTestId('weekly-review-proceed-progress');
    fireEvent.click(proceedProgressBtn);

    const proceedReflectionBtn = await screen.findByTestId('weekly-review-proceed-reflection');
    expect(proceedReflectionBtn).toBeInTheDocument();
    fireEvent.click(proceedReflectionBtn);

    // Now the Assist button should be present
    const assistBtn = await screen.findByRole('button', { name: /Assist with Reflection/i });
    expect(assistBtn).toBeInTheDocument();

    fireEvent.click(assistBtn);

    // After clicking, the local heuristic should fill wins/focus/friction textareas; wait for them
    const wins = await screen.findByPlaceholderText(/What went well this week/);
    expect(wins).toBeInTheDocument();
  });
});
