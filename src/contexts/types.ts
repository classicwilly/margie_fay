import type { AppState as GlobalAppState, CalendarEvent, FamilyLogEntry, Expense, QuickReferenceEntry, Task, ParentalAlert, Objective, Project, Quest, ChildProfile, SharedExpense, ChatMessage } from '../types';

// The main state type is defined in `src/types.ts` as the canonical AppState type.
export type AppState = GlobalAppState;

// Discriminated union for all possible actions.
export type AppAction =
    | { type: 'SET_SAVED_CONTEXT'; payload: AppState['savedContext'] }
  | { type: 'SET_VIEW'; payload: AppState['view'] }
  | { type: 'SET_DASHBOARD_TYPE'; payload: AppState['dashboardType'] }
  | { type: 'TOGGLE_CHECKED'; payload: string }
  | { type: 'SET_TEXT_INPUT'; payload: { id: string; value: string } }
  | { type: 'SET_MOOD'; payload: AppState['statusMood'] }
  | { type: 'SET_ENERGY'; payload: AppState['statusEnergy'] }
  | { type: 'SET_KID_LOCATION'; payload: { kid: 'willow' | 'sebastian'; location: import('../types').KidLocation | null } }
  | { type: 'ADD_GEM'; payload: { id: string; recipient: 'willow' | 'sebastian' } }
  | { type: 'REMOVE_GEM'; payload: { id: string; recipient: 'willow' | 'sebastian' } }
  | { type: 'ADD_ACHIEVEMENT'; payload: string }
  | { type: 'ADD_SOP'; payload: AppState['userSops'][0] }
  | { type: 'UPDATE_SOP'; payload: AppState['userSops'][0] } // Modify as per SOP type
  | { type: 'RESET_SOP'; payload: string }
  | { type: 'TOGGLE_MOD_MODE' }
  | { type: 'ADD_CALENDAR_EVENT'; payload: Omit<CalendarEvent, 'id'> } // Modify as per Event type
  | { type: 'REMOVE_CALENDAR_EVENT'; payload: string }
  | { type: 'RESET_CHECKLISTS_AND_INPUTS' }
  | { type: 'RESET_REWARDS' }
  | { type: 'SET_WILL_DASHBOARD_MODULES'; payload: string[] }
  | { type: 'SET_WILLOW_DASHBOARD_MODULES'; payload: string[] }
  | { type: 'SET_SEBASTIAN_DASHBOARD_MODULES'; payload: string[] }
  | { type: 'SET_CO_PARENTING_DASHBOARD_MODULES'; payload: string[] }
  | { type: 'SET_INITIAL_SETUP_COMPLETE'; payload: boolean }
  | { type: 'SET_ACTIVE_SOPS'; payload: string[] }
  | { type: 'SET_ACTIVE_USER_SOP_ID'; payload: string | null }
  | { type: 'SET_BRAIN_DUMP'; payload: string }
  | { type: 'SET_SENSORY_STATE'; payload: { sense: 'sound' | 'sight' | 'touch'; value: 'high' | 'medium' | 'low' | null } }
  | { type: 'ADD_FAMILY_LOG_ENTRY'; payload: Omit<FamilyLogEntry, 'id' | 'timestamp'> } // Modify as per LogEntry type
  | { type: 'REMOVE_FAMILY_LOG_ENTRY'; payload: string }
  | { type: 'SET_GENERATED_SOP_DRAFT'; payload: string | null }
  | { type: 'SET_WEEKLY_REVIEW_MODE'; payload: 'wizard' | 'checklist' }
  | { type: 'ADD_QUICK_REFERENCE_ENTRY'; payload: Partial<QuickReferenceEntry> & { key?: string; value?: string } }
  | { type: 'REMOVE_QUICK_REFERENCE_ENTRY'; payload: string }
  | { type: 'ADD_HABIT'; payload: string }
  | { type: 'REMOVE_HABIT'; payload: string }
  | { type: 'TOGGLE_HABIT_LOG'; payload: { habitId: string; date: string } }
  | { type: 'ADD_EXPENSE'; payload: Omit<Expense, 'id' | 'date'> }
  | { type: 'REMOVE_EXPENSE'; payload: string }
  | { type: 'ADD_KNOWLEDGE_ENTRY'; payload: Omit<QuickReferenceEntry, 'id'> }
  | { type: 'UPDATE_KNOWLEDGE_ENTRY'; payload: QuickReferenceEntry }
  | { type: 'REMOVE_KNOWLEDGE_ENTRY'; payload: string }
  | { type: 'ARCHIVE_KNOWLEDGE_ENTRY'; payload: string }
  | { type: 'UNARCHIVE_KNOWLEDGE_ENTRY'; payload: string }
  | { type: 'ADD_RECURRING_TASK'; payload: Omit<Task, 'id'> }
  | { type: 'REMOVE_RECURRING_TASK'; payload: string }
  | { type: 'COMPLETE_RECURRING_TASK'; payload: string }
  | { type: 'ADD_TASK'; payload: Partial<Task> & Omit<Task, 'createdAt' | 'completedAt' | 'status'> }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_FINANCIAL_BUDGET'; payload: { category: string; amount: number } }
  | { type: 'POMODORO_SET_MODE'; payload: 'work' | 'shortBreak' | 'longBreak' }
  | { type: 'POMODORO_TOGGLE' }
  | { type: 'POMODORO_RESET' }
  | { type: 'POMODORO_TICK' }
  | { type: 'POMODORO_SET_TASK_ID'; payload: { taskId: string | null } }
  | { type: 'POMODORO_FINISH_SESSION_AND_START_BREAK' }
  | { type: 'POMODORO_COMPLETE_TASK_AND_START_NEXT' }
  | { type: 'ACKNOWLEDGE_REWARD'; payload: { persona: 'willow' | 'sebastian'; threshold: number } }
  | { type: 'REDEEM_REWARD'; payload: { persona: 'willow' | 'sebastian'; threshold: number } }
  | { type: 'ACKNOWLEDGE_REDEMPTION'; payload: { persona: 'willow' | 'sebastian'; threshold: number; notes: string; rewardTitle: string } }
  | { type: 'SEND_PARENTAL_ALERT'; payload: Omit<ParentalAlert, 'id' | 'timestamp' | 'status'> }
  | { type: 'ACKNOWLEDGE_PARENTAL_ALERT'; payload: string }
  | { type: 'RESET_FINANCIAL_DATA' }
  | { type: 'RESET_KNOWLEDGE_VAULT' }
  | { type: 'RESET_BRAIN_DUMP' }
  | { type: 'SET_EDITING_SOP_ID'; payload: string | null }
  | { type: 'UPDATE_USER_SOP'; payload: AppState['userSops'][0] }
  | { type: 'DELETE_USER_SOP'; payload: string }
  | { type: 'ADD_SOP_TEMPLATE'; payload: AppState['userSops'][0] }
  | { type: 'DELETE_SOP_TEMPLATE'; payload: string }
  | { type: 'SET_ACTIVE_SOP_TEMPLATE'; payload: string | AppState['userSopTemplates'][0] | null }
  | { type: 'SET_NEW_SOP_TYPE'; payload: 'template' | 'protocol' | null }
  | { type: 'RESET_CHILD_REWARDS'; payload: { persona: 'willow' | 'sebastian' } }
  | { type: 'ADD_QUEST'; payload: Omit<Quest, 'id' | 'steps'> & { steps: string[] } }
  | { type: 'DELETE_QUEST'; payload: string }
  | { type: 'TOGGLE_QUEST_STEP'; payload: { questId: string; stepId: string } }
  | { type: 'UPDATE_QUEST_STATUS'; payload: { questId: string; status: 'active' | 'review' | 'complete' } }
  | { type: 'START_FOCUS_MODE'; payload: { firstTaskId: string | null } }
  | { type: 'STOP_FOCUS_MODE' }
  | { type: 'SET_FOCUS_TASK'; payload: { taskId: string | null } }
  | { type: 'SNOOZE_TASK'; payload: { taskId: string } }
  | { type: 'START_TRIAGE_MODE'; payload: { firstTaskId: string | null } }
  | { type: 'STOP_TRIAGE_MODE' }
  | { type: 'SET_TRIAGE_TASK'; payload: { taskId: string | null } }
  | { type: 'ADD_OBJECTIVE'; payload: { title: string } }
  | { type: 'UPDATE_OBJECTIVE'; payload: Objective }
  | { type: 'DELETE_OBJECTIVE'; payload: string }
  | { type: 'ARCHIVE_OBJECTIVE'; payload: string }
  | { type: 'UNARCHIVE_OBJECTIVE'; payload: string }
  | { type: 'ADD_PROJECT'; payload: Omit<Project, 'id' | 'createdAt' | 'isArchived'> }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'ARCHIVE_PROJECT'; payload: string }
  | { type: 'UNARCHIVE_PROJECT'; payload: string }
  | { type: 'ACKNOWLEDGE_PROJECT_COMPLETION'; payload: string }
  | { type: 'UPDATE_CHILD_PROFILE'; payload: { persona: 'willow' | 'sebastian'; profile: ChildProfile } }
  | { type: 'ADD_SHARED_EXPENSE'; payload: Omit<SharedExpense, 'id' | 'date' | 'status'> }
  | { type: 'UPDATE_SHARED_EXPENSE_STATUS'; payload: { id: string; status: 'pending' | 'settled' | 'reimbursed' } }
  | { type: 'SAVE_CONTEXT'; payload: AppState['savedContext'] }
  | { type: 'CLEAR_CONTEXT' }
  | { type: 'SET_CONTEXT_CAPTURE_MODAL_OPEN'; payload: boolean }
  | { type: 'SET_CONTEXT_RESTORE_MODAL_OPEN'; payload: boolean }
  | { type: 'ADD_TOAST'; payload: { id: string; emoji: string; message: string } }
  | { type: 'REMOVE_TOAST'; payload: string }
  | { type: 'ADD_CHAT_MESSAGE'; payload: Omit<ChatMessage, 'id' | 'timestamp'> }
  | { type: 'IMPORT_STATE'; payload: AppState }
  | { type: 'DISMISS_NUDGE'; payload: string }
  | { type: 'SET_NEURO_PREFS'; payload: Partial<AppState['neuroPrefs']> }
  | { type: 'ADD_PROFILE_STACK'; payload: AppState['profileStacks'][0] }
  | { type: 'UPDATE_PROFILE_STACK'; payload: AppState['profileStacks'][0] }
  | { type: 'DELETE_PROFILE_STACK'; payload: string }
  | { type: 'APPLY_PROFILE_STACK'; payload: string }
  | { type: 'SET_ACTIVE_PROFILE_STACK'; payload: string | null }

// The type for the context value.
export interface AppContextType {
  authUser: { uid: string; email: string | null } | null | undefined;
  appState: AppState | null;
  dispatch: React.Dispatch<AppAction>;
  isTestMode?: boolean;
}
