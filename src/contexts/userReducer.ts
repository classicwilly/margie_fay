import type { AppState, AppAction } from "./types.js";
import { defaultUserState } from "../../defaultStates.js";
// generateId is not used in this reducer currently; keep import removed to avoid unused variable errors

// Small helpers used by the reducer
const toYMD = (date: Date): string => date.toISOString().split("T")[0];
export const timePresets = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};
const addDays = (date: Date | string, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

function recalculateStreaks(
  habitId: string,
  log: AppState["habitTracker"]["log"],
) {
  const dates = Object.keys(log).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  );
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  const today = new Date();
  let streakContinues = true;
  const dateToCheck = new Date(today);
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
        const diffDays =
          (lastDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24);
        if (diffDays <= 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
        lastDate = currentDate;
      }
    }
  }
  return { currentStreak, longestStreak };
}

// Merge helper used by IMPORT_STATE and snapshot merges.
function safeMerge<T extends Record<string, any>>(
  base: T,
  override: Partial<T> | null | undefined,
): T {
  if (!override) {
    return base;
  }
  const result: any = { ...base };
  for (const key of Object.keys(override)) {
    const val = (override as any)[key];
    if (val === null || val === undefined) {
      continue;
    }
    const baseVal = (base as any)[key];
    if (Array.isArray(val)) {
      result[key] = val;
    } else if (
      val &&
      typeof val === "object" &&
      baseVal &&
      typeof baseVal === "object" &&
      !Array.isArray(baseVal)
    ) {
      result[key] = safeMerge(baseVal, val);
    } else {
      result[key] = val;
    }
  }
  return result;
}

