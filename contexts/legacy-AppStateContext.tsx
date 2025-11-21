// Legacy provider removed to prevent accidental provider duplication.
// If you need a fallback local provider for quick tests, use `src/contexts/AppStateContext.tsx` instead.
import React from 'react';
export default React;
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateId } from '@utils/generateId';
import { AppState, Action, ViewType, Mood, Energy, KidLocation, Sop, CalendarEvent } from '../types';
import { SOP_DATA } from '../constants';

const defaultState: AppState = {
  view: 'command-center',
  checkedItems: {},
  textInputs: {},
  statusMood: null,
  statusEnergy: null,
  kidsWillowLocation: null,
  kidsSebastianLocation: null,
  collectedGems: {
    willow: [],
    sebastian: [],
  },
  // collectedAchievements: map of achievementId -> { unlockedAt: ISO timestamp }
  collectedAchievements: {},
  userSops: [],
  modifiedSops: {},
  isModMode: false,
  calendarEvents: [],
  habitTracker: { habits: [], log: {} as Record<string, string[]> },
  expenses: [],
  brainDumpText: '',
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, view: action.payload };
    case 'TOGGLE_CHECKED':
      return {
        ...state,
        checkedItems: {
          ...state.checkedItems,
          [action.payload]: !state.checkedItems[action.payload],
        },
      };
    case 'SET_TEXT_INPUT':
      return {
        ...state,
        textInputs: {
          ...state.textInputs,
          [action.payload.id]: action.payload.value,
        },
      };
    case 'SET_MOOD':
      return { ...state, statusMood: action.payload };
    case 'SET_ENERGY':
      return { ...state, statusEnergy: action.payload };
    case 'SET_KID_LOCATION':
      if (action.payload.kid === 'willow') {
        return { ...state, kidsWillowLocation: action.payload.location };
      }
      return { ...state, kidsSebastianLocation: action.payload.location };
    case 'ADD_GEM':
      const { id, recipient } = action.payload;
      const currentGems = state.collectedGems[recipient] || [];
      if (currentGems.includes(id)) return state;
      return {
        ...state,
        collectedGems: {
          ...state.collectedGems,
          [recipient]: [...currentGems, id],
        },
      };
    case 'ADD_ACHIEVEMENT':
      // Use map shape for collectedAchievements: { [id]: { unlockedAt: string } }
      if (state.collectedAchievements && state.collectedAchievements[action.payload]) return state;
      return {
        ...state,
        collectedAchievements: {
          ...state.collectedAchievements,
          [action.payload]: { unlockedAt: new Date().toISOString() }
        },
      };
    case 'ADD_SOP':
      return { ...state, userSops: [...state.userSops, action.payload] };
    case 'UPDATE_SOP':
      return {
        ...state,
        modifiedSops: { ...state.modifiedSops, [action.payload.id]: action.payload },
      };
    case 'RESET_SOP':
      const newModifiedSops = { ...state.modifiedSops };
      delete newModifiedSops[action.payload];
      return { ...state, modifiedSops: newModifiedSops };
    case 'TOGGLE_MOD_MODE':
      return { ...state, isModMode: !state.isModMode };
    case 'ADD_CALENDAR_EVENT':
      const newEvent: CalendarEvent = { ...action.payload, id: generateId() };
      return {
        ...state,
        calendarEvents: [...state.calendarEvents, newEvent].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
      };
    case 'REMOVE_CALENDAR_EVENT':
      return {
        ...state,
        calendarEvents: state.calendarEvents.filter(event => event.id !== action.payload),
      };
    case 'RESET_CHECKLISTS_AND_INPUTS':
      return { ...state, checkedItems: {}, textInputs: {} };
    case 'RESET_REWARDS':
      return { ...state, collectedGems: { willow: [], sebastian: [] }, collectedAchievements: {} };
    default:
      return state;
  }
}

interface AppStateContextType {
  appState: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [storedState, setStoredState] = useLocalStorage<AppState>('wonky-sprout-os-state', defaultState);
  
  const reducerWithLocalStorage = (state: AppState, action: Action) => {
    const newState = appReducer(state, action);
    setStoredState(newState);
    return newState;
  };
  
  const [appState, dispatch] = useReducer(reducerWithLocalStorage, storedState);

  return (
    <AppStateContext.Provider value={{ appState, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = (): AppStateContextType => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
