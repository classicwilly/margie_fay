import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  type Dispatch,
  type FC,
} from "react";

// --- TYPES ---
type PersonaKey = "grandma" | "grandpa" | "bob" | "marge";
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
      dispatch: Dispatch<Action>;
      getPersonaName: (key: PersonaKey | string) => string;
      getPersonaRole: (key: PersonaKey | string) => string; // Added utility
    }
  | undefined
>(undefined);

export const OscilloscopeProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Utility Function: getPersonaName (used by GrandmaHelper)
  const getPersonaName = (key: PersonaKey | string): string => {
    return PERSONA_MAP[key as PersonaKey]?.display || key;
  };

  // Utility Function: getPersonaRole (used by GrandmaHelper)
  const getPersonaRole = (key: PersonaKey | string): string => {
    return PERSONA_MAP[key as PersonaKey]?.role || "";
  };

  return (
    <OscilloscopeContext.Provider
      value={{ state, dispatch, getPersonaName, getPersonaRole }}
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
