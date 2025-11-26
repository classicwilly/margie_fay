import type { AppState, AppAction } from './types.js';
import { defaultUserState } from '../../defaultStates.js';
import { generateId } from '@utils/generateId';

// Small helpers used by the reducer
const toYMD = (date: Date): string => date.toISOString().split('T')[0];
const timePresets = { work: 25 * 60, shortBreak: 5 * 60, longBreak: 15 * 60 };
const addDays = (date: Date | string, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

function recalculateStreaks(habitId: string, log: AppState['habitTracker']['log']) {
  const dates = Object.keys(log).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  let currentStreak = 0; let longestStreak = 0; let tempStreak = 0;
  const today = new Date();
  let streakContinues = true;
  let dateToCheck = new Date(today);
  if (!log[toYMD(today)]?.includes(habitId)) {
      dateToCheck.setDate(dateToCheck.getDate() - 1);
  }
  while (streakContinues) {
      const dateStr = toYMD(dateToCheck);
      if (log[dateStr]?.includes(habitId)) {
          currentStreak++;
          dateToCheck.setDate(dateToCheck.getDate() - 1);
      } else {
          streakContinues = false;
      }
  }
  if (dates.length > 0) {
      let lastDate = new Date(dates[0]);
      for (const dateStr of dates) {
          if (log[dateStr]?.includes(habitId)) {
              const currentDate = new Date(dateStr);
              const diffDays = (lastDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24);
              if (diffDays <= 1) tempStreak++; else tempStreak = 1;
              if (tempStreak > longestStreak) longestStreak = tempStreak;
              lastDate = currentDate;
          }
      }
  }
  return { currentStreak, longestStreak };
}

// Merge helper used by IMPORT_STATE and snapshot merges.
function safeMerge<T extends Record<string, any>>(base: T, override: Partial<T> | null | undefined): T {
  if (!override) return base;
  const result: any = { ...base };
  for (const key of Object.keys(override)) {
    const val = (override as any)[key];
    if (val === null || val === undefined) continue;
    const baseVal = (base as any)[key];
    if (Array.isArray(val)) {
      result[key] = val;
    } else if (val && typeof val === 'object' && baseVal && typeof baseVal === 'object' && !Array.isArray(baseVal)) {
      result[key] = safeMerge(baseVal, val);
    } else {
      result[key] = val;
    }
  }
  return result;
}

export function userReducer(state: AppState, action: AppAction): AppState {
  // Log is fine for now; this is a shared reducer that drives many behaviors.
  if (process.env.NODE_ENV === 'development') {
    console.log('REDUCER ACTION:', action.type, (action as any).payload);
  }
  const newState = { ...state };
  switch (action.type) {
    case 'SET_NEURO_PREFS': {
      const payload = action.payload as any;
      newState.neuroPrefs = { ...newState.neuroPrefs, ...payload };
      break;
    }
    case 'SET_SAVED_CONTEXT': {
      newState.savedContext = action.payload as any;
      break;
    }
    case 'SET_PERSONA_OVERRIDE': {
      const { key, value } = action.payload as any;
      newState.personaOverrides = { ...newState.personaOverrides, [key]: value || undefined };
      break;
    }
    case 'SET_CONTEXT_RESTORE_MODAL_OPEN': {
      newState.isContextRestoreModalOpen = action.payload as boolean;
      break;
    }
    case 'CONFIRM_VIEW_CHANGE': {
      // Apply saved context view if present, fallback to current view
      try {
        const saved = (newState as any).savedContext;
        if (saved && (saved as any).view) {
          newState.view = (saved as any).view as any;
        }
      } catch { /* ignore */ }
      newState.savedContext = null;
      newState.isContextRestoreModalOpen = false;
      break;
    }
    case 'SET_VIEW': newState.view = action.payload; break;
    case 'TOGGLE_CHECKED': newState.checkedItems = { ...newState.checkedItems, [action.payload]: !newState.checkedItems[action.payload] }; break;
    case 'SET_MOOD': newState.statusMood = action.payload; break;
    case 'SET_ENERGY': newState.statusEnergy = action.payload; break;
    case 'SET_INITIAL_SETUP_COMPLETE': newState.initialSetupComplete = action.payload; break;
    case 'SET_ONBOARDING_STEP': {
      newState.onboardingStep = action.payload as number;
      break;
    }
    case 'POMODORO_SET_MODE': {
      const newTime = timePresets[action.payload];
      newState.pomodoroState = { ...newState.pomodoroState, mode: action.payload as any, timeLeft: newTime, isActive: false };
      break;
    }
    case 'POMODORO_TOGGLE': {
      newState.pomodoroState = { ...newState.pomodoroState, isActive: !newState.pomodoroState.isActive };
      break;
    }
    case 'IMPORT_STATE': {
      try {
        const rawImported = { ...action.payload } as any;
        rawImported.dismissedNudges = Array.isArray(rawImported.dismissedNudges) ? rawImported.dismissedNudges : [];
        const merged = safeMerge(defaultUserState as any, rawImported);
        return merged as AppState;
      } catch (e) {
        return safeMerge(defaultUserState as any, action.payload as any) as AppState;
      }
    }
    default:
      return newState;
  }
  return newState;
}

export { toYMD, addDays, recalculateStreaks, safeMerge };
