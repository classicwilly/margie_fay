// src/MasterIndex.ts
// Comprehensive master source file for easy navigation
// Organized by: Components, Contexts, Hooks, Utilities, Modules

// --- Components ---
export { default as GardenView } from "./components/GardenView";
export { default as DemoPage } from "./DemoPage";
export { default as MarkdownStory } from "./MarkdownStory";
export { default as AIConsentModal } from "./AIConsentModal";
export { default as CriticalTasks } from "./CriticalTasks";
export { default as SopVault } from "./SopVault";
export { default as TodaysAgenda } from "./TodaysAgenda";
export { default as WeeklyReview } from "./WeeklyReview";
export { default as UserSopView } from "./UserSopView";
export { default as GameMasterDashboard } from "./GameMasterDashboard";
export { default as BrainDumpModule } from "./BrainDumpModule";
export { default as AllChecklists } from "./AllChecklists";
export { default as ChecklistItem } from "./ChecklistItem";
export { default as Header } from "./Header";
export { default as WonkyAIModule } from "./WonkyAIModule";
export { default as WonkyAISetupGuide } from "./WonkyAISetupGuide";
// ...add more components as needed

// --- Contexts ---
// export { default as AppStateContext } from './contexts/AppStateContext';
// export { default as OscilloscopeContext } from './contexts/OscilloscopeContext';
// ...add more contexts as needed

// --- Hooks ---
// export { default as useAIConsent } from './hooks/useAIConsent';
// ...add more hooks as needed

// --- Utilities ---
export * from "./constants";
export * from "./defaultStates";
export * from "./types";
// ...add more utilities as needed

// --- Modules ---
export { default as AIBriefing } from "./AIBriefing";
export { default as AICommunicationCoachModule } from "./AICommunicationCoachModule";
export { default as AICorrelationAnalysis } from "./AICorrelationAnalysis";
// ...add more modules as needed

// --- Entry Point ---
export { default as App } from "./App";

// --- README ---
// To add a new module/component/context/hook, simply add its export here.
// This file serves as the master navigation and aggregation point for the codebase.
