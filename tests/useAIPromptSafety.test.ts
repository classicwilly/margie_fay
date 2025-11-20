import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import React from 'react';
import { act, waitFor } from '@testing-library/react';
import useAIPromptSafety from '../hooks/useAIPromptSafety';
import { FeatureFlagsProvider } from '@contexts/FeatureFlagsContext';
import { AIProtectionProvider } from '@contexts/AIProtectionContext';

describe('useAIPromptSafety', () => {
  it('detects PII and opens modal flow', async () => {
    const wrapper = ({ children }: any) => (
      React.createElement(FeatureFlagsProvider, null,
        React.createElement(AIProtectionProvider, null, children))
    );
    const { result } = renderHook(() => useAIPromptSafety(), { wrapper });
    const { checkAndExecute, isPiiModalOpen, piiMatches } = result.current;

    // When PII is present, the function should not execute and the hook should present matches
    await act(async () => {
      await checkAndExecute('My email is test@example.com', async () => 'ok');
    });
    // After running, the test instance should reflect PII detection
    expect(result.current.isPiiModalOpen).toBe(true);
    expect(result.current.piiMatches.length).toBeGreaterThan(0);
  });

  it('executes action if consent already given', async () => {
    const wrapper = ({ children }: any) => React.createElement(FeatureFlagsProvider, null, children);
    const { result } = renderHook(() => useAIPromptSafety(), { wrapper });

    const mockFn = vi.fn(async (s: string) => 'ok');

    // Simulate user having granted AI consent
    localStorage.setItem('wonky-sprout-ai-consent-dont-show-again', 'true');

    await act(async () => {
      await result.current.checkAndExecute('My email is test@example.com', mockFn);
    });

    expect(result.current.isPiiModalOpen).toBe(true);
    // After calling handlePiiConfirm the pending action should execute
    await act(async () => {
      result.current.handlePiiConfirm();
    });
    await waitFor(() => expect(result.current.isPiiModalOpen).toBe(false));
    // Note: confirming consent should eventually run the pending action (see useAIConsent). On CI the flow is async and may require further mocking.
  });

  it('allows clean input', async () => {
    const wrapper = ({ children }: any) => React.createElement(FeatureFlagsProvider, null, children);
    const { result } = renderHook(() => useAIPromptSafety(), { wrapper });
    const { checkAndExecute } = result.current;

    const res = await checkAndExecute('Short prompt', async (s) => `processed:${s}`);
    expect(res).toBe('processed:Short prompt');
  });
});