export function userReducer(state: AppState, action: AppAction): AppState {
  // Log is fine for now; this is a shared reducer that drives many behaviors.
  if (process.env.NODE_ENV === "development") {
    if (Object.prototype.hasOwnProperty.call(action, "payload")) {
      // Some actions do not include a payload (discriminated union variants)
      // so only log it when present to avoid TypeScript errors.
      console.log("REDUCER ACTION:", action.type, (action as any).payload);
    } else {
      console.log("REDUCER ACTION:", action.type);
    }
  }
  const newState = { ...state } as AppState;
  // Normalize older view strings during migration from 'cockpit/command-center' -> 'workshop'
  function normalizeView(viewVal: any) {
    if (!viewVal) {
      return viewVal;
    }
    if (viewVal === "workshop" || viewVal === "command-center") {
      return "workshop";
    }
    if (viewVal === "cockpit-setup" || viewVal === "command-center-setup") {
      return "workshop-setup";
    }
    return viewVal;
  }
  switch (action.type) {
    case "SET_NEURO_PREFS": {
      const payload = action.payload as Partial<AppState["neuroPrefs"]>;
      newState.neuroPrefs = { ...newState.neuroPrefs, ...payload };
      break;
    }
    case "SET_SAVED_CONTEXT": {
      newState.savedContext = action.payload;
      break;
    }
    case "SET_PERSONA_OVERRIDE": {
      const { key, value } = action.payload as { key: string; value: string };
      newState.personaOverrides = {
        ...newState.personaOverrides,
        [key]: value || undefined,
      };
      break;
    }
    case "SET_MODULE_STATE": {
      const { id, enabled } = action.payload as {
        id: string;
        enabled: boolean | null | undefined;
      };
      if (!newState.moduleStates) {
        newState.moduleStates = {} as any;
      }
      if (enabled === undefined || enabled === null) {
        delete (newState.moduleStates as any)[id];
      } else {
        (newState.moduleStates as any)[id] = !!enabled;
      }
      break;
    }
    case "SET_CONTEXT_RESTORE_MODAL_OPEN": {
      newState.isContextRestoreModalOpen = action.payload as boolean;
      break;
    }
    case "CONFIRM_VIEW_CHANGE": {
      // Apply saved context view if present, fallback to current view
      try {
        const saved = (newState as any).savedContext;
        if (saved && (saved as any).view) {
          newState.view = normalizeView((saved as any).view) as any;
        }
      } catch (e) {
        /* ignore */
      }
      newState.savedContext = null;
      newState.isContextRestoreModalOpen = false;
      break;
    }
    case "SET_VIEW":
      newState.view = normalizeView(action.payload as any);
      break;
      break;
    case "TOGGLE_CHECKED":
      newState.checkedItems = {
        ...(newState.checkedItems as Record<string, boolean>),
        [action.payload]: !(newState.checkedItems as Record<string, boolean>)[
          action.payload as string
        ],
      };
      break;
    case "SET_MOOD":
      newState.statusMood = action.payload;
      break;
    case "SET_ENERGY":
      newState.statusEnergy = action.payload;
      break;
    case "SET_INITIAL_SETUP_COMPLETE":
      newState.initialSetupComplete = action.payload;
      break;
    case "SET_ONBOARDING_STEP": {
      newState.onboardingStep = action.payload;
      break;
    }
    case "POMODORO_SET_MODE": {
      const payload = action.payload as "work" | "shortBreak" | "longBreak";
      const newTime = timePresets[payload];
      newState.pomodoroState = {
        ...newState.pomodoroState,
        mode: payload,
        timeLeft: newTime,
        isActive: false,
      };
      break;
    }
    case "POMODORO_TOGGLE": {
      newState.pomodoroState = {
        ...newState.pomodoroState,
        isActive: !newState.pomodoroState.isActive,
      };
      break;
    }
    case "CLEAR_INBOX": {
      const now = new Date().toISOString();
      // Mark inbox (unscheduled) tasks as complete
      newState.tasks = (newState.tasks || []).map((t: any) => {
        if (!t.projectId) {
          return { ...t, status: "done", completedAt: t.completedAt || now };
        }
        return t;
      });
      // Archive knowledge vault entries
      if (Array.isArray(newState.knowledgeVaultEntries)) {
        newState.knowledgeVaultEntries = (
          newState.knowledgeVaultEntries as any[]
        ).map((e: any) => ({
          ...e,
          isArchived: true,
        }));
      }
      // Clear the brain dump as a part of 'inbox zero' operation
      newState.brainDumpText = "";
      break;
    }
    case "ARCHIVE_OLD_ENTRIES": {
      const days = action.payload?.days ?? 30;
      const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
      const archivedKnowledgeIds: string[] = [];
      const archivedTaskIds: string[] = [];
      if (Array.isArray(newState.knowledgeVaultEntries)) {
        newState.knowledgeVaultEntries = (
          newState.knowledgeVaultEntries as any[]
        ).map((e: any) => {
          const createdAt = e?.createdAt ? Date.parse(e.createdAt) : null;
          if (createdAt && createdAt < cutoff) {
            archivedKnowledgeIds.push(e.id);
            return { ...e, isArchived: true };
          }
          return e;
        });
      }
      // Archive tasks that are completed and older than cutoff
      if (Array.isArray(newState.tasks)) {
        newState.tasks = newState.tasks.map((t: any) => {
          const completedAt = t?.completedAt ? Date.parse(t.completedAt) : null;
          if (t.status === "done" && completedAt && completedAt < cutoff) {
            archivedTaskIds.push(t.id);
            return { ...t, archivedByHousekeeping: true };
          }
          return t;
        });
      }
      // Store lastArchive IDs for undo
      (newState as any).lastHousekeepingArchive = {
        tasks: archivedTaskIds,
        knowledge: archivedKnowledgeIds,
      };
      break;
    }
    case "RESTORE_ARCHIVED_TASKS": {
      try {
        const last = (newState as any).lastHousekeepingArchive;
        if (!last) {
          break;
        }
        if (
          Array.isArray(newState.knowledgeVaultEntries) &&
          last.knowledge.length > 0
        ) {
          newState.knowledgeVaultEntries = (
            newState.knowledgeVaultEntries as any[]
          ).map((e: any) => {
            if (last.knowledge.includes(e.id)) {
              return { ...e, isArchived: false };
            }
            return e;
          });
        }
        if (Array.isArray(newState.tasks) && last.tasks.length > 0) {
          newState.tasks = newState.tasks.map((t: any) => {
            if (last.tasks.includes(t.id)) {
              const newT = { ...t };
              delete (newT as any).archivedByHousekeeping;
              return newT;
            }
            return t;
          });
        }
        // Clear the last record once restored
        (newState as any).lastHousekeepingArchive = null;
      } catch (e) {
        /* ignore */
      }
      break;
    }
    case "IMPORT_STATE": {
      try {
        const rawImported = { ...action.payload } as Partial<AppState>;
        rawImported.dismissedNudges = Array.isArray(rawImported.dismissedNudges)
          ? rawImported.dismissedNudges
          : [];
        const merged = safeMerge(defaultUserState as any, rawImported);
        return merged as AppState;
      } catch (e) {
        return safeMerge(
          defaultUserState as any,
          action.payload as Partial<AppState>,
        ) as AppState;
      }
    }
    default:
      return newState;
  }
  return newState;
}

export { toYMD, addDays, recalculateStreaks, safeMerge };
