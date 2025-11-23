import { ALL_WILLIAM_MODULES_CONFIG, ALL_WILLOW_MODULES_CONFIG, ALL_SEBASTIAN_MODULES_CONFIG, ALL_CO_PARENTING_MODULES_CONFIG } from './src/constants.js';

const today = new Date();
const todayYMD = today.toISOString().split('T')[0];
const handoffTime = new Date(today);
handoffTime.setHours(16, 0, 0, 0);

// This is the default state for a *new* user.
export const defaultUserState = {
  view: 'garden-view', // This will be overwritten by dashboardType
  dashboardType: 'william',
  checkedItems: {},
  textInputs: {},
  statusMood: 'Overwhelmed',
  statusEnergy: 'Low',
  kidsWillowLocation: 'School/Other',
  kidsSebastianLocation: 'School/Other',
  collectedGems: { willow: [], sebastian: [] },
  collectedAchievements: {},
  userSops: [],
  userSopTemplates: [],
  modifiedSops: {},
  isModMode: false,
  calendarEvents: [
    { id: 'default-event-1', title: 'Kids Arrive (Handoff)', date: handoffTime.toISOString(), type: 'handoff' }
  ],
  williamDashboardModules: ALL_WILLIAM_MODULES_CONFIG.filter(m => m.defaultEnabled).map(m => m.id),
  willowDashboardModules: ALL_WILLOW_MODULES_CONFIG.filter(m => m.defaultEnabled).map(m => m.id),
  sebastianDashboardModules: ALL_SEBASTIAN_MODULES_CONFIG.filter(m => m.defaultEnabled).map(m => m.id),
  coParentingDashboardModules: ALL_CO_PARENTING_MODULES_CONFIG.filter(m => m.defaultEnabled).map(m => m.id),
  initialSetupComplete: false, // Start as false for new users
  onboardingStep: 0,
  activeSops: [],
  activeUserSopId: null,
  activeSopTemplate: null,
  newSopType: null,
  brainDumpText: '...and do all the other shit.',
  sensoryState: { sound: null, sight: null, touch: null },
  familyLogEntries: [],
  generatedSopDraft: null,
  quickReferenceEntries: [],
  // FIX: Explicitly type habits and log to prevent incorrect type inference on empty values.
  habitTracker: { habits: [] as { id: string; name: string; currentStreak: number; longestStreak: number }[], log: {} as Record<string, string[]> },
  expenses: [],
  knowledgeVaultEntries: [],
  recurringTasks: [],
  tasks: [
    { id: 'task-xbox', title: "Fix Bash's Xbox", status: 'todo', dueDate: todayYMD, priority: 'High', createdAt: new Date().toISOString(), completedAt: null, projectId: undefined },
    { id: 'task-kitchen', title: "Perform daily kitchen maintenance (5 min)", status: 'todo', dueDate: todayYMD, priority: 'High', createdAt: new Date().toISOString(), completedAt: null, projectId: undefined },
    { id: 'task-bathroom', title: "Perform daily bathroom maintenance (5 min)", status: 'todo', dueDate: todayYMD, priority: 'High', createdAt: new Date().toISOString(), completedAt: null, projectId: undefined },
    { id: 'task-car', title: "Progress on Willow's car", status: 'todo', dueDate: todayYMD, priority: 'Medium', projectId: 'proj-willow-car', createdAt: new Date().toISOString(), completedAt: null },
    { id: 'task-living', title: "Perform daily living space maintenance (5 min)", status: 'todo', dueDate: todayYMD, priority: 'Medium', createdAt: new Date().toISOString(), completedAt: null, projectId: undefined },
  ],
  financialBudgets: { 'Housing': 0, 'Utilities': 0, 'Groceries': 0, 'Transport': 0, 'Health': 0, 'Kids': 0, 'Personal': 0, 'Other': 0, 'School': 0 },
  pomodoroState: { mode: 'work', timeLeft: 25 * 60, isActive: false, taskId: null, workSessionsCompleted: 0 },
  acknowledgedRewards: { willow: [], sebastian: [] },
  redeemedRewards: { willow: [], sebastian: [] },
  acknowledgedRedemptions: { willow: [], sebastian: [] },
  parentalAlerts: [],
  editingSopId: null,
  quests: [],
  fulfillmentLog: [],
  // FIX: Add isArchived property to maintain type consistency.
  objectives: [
    { id: 'obj-willow-car', title: "Restore Willow's Power Wheels Car", createdAt: new Date().toISOString(), isArchived: false }
  ],
  // FIX: Add isArchived property to maintain type consistency.
  projects: [
    { id: 'proj-willow-car', title: "Willow's Car Restoration", objectiveId: 'obj-willow-car', createdAt: new Date().toISOString(), isArchived: false }
  ],
  recentlyCompletedProjectIds: [],
  isFocusModeActive: false,
  focusModeTaskId: null,
  snoozedTaskIds: [],
  isTriageModeActive: false,
  triageTaskId: null,
  childProfiles: {
    willow: { allergies: '', medications: '', emergencyContacts: '', schoolInfo: '' },
    sebastian: { allergies: '', medications: '', emergencyContacts: '', schoolInfo: '' },
  },
  sharedExpenses: [],
  savedContext: null,
  isContextCaptureModalOpen: false,
  isContextRestoreModalOpen: false,
  toastNotifications: [],
  chatMessages: [],
  dismissedNudges: [],
  // Allow users to override persona display names for privacy/agency
  personaOverrides: {},
  // Neurodivergent preferences - persisted per-user (simple defaults)
  neuroPrefs: {
    simplifiedUi: true,
    reduceAnimations: true,
    largerText: false,
    focusModeDuration: 15,
    microStepsMode: true,
    assistTone: 'concise',
    autoAdvanceSteps: false
  },
  // Weekly review UI mode selection: 'wizard' or 'checklist'
  weeklyReviewMode: 'wizard',
  // Cockpit / Profile Stacks for neurodivergent sensory stacks
  profileStacks: [
    {
      id: 'racecar-1',
      name: 'Race Car Flow',
      persona: 'william',
      audio: 'brown_noise',
      oral: 'chew-heavy',
      visual: 'sunglasses',
      notes: 'Default admin Race Car profile for high focus',
      createdAt: new Date().toISOString(),
    }
  ],
  activeProfileStackId: 'racecar-1',
};
