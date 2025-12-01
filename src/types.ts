export type ViewType =
  | 'garden-view'
  | 'operations-control'
  | 'willows-dashboard'
  | 'sebastians-dashboard'
  | 'co-parenting-dashboard'
  | 'sop-vault'
  | 'weekly-review'
  | 'archive-log'
  | 'strategic-roadmap'
  | 'daily-debrief'
  | 'command-center'
  | 'daily-report'
  | 'all-checklists'
  | 'system-insights'
  | 'create-sop'
  | 'william-dashboard-builder'
  | 'willow-dashboard-builder'
  | 'sebastian-dashboard-builder'
  | 'co-parenting-dashboard-builder'
  | 'user-sop-view'
  | 'manifesto'
  | 'technical-manual'
  | 'design-language-protocol'
  | 'operating-manual'
  | 'deployment-protocol'
  | 'game-master-dashboard'
  | 'neuro-onboarding'
  | 'wonky-toolkit'
  | `view-${string}`;

export type DashboardType = 'william' | 'willow' | 'sebastian' | 'co-parenting';
export type Mood = 'Overwhelmed' | 'Neutral' | 'Focused' | 'Calm' | 'Energized';
export type Energy = 'Low' | 'Medium' | 'High';
export type KidLocation = 'Home' | 'School/Other' | 'With Co-Parent';

export interface ChildProfile {
  allergies: string;
  medications: string;
  emergencyContacts: string;
  schoolInfo: string;
}

export type ExpenseCategory = 'Housing' | 'Utilities' | 'Groceries' | 'Transport' | 'Health' | 'Kids' | 'Personal' | 'Other' | 'School';

