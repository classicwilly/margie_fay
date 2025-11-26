import React, { createContext, useContext, useReducer, ReactNode } from "react";

// --- TYPES ---
type PersonaKey =
  | "grandma"
  | "grandpa"
  | "bob"
  | "marge"
  | "random"
  | "calm_guide";
type FocusMode = "scout" | "laser" | "recovery" | "none";

interface ProfileStack {
  id: string;
  name: string;
  persona: string;
  createdAt: string;
  // Add other required fields...
}

interface NeuroPrefs {
  simplifiedUi: boolean;
  reduceAnimations: boolean;
  // Add other neuro-specific prefs
}

interface OscilloscopeState {
  // Canonical State Fields
  activePersona: PersonaKey;
  focusMode: FocusMode;
  isAirlockOpen: boolean;
  // Backwards compatibility alias for the former name 'Airlock' — used by tests
  // and older modules while we migrate to 'E-Stop'. This is intentionally
  // derived from the canonical 'isAirlockOpen' boolean and is not a separate
  // source of truth.
  isEStopOpen?: boolean;
  isSourMode: boolean;

  // Decoupled Data References
  profileStacks: ProfileStack[];
  neuroPrefs: NeuroPrefs;

  // Status Tracking
  completedTaskCount: number;
}

type Action =
  | { type: "SET_FOCUS_MODE"; payload: FocusMode }
  | { type: "SET_PERSONA"; payload: PersonaKey }
  | { type: "TOGGLE_AIRLOCK"; payload: boolean }
  | { type: "TOGGLE_ESTOP"; payload: boolean }
  | { type: "TOGGLE_SOUR_MODE" }
  | { type: "INCREMENT_TASK_COUNT" }
  | { type: "SET_STATE"; payload: Partial<OscilloscopeState> }; // Generic state setter

// --- PERSONA MAPPING (Yin/Yang Principle) ---
const PERSONA_MAP = {
  // YIN / Stability (The Katen Legacy)
  grandma: { key: "grandma", display: "Margie Fay Katen", role: "Homemaker" },
  grandpa: { key: "grandpa", display: "Robert Katen", role: "Mechanic" },
  // YANG / Kinetic Energy (The Bob & Marge Protocol)
  bob: { key: "bob", display: "Bob Haddock", role: "Kinetic Coach" },
  marge: { key: "marge", display: "Marge Watson", role: "Planner" },
  random: { key: "random", display: "Random Persona", role: "Surprise Me" },
  calm_guide: { key: "calm_guide", display: "Calm Guide", role: "Fallback" },
};

// --- INITIAL STATE ---
const initialState: OscilloscopeState = {
  activePersona: "grandma",
  focusMode: "none",
  isAirlockOpen: false,
  isSourMode: false,
  profileStacks: [
    {
      id: "racecar-1",
      name: "Race Car Flow",
      persona: "william",
      createdAt: new Date().toISOString(),
    },
  ] as ProfileStack[],
  neuroPrefs: { simplifiedUi: false, reduceAnimations: false },
  completedTaskCount: 0,
};

// --- REDUCER ---
const reducer = (
  state: OscilloscopeState,
  action: Action,
): OscilloscopeState => {
  switch (action.type) {
    case "SET_FOCUS_MODE":
      return { ...state, focusMode: action.payload };
    case "SET_PERSONA":
      return { ...state, activePersona: action.payload };
    case "TOGGLE_AIRLOCK":
      return { ...state, isAirlockOpen: action.payload };
    case "TOGGLE_ESTOP":
      // Maintain a single source-of-truth (isAirlockOpen), but offer the toggle
      // action for tests or newer UI that prefer the E-Stop naming.
      return { ...state, isAirlockOpen: action.payload };
    case "TOGGLE_SOUR_MODE":
      // CRITICAL CSS FIX: Use browser API to enforce global theme change
      document.body.classList.toggle("sour-mode", !state.isSourMode);
      return { ...state, isSourMode: !state.isSourMode };
    case "INCREMENT_TASK_COUNT":
      return { ...state, completedTaskCount: state.completedTaskCount + 1 };
    case "SET_STATE":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

// --- CONTEXT & HOOK ---
const OscilloscopeContext = createContext<
  | {
      state: OscilloscopeState;
      dispatch: React.Dispatch<Action>;
      getPersonaName: (key: PersonaKey | string) => string;
      getPersonaRole: (key: PersonaKey | string) => string; // Added utility
      // Convenience shortcuts for common UI code
      isAirlockActive: boolean;
      setAirlockActive: (open: boolean) => void;
      // E-Stop naming compatibility aliases
      isEStopActive: boolean;
      setEStopActive: (open: boolean) => void;
      isSourMode: boolean;
    }
  | undefined
>(undefined);

export const OscilloscopeProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Utility Function: getPersonaName (used by GrandmaHelper)
  const getPersonaName = (key: PersonaKey | string): string => {
    return PERSONA_MAP[key as PersonaKey]?.display || key;
  };

  // Utility Function: getPersonaRole (used by GrandmaHelper)
  const getPersonaRole = (key: PersonaKey | string): string => {
    return PERSONA_MAP[key as PersonaKey]?.role || "";
  };

  const setAirlockActive = (open: boolean) =>
    dispatch({ type: "TOGGLE_AIRLOCK", payload: open });

  // NOTE: setFocusState adapter removed. Consumers should now use dispatch({ type: 'SET_FOCUS_MODE' })

  return (
    <OscilloscopeContext.Provider
      value={{
        state,
        dispatch,
        getPersonaName,
        getPersonaRole,
        isAirlockActive: state.isAirlockOpen,
        // Alias for new naming and for easier migration in the codebase/tests
        isEStopActive: state.isAirlockOpen,
        setEStopActive: (open: boolean) =>
          dispatch({ type: "TOGGLE_ESTOP", payload: open }),
        setAirlockActive,
        // No longer expose setFocusState; consumers should use dispatch({ type:'SET_FOCUS_MODE', payload })
        isSourMode: state.isSourMode,
      }}
    >
      {children}
    </OscilloscopeContext.Provider>
  );
};

export const useOscilloscope = () => {
  const context = useContext(OscilloscopeContext);
  if (!context) {
    // STATE CANONICALIZATION: Enforce strict usage
    throw new Error(
      "useOscilloscope must be used within an OscilloscopeProvider",
    );
  }
  return context;
};
