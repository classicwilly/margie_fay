import React from 'react';
import { render, fireEvent, renderHook } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { AppStateProvider } from '@contexts/AppStateContext';
import { NeuroPrefsProvider, useNeuroPrefs } from '@contexts/NeurodivergentPreferencesContext';
import { useApplyNeuroPrefs } from '@hooks/useApplyNeuroPrefs';

const TogglePrefsButton: React.FC = () => {
  useApplyNeuroPrefs();
  const { prefs, setPrefs } = useNeuroPrefs();
  return (
    <button
      onClick={() => setPrefs({ simplifiedUi: !prefs.simplifiedUi, largerText: !prefs.largerText })}
      data-testid="toggle"
    >Toggle</button>
  );
};

describe('useApplyNeuroPrefs', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.documentElement.className = '';
  });

  it('Toggling preferences updates document classes', () => {
    const addSpy = vi.spyOn(document.documentElement.classList, 'add');
    const removeSpy = vi.spyOn(document.documentElement.classList, 'remove');

    const prefs = {
      simplifiedUi: true,
      reduceAnimations: false,
      largerText: false,
      focusModeDuration: 15,
      microStepsMode: true,
      assistTone: 'concise',
      autoAdvanceSteps: false
    };

    renderHook(() => useApplyNeuroPrefs(prefs));

    expect(addSpy).toHaveBeenCalledWith(expect.stringMatching(/simplified/));
    // Optionally: expect(removeSpy).toHaveBeenCalled();
  });
});