export interface Sop {
  id: string;
  category: string; // e.g., M4_SOP, M4_IPI, KIDS_SOP
  subCategory: string; // e.g., foundational, mode, ipi, hardware, maintenance, meta, kids
  viewId?: ViewType;
  isPageView?: boolean; // If true, this SOP has its own dedicated page view, rather than just showing a ProtocolView
  title: string;
  description: string;
  steps?: string[];
  cues?: string[]; // Triggers or reminders for the SOP
  taskTemplate?: { title: string; priority: 'Low' | 'Medium' | 'High' }[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'appointment' | 'handoff' | 'event';
  description?: string;
}

export interface HabitTracker {
  habits: { id: string; name: string; currentStreak: number; longestStreak: number }[];
  log: Record<string, string[]>; // { 'YYYY-MM-DD': [habitId1, habitId2]
}

export interface Expense {
  id: string;
  date: string;
  category: ExpenseCategory;
  amount: number;
  description?: string;
}

export interface QuickReferenceEntry {
  id: string;
  title: string;
  content: string;
  tags: string[];
}

export interface Project {
  id: string;
  title: string;
  objectiveId?: string;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  isArchived: boolean;
}

export interface Objective {
  id: string;
  title: string;
  createdAt: string;
  isArchived: boolean;
}

export interface Task {
  id: string;
  title: string;
  status: 'todo' | 'done';
  dueDate?: string | null; // YYYY-MM-DD
  priority?: 'Low' | 'Medium' | 'High';
  createdAt: string;
  completedAt: string | null;
  projectId?: string;
  // Optional fields used by recurring tasks and other task types
  startDate?: string;
  lastCompletedDate?: string | null;
  frequencyDays?: number;
  itemType?: 'task' | 'recurring' | 'event';
}

export interface SensoryState {
  sound: 'high' | 'medium' | 'low' | null;
  sight: 'high' | 'medium' | 'low' | null;
  touch: 'high' | 'medium' | 'low' | null;
}

export interface FamilyLogEntry {
  id: string;
  persona: DashboardType | 'System';
  timestamp: string;
  type: 'log' | 'alert' | 'communication';
  content: string;
}

export interface ParentalAlert {
  id: string;
  type: 'pii-breach' | 'child-safeguard' | 'unauthorized-access';
  timestamp: string;
  status: 'pending' | 'acknowledged' | 'resolved';
  message: string;
  details?: string;
}

export interface SharedExpense {
  id: string;
  description: string;
  amount: number;
  date: string;
  status: 'pending' | 'settled' | 'reimbursed';
  payer: DashboardType;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  steps: { id: string; label: string; completed: boolean }[];
  reward: string;
  assignedTo: 'willow' | 'sebastian';
  isActive: boolean;
}

export interface ProfileStack {
  id: string;
  name: string;
  persona: DashboardType;
  audio: string;
  visual: string;
  oral: string;
  notes?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  timestamp: string;
  content: string;
}

// Checklist data supporting runtime constants used across the app.
export interface ChecklistItem {
  id: string;
  label?: string;
  gemAwardId?: string;
  gemRecipient?: 'willow' | 'sebastian';
  large?: boolean;
  achievementAwardId?: string;
  time?: string;
  startHour?: number;
  endHour?: number;
  description?: string;
  key?: string;
  value?: string;
}

export interface ChecklistSubSection {
  id: string;
  title: string;
  sourceDocument?: string;
  description?: string;
  items?: ChecklistItem[];
  subSections?: ChecklistSubSection[];
}

export interface ChecklistSectionData {
  id: string;
  title: string;
  sourceDocument: string;
  description?: string;
  items?: ChecklistItem[];
  subSections?: ChecklistSubSection[];
}

export interface NeuroPrefs {
  simplifiedUi: boolean;
  reduceAnimations: boolean;
  largerText: boolean;
  focusModeDuration: number;
  microStepsMode: boolean;
  assistTone: 'concise' | 'helpful';
  autoAdvanceSteps: boolean;
}

export interface ToastNotification {
  id: string;
  message: string;
  emoji?: string;
  type?: 'success' | 'error' | 'info';
}

export interface FulfillmentLogEntry {
  id: string;
  persona: 'willow' | 'sebastian';
  rewardTitle?: string;
  fulfilledAt: string;
  notes?: string;
}

export interface AppState {
  view: ViewType;
  dashboardType: DashboardType;
  checkedItems: Record<string, boolean>;
  textInputs: Record<string, string>;
  statusMood: Mood | null;
  statusEnergy: Energy | null;
  kidsWillowLocation: KidLocation | null;
  kidsSebastianLocation: KidLocation | null;
  collectedGems: { willow: string[]; sebastian: string[] };
  collectedAchievements: Record<string, { unlockedAt: string }>;
  userSops: Sop[];
  userSopTemplates: Sop[]; // For user-defined SOP templates to easily create new SOPs
  modifiedSops: Record<string, Sop>;
  isModMode: boolean;
  calendarEvents: CalendarEvent[];
  williamDashboardModules: string[];
  willowDashboardModules: string[];
  sebastianDashboardModules: string[];
  coParentingDashboardModules: string[];
  initialSetupComplete: boolean;
  activeSops: string[];
  activeUserSopId: string | null;
  activeSopTemplate: string | null;
  newSopType: string | null;
  brainDumpText: string;
  sensoryState: SensoryState;
  familyLogEntries: FamilyLogEntry[]; // This was missing in the previous context
  generatedSopDraft: string | null;
  quickReferenceEntries: QuickReferenceEntry[];
  knowledgeVaultEntries: QuickReferenceEntry[];
  habitTracker: HabitTracker;
  expenses: Expense[];
  recurringTasks: Task[];
  tasks: Task[];
  financialBudgets: Record<ExpenseCategory, number>;
  pomodoroState: { 
    mode: 'work' | 'shortBreak' | 'longBreak'; 
    timeLeft: number; 
    isActive: boolean; 
    taskId: string | null; 
    workSessionsCompleted: number 
  };
  acknowledgedRewards: { willow: number[]; sebastian: number[] };
  redeemedRewards: { willow: number[]; sebastian: number[] };
  acknowledgedRedemptions: { willow: number[]; sebastian: number[] };
  parentalAlerts: ParentalAlert[];
  editingSopId: string | null;
  quests: Quest[];
  fulfillmentLog: FulfillmentLogEntry[];
  objectives: Objective[];
  projects: Project[];
  profileStacks: ProfileStack[];
  activeProfileStackId?: string | null;
  recentlyCompletedProjectIds: string[];
  isFocusModeActive: boolean;
  focusModeTaskId: string | null;
  snoozedTaskIds: string[];
  isTriageModeActive: boolean;
  triageTaskId: string | null;
  childProfiles: { willow: ChildProfile; sebastian: ChildProfile };
  sharedExpenses: SharedExpense[];
  savedContext: { prompt: string; response: string; taskId?: string; timestamp?: string } | null;
  isContextCaptureModalOpen: boolean;
  isContextRestoreModalOpen: boolean;
  toastNotifications: ToastNotification[];
  chatMessages: ChatMessage[];
  dismissedNudges: string[];
  neuroPrefs: NeuroPrefs;
  weeklyReviewMode?: 'wizard' | 'checklist';
}

export type Action =
  | { type: 'SET_VIEW'; payload: ViewType }
  | { type: 'SET_DASHBOARD_TYPE'; payload: DashboardType }
  | { type: 'TOGGLE_CHECKED'; payload: string }
  | { type: 'SET_TEXT_INPUT'; payload: { id: string; value: string } }
  | { type: 'SET_MOOD'; payload: Mood | null }
  | { type: 'SET_ENERGY'; payload: Energy | null }
  | { type: 'SET_WILLOW_LOCATION'; payload: KidLocation | null }
  | { type: 'SET_SEBASTIAN_LOCATION'; payload: KidLocation | null }
  | { type: 'SET_KID_LOCATION'; payload: { kid: 'willow' | 'sebastian'; location: KidLocation | null } }
  | { type: 'SET_WEEKLY_REVIEW_MODE'; payload: 'wizard' | 'checklist' }
  | { type: 'ADD_GEM'; payload: { id: string; recipient: 'willow' | 'sebastian' } }
  | { type: 'REMOVE_GEM'; payload: { id: string; recipient: 'willow' | 'sebastian' } }
  | { type: 'ADD_ACHIEVEMENT'; payload: string }
  | { type: 'ADD_SOP'; payload: Sop }
  | { type: 'UPDATE_SOP'; payload: Sop }
  | { type: 'RESET_SOP'; payload: string }
  | { type: 'TOGGLE_MOD_MODE' }
  | { type: 'ADD_CALENDAR_EVENT'; payload: Omit<CalendarEvent, 'id'> }
  | { type: 'REMOVE_CALENDAR_EVENT'; payload: string }
  | { type: 'SET_WILL_DASHBOARD_MODULES'; payload: string[] }
  | { type: 'SET_WILLOW_DASHBOARD_MODULES'; payload: string[] }
  | { type: 'SET_SEBASTIAN_DASHBOARD_MODULES'; payload: string[] }
  | { type: 'SET_CO_PARENTING_DASHBOARD_MODULES'; payload: string[] }
  | { type: 'SET_INITIAL_SETUP_COMPLETE'; payload: boolean }
  | { type: 'SET_ACTIVE_SOPS'; payload: string[] }
  | { type: 'SET_ACTIVE_USER_SOP_ID'; payload: string | null }
  | { type: 'SET_BRAIN_DUMP'; payload: string }
  | { type: 'SET_SENSORY_STATE'; payload: { sense: 'sound' | 'sight' | 'touch'; value: 'high' | 'medium' | 'low' | null } }
  | { type: 'ADD_FAMILY_LOG_ENTRY'; payload: Omit<FamilyLogEntry, 'id' | 'timestamp'> }
  | { type: 'REMOVE_FAMILY_LOG_ENTRY'; payload: string }
  | { type: 'SET_GENERATED_SOP_DRAFT'; payload: string | null }
  | { type: 'ADD_QUICK_REFERENCE_ENTRY'; payload: Partial<QuickReferenceEntry> & { key?: string; value?: string } }
  | { type: 'REMOVE_QUICK_REFERENCE_ENTRY'; payload: string }
  | { type: 'ADD_HABIT'; payload: string }
  | { type: 'REMOVE_HABIT'; payload: string }
  | { type: 'TOGGLE_HABIT_COMPLETE'; payload: { id: string; date: string } }
  | { type: 'ADD_EXPENSE'; payload: Omit<Expense, 'id' | 'date'> }
  | { type: 'REMOVE_EXPENSE'; payload: string }
  | { type: 'RESET_FINANCIAL_DATA' }
  | { type: 'ADD_KNOWLEDGE_ENTRY'; payload: Omit<QuickReferenceEntry, 'id' | 'timestamp'> }
  | { type: 'REMOVE_KNOWLEDGE_ENTRY'; payload: string }
  | { type: 'ADD_RECURRING_TASK'; payload: Omit<Task, 'id' | 'lastCompletedDate'> }
  | { type: 'UPDATE_RECURRING_TASK'; payload: Task }
  | { type: 'REMOVE_RECURRING_TASK'; payload: string }
  | { type: 'COMPLETE_RECURRING_TASK'; payload: string }
  | { type: 'ADD_TASK'; payload: Partial<Task> & Omit<Task, 'createdAt' | 'completedAt' | 'status'> }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_FINANCIAL_BUDGET'; payload: { category: ExpenseCategory; amount: number } }
  | { type: 'POMODORO_SET_MODE'; payload: 'work' | 'shortBreak' | 'longBreak' }
  | { type: 'POMODORO_TOGGLE' }
  | { type: 'POMODORO_RESET' }
  | { type: 'POMODORO_TICK' }
  | { type: 'POMODORO_SET_TASK_ID'; payload: { taskId: string | null } }
  | { type: 'POMODORO_FINISH_SESSION_AND_START_BREAK' }
  | { type: 'POMODORO_COMPLETE_TASK_AND_START_NEXT' }
  | { type: 'RESET_CHILD_REWARDS'; payload: { persona: 'willow' | 'sebastian' } }
  | { type: 'REDEEM_REWARD'; payload: { persona: 'willow' | 'sebastian'; rewardId: string } }
  | { type: 'ACKNOWLEDGE_REDEMPTION'; payload: { persona: 'willow' | 'sebastian'; rewardId: string } }
  | { type: 'SEND_PARENTAL_ALERT'; payload: Omit<ParentalAlert, 'id' | 'timestamp' | 'status'> }
  | { type: 'ACKNOWLEDGE_PARENTAL_ALERT'; payload: string }
  | { type: 'RESET_KNOWLEDGE_VAULT' }
  | { type: 'RESET_BRAIN_DUMP' }
  | { type: 'SET_EDITING_SOP_ID'; payload: string | null }
  | { type: 'UPDATE_USER_SOP'; payload: Sop }
  | { type: 'DELETE_USER_SOP'; payload: string }
  | { type: 'ADD_SOP_TEMPLATE'; payload: Sop }
  | { type: 'DELETE_SOP_TEMPLATE'; payload: string }
  | { type: 'SET_ACTIVE_SOP_TEMPLATE'; payload: string | null }
  | { type: 'SET_NEW_SOP_TYPE'; payload: string | null }
  | { type: 'ADD_QUEST'; payload: Quest }
  | { type: 'UPDATE_QUEST'; payload: Quest }
  | { type: 'DELETE_QUEST'; payload: string }
  | { type: 'COMPLETE_QUEST_STEP'; payload: { questId: string; stepId: string } }
  | { type: 'ADD_FULFILLMENT_LOG_ENTRY'; payload: { questId: string; entry: string } }
  | { type: 'RESET_CHECKLISTS_AND_INPUTS' }
  | { type: 'ADD_OBJECTIVE'; payload: Omit<Objective, 'id' | 'createdAt' | 'isArchived'> }
  | { type: 'ARCHIVE_OBJECTIVE'; payload: string }
  | { type: 'UPDATE_OBJECTIVE'; payload: Objective }
  | { type: 'ADD_PROJECT'; payload: Omit<Project, 'id' | 'createdAt' | 'isArchived'> }
  | { type: 'ARCHIVE_PROJECT'; payload: string }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'SET_RECENTLY_COMPLETED_PROJECT_IDS'; payload: string[] }
  | { type: 'START_FOCUS_MODE'; payload: { firstTaskId: string | null } }
  | { type: 'END_FOCUS_MODE' }
  | { type: 'SNOOZE_TASK'; payload: string }
  | { type: 'UNSNOOZE_TASK'; payload: string }
  | { type: 'START_TRIAGE_MODE'; payload: { firstTaskId: string | null } }
  | { type: 'END_TRIAGE_MODE' }
  | { type: 'SET_CHILD_PROFILE'; payload: { persona: 'willow' | 'sebastian'; profile: ChildProfile } }
  | { type: 'ADD_SHARED_EXPENSE'; payload: Omit<SharedExpense, 'id' | 'date' | 'status'> }
  | { type: 'UPDATE_SHARED_EXPENSE_STATUS'; payload: { id: string; status: 'pending' | 'reimbursed' } }
  | { type: 'REMOVE_SHARED_EXPENSE'; payload: string }
  | { type: 'SAVE_CONTEXT'; payload: { prompt: string; response: string; taskId?: string } }
  | { type: 'CLEAR_CONTEXT' }
  | { type: 'SET_CONTEXT_CAPTURE_MODAL_OPEN'; payload: boolean }
  | { type: 'SET_CONTEXT_RESTORE_MODAL_OPEN'; payload: boolean }
  | { type: 'ADD_TOAST'; payload: ToastNotification }
  | { type: 'REMOVE_TOAST'; payload: string }
  | { type: 'ADD_CHAT_MESSAGE'; payload: Omit<ChatMessage, 'id' | 'timestamp'> }
  | { type: 'REMOVE_CHAT_MESSAGE'; payload: string }
  | { type: 'SET_NEURO_PREFS'; payload: Partial<NeuroPrefs> }
  | { type: 'DISMISS_NUDGE'; payload: string };