
// FIX: Add React import to fix UMD global error.
import React from 'react';
import DayProgressBarModule from './modules/DayProgressBarModule.js';
import StatusTrackerModule from './modules/StatusTrackerModule.js';
import KidsTrackerModule from './modules/KidsTrackerModule.js';
import WonkyAIModule from './modules/WonkyAIModule.js';
import AchievementTrackerModule from './modules/AchievementTrackerModule.js';
import ActiveSopsDisplayModule from './modules/william/ActiveSopsDisplayModule.js';
import ActiveSopsSelectorModule from './modules/william/ActiveSopsSelectorModule.js';
import PomodoroTimerModule from './modules/william/PomodoroTimerModule.js';
import SensoryCheckInModule from './modules/william/SensoryCheckInModule.js';
import FamilyChatModule from './modules/FamilyChatModule.js'; 
import DailyBriefingModule from './modules/william/DailyBriefingModule.js';
import QuickReferenceVaultModule from './modules/william/QuickReferenceVaultModule.js'; 
import HabitStreakTrackerModule from './modules/william/HabitStreakTrackerModule.js'; 
import ExpenseTrackerModule from './modules/william/ExpenseTrackerModule.js'; 
import KnowledgeCaptureVaultModule from './modules/william/KnowledgeCaptureVaultModule.js'; 
import RecurringTaskEngineModule from './modules/william/RecurringTaskEngineModule.js'; 
import FinancialSnapshotModule from './modules/william/FinancialSnapshotModule.js'; 
import TaskMatrixModule from './modules/william/TaskMatrixModule.js'; 
import StrategicObjectivesModule from './modules/william/StrategicObjectivesModule.js';
import LiveChatModule from './modules/william/LiveChatModule.js'; 
import SensoryRegulationModule from './modules/william/SensoryRegulationModule.js';
import CockpitModule from './modules/william/CockpitModule.js';
import GenericChecklistModule from './GenericChecklistModule.js';
import { ALL_WILLIAM_MODULES_CONFIG } from '../constants.js';


// Willow's Modules
import WillowChecklistModule from './modules/willow/WillowChecklistModule.js';
import WillowGemCollectorModule from './modules/willow/WillowGemCollectorModule.js';

// Sebastian's Modules
import SebastianChecklistModule from './modules/sebastian/SebastianChecklistModule.js';
import SebastianGemCollectorModule from './modules/sebastian/SebastianGemCollectorModule.js';

// Co-Parenting Modules
import AICommunicationCoachModule from './modules/co-parenting/AICommunicationCoachModule.js';
import SharedCalendarModule from './modules/co-parenting/SharedCalendarModule.js';
import SharedFamilyLogModule from './modules/co-parenting/SharedFamilyLogModule.js';
import SharedChildProfileModule from './modules/co-parenting/SharedChildProfileModule.js';
import SharedExpenseTrackerModule from './modules/co-parenting/SharedExpenseTrackerModule.js';
import HandoffReportModule from './modules/co-parenting/HandoffReportModule.js';
import GoogleWorkspaceShowcaseModule from './modules/google/GoogleWorkspaceShowcaseModule.js';

// Shared Kids' Modules
import RewardStoreModule from './modules/RewardStoreModule.js';
import DirectMessageModule from './modules/DirectMessageModule.js';
import FamilyModeStatusModule from './modules/FamilyModeStatusModule.js'; 
import QuestLogModule from './modules/kids/QuestLogModule.js';


const staticComponentMap = {
    // William
    'day-progress-bar-module': DayProgressBarModule,
    'status-tracker-module': StatusTrackerModule,
    'kids-tracker-module': KidsTrackerModule,
    'wonky-ai-module': WonkyAIModule,
    'achievement-tracker-module': AchievementTrackerModule,
    'active-sops-display-module': ActiveSopsDisplayModule,
    'active-sops-selector-module': ActiveSopsSelectorModule,
    'pomodoro-timer-module': PomodoroTimerModule,
    'sensory-check-in-module': SensoryCheckInModule,
    'daily-briefing-module': DailyBriefingModule,
    'quick-reference-vault-module': QuickReferenceVaultModule, 
    'habit-streak-tracker-module': HabitStreakTrackerModule, 
    'expense-tracker-module': ExpenseTrackerModule, 
    'knowledge-capture-vault-module': KnowledgeCaptureVaultModule, 
    'recurring-task-engine-module': RecurringTaskEngineModule, 
    'financial-snapshot-module': FinancialSnapshotModule, 
    'task-matrix-module': TaskMatrixModule, 
    'strategic-objectives-module': StrategicObjectivesModule,
    'live-chat-module': LiveChatModule, 
    'family-chat-module': FamilyChatModule, 
    'sensory-regulation-module': SensoryRegulationModule,
    'cockpit-module': CockpitModule,

    // Willow
    'willow-checklist-module': WillowChecklistModule,
    'willow-gem-collector-module': WillowGemCollectorModule,

    // Sebastian
    'sebastian-checklist-module': SebastianChecklistModule,
    'sebastian-gem-collector-module': SebastianGemCollectorModule,

    // Shared Kids
    'reward-store-module': RewardStoreModule,
    'direct-message-module': DirectMessageModule,
    'family-mode-status-module': FamilyModeStatusModule,
    'quest-log-module': QuestLogModule,

    // Co-Parenting
    'ai-communication-coach-module': AICommunicationCoachModule,
    'shared-calendar-module': SharedCalendarModule,
    'shared-family-log-module': SharedFamilyLogModule,
    'shared-child-profile-module': SharedChildProfileModule,
    'shared-expense-tracker-module': SharedExpenseTrackerModule,
    'handoff-report-module': HandoffReportModule,
    'google-workspace-showcase': GoogleWorkspaceShowcaseModule,
};

// Dynamically generate mappings for checklist modules
const checklistModuleMappings = ALL_WILLIAM_MODULES_CONFIG
    .filter(module => module.id.startsWith('checklist-module-'))
    .reduce((acc, module) => {
        const sourceDocument = module.name.replace('Checklist: ', '');
        // Create a new component on the fly that passes the correct prop
        acc[module.id] = (props) => React.createElement(GenericChecklistModule, { ...props, sourceDocument });
        return acc;
    }, {});


export const componentMap = {
    ...staticComponentMap,
    ...checklistModuleMappings,
};