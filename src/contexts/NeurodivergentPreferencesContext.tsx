import React, { createContext, useContext } from 'react';
import { useAppState } from '@contexts/AppStateContext';

export type NeuroPrefs = {
  simplifiedUi: boolean;
  reduceAnimations: boolean;
  largerText: boolean;
  focusModeDuration: number;
  microStepsMode: boolean;
  assistTone: 'concise' | 'helpful';
  autoAdvanceSteps: boolean;
};

const defaultPrefs: NeuroPrefs = {
  simplifiedUi: true,
  reduceAnimations: true,
  largerText: false,
  focusModeDuration: 15,
  microStepsMode: true,
  assistTone: 'concise',
  autoAdvanceSteps: false,
};

const NeuroPrefsContext = createContext<{
  prefs: NeuroPrefs;
  setPrefs: (p: Partial<NeuroPrefs>) => void;
}>({ prefs: defaultPrefs, setPrefs: () => {} });

export const NeuroPrefsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { appState, dispatch } = useAppState();

  const prefs = (appState?.neuroPrefs ?? defaultPrefs) as NeuroPrefs;

  const setPrefs = (p: Partial<NeuroPrefs>) => {
    dispatch({ type: 'SET_NEURO_PREFS', payload: p });
  };

  return (
    <NeuroPrefsContext.Provider value={{ prefs, setPrefs }}>
      {children}
    </NeuroPrefsContext.Provider>
  );
};

export const useNeuroPrefs = () => useContext(NeuroPrefsContext);

export default NeuroPrefsContext;
