import { createContext, useContext, type FC, type ReactNode } from "react";
import { useAppState } from "./AppStateContext";

export interface NeuroPrefs {
  simplifiedUi: boolean;
  reduceAnimations: boolean;
  largerText: boolean;
  focusModeDuration: number;
  microStepsMode: boolean;
  assistTone: "concise" | "helpful";
  autoAdvanceSteps: boolean;
}

const defaultPrefs: NeuroPrefs = {
  simplifiedUi: true,
  reduceAnimations: true,
  largerText: false,
  focusModeDuration: 15,
  microStepsMode: true,
  assistTone: "concise",
  autoAdvanceSteps: false,
};

const NeuroPrefsContext = createContext<{
  prefs: NeuroPrefs;
  setPrefs: (p: Partial<NeuroPrefs>) => void;
}>({ prefs: defaultPrefs, setPrefs: () => {} });

export const NeuroPrefsProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { appState, dispatch } = useAppState();

  const prefs = (appState?.neuroPrefs ?? defaultPrefs) as NeuroPrefs;

  const setPrefs = (p: Partial<NeuroPrefs>) => {
    dispatch({ type: "SET_NEURO_PREFS", payload: p });
  };

  return (
    <NeuroPrefsContext.Provider value={{ prefs, setPrefs }}>
      {children}
    </NeuroPrefsContext.Provider>
  );
};

export const useNeuroPrefs = () => useContext(NeuroPrefsContext);

export default NeuroPrefsContext;
