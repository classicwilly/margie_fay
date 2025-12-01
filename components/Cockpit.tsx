import React from 'react';
import { useAppState } from '@contexts/AppStateContext';
import ContentCard from '@components/ContentCard';
import EssentialsTrackerModule from "@components/modules/EssentialsTrackerModule";
import KidsTrackerModule from "@components/modules/KidsTrackerModule";
import { WorkspaceLaunchpadModule } from "@components/modules/WorkspaceLaunchpadModule";
import CriticalTasks from "@components/modules/william/daily-command/CriticalTasks";
import WonkyAIModule from "../WonkyAIModule";
import AchievementTrackerModule from "@components/modules/AchievementTrackerModule";
import DayProgressBarModule from '@components/modules/DayProgressBarModule';
import StatusTrackerModule from '@components/modules/StatusTrackerModule';
import { GroundingRose } from '@components/GroundingRose';
import DeepFocusContainer from '@components/DeepFocusContainer';

const Cockpit: React.FC = () => {
    const { appState, dispatch } = useAppState();

    const handleTestAirlock = (e: React.MouseEvent) => {
        e.preventDefault();
        // Keep the internal view value as 'command-center' to avoid breaking existing logic
        dispatch?.({ type: 'SET_SAVED_CONTEXT', payload: { view: 'command-center', dashboardType: 'william' } });
        dispatch?.({ type: 'SET_CONTEXT_RESTORE_MODAL_OPEN', payload: true });
    };

    return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 pb-24">
        
        {/* Header (Top) */}
        <DeepFocusContainer active={appState?.isFocusModeActive}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div className="text-left mb-4 md:mb-0">
                <p className="text-primary-300 font-mono text-sm">PROTOCOL 11-22-44 // INTEGRITY CHECK</p>
                <h1 className="text-5xl font-bold text-accent-400 mt-2">DAY <span className="text-white">36,525</span></h1>
                <p className="text-text-muted mt-2">● 0 CONFIRMED VICTORIES</p>
            </div>
            <div className="text-right md:text-right flex flex-col items-end">
                <div className="bg-primary-dark-300 p-4 rounded-lg shadow-neon-sm border border-primary-dark-200 mb-4 max-w-xs w-full">
                    <h2 className="text-md font-semibold text-primary-300">FIELD REPORT</h2>
                    <p className="text-text-light italic mt-1">Fog of War. Visibility low. Rely on instruments.</p>
                </div>
                <div className="bg-primary-dark-300 px-4 py-2 rounded-full shadow-neon-sm border border-primary-dark-200 flex items-center space-x-2">
                    <span className="text-sm text-text-muted font-mono">FREE FLIGHT</span>
                    <span className="text-lg text-accent-500 font-bold">Deep Focus</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap text-accent-500"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                </div>
            </div>
        </div>
        </DeepFocusContainer>

        {/* --- ROW 1: AUCTION (Ask Grandma) --- */}
        <ContentCard showHeader={false} className="w-full">
            <WonkyAIModule />
        </ContentCard>

        {/* --- ROW 2: DAY PROGRESS & GROUNDING (Existing) --- */}
        <div className="grid grid-cols-1 gap-6">
            <ContentCard showHeader={false}>
                <h2 className="text-xl font-semibold text-primary-300 mb-4">Day Progress</h2>
                <DayProgressBarModule />
            </ContentCard>

            <ContentCard showHeader={false} className="flex flex-col items-center justify-center space-y-6">
                <p className="text-text-muted text-sm">
                    Take a moment to ground yourself. Feel the connection.
                </p>
                <GroundingRose />
            </ContentCard>
        </div>

        {/* --- ROW 2: STATUS TRACKERS (Missing in UI) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* The modules are rendered here in parallel */}
            <StatusTrackerModule />
            <EssentialsTrackerModule />
            <KidsTrackerModule />
        </div>

        {/* --- ROW 3: WORK & CRITICAL TASKS (Missing in UI) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ContentCard title="🚀 Workspace Launchpad">
                <WorkspaceLaunchpadModule />
                {/* Note: The Test Airlock and Apothecary buttons will go here */}
                <div className="mt-4 flex gap-2">
                    <button 
                        data-testid="test-airlock-btn"
                        type="button"
                        className="px-6 py-3 bg-red-600 text-white font-bold rounded shadow-lg transition-all active:scale-95"
                        onClick={handleTestAirlock}
                    >
                        🛑 Test Airlock Protocol
                    </button>
                    <button 
                        type="button"
                        className="px-6 py-3 bg-indigo-600 text-white font-bold rounded shadow-lg transition-all active:scale-95"
                        onClick={() => dispatch({ type: 'SET_VIEW', payload: 'bio-hacks' })}
                    >
                        💊 The Apothecary
                    </button>
                </div>
            </ContentCard>
            <CriticalTasks />
        </div>

        {/* --- ROW 4: AI & ACHIEVEMENT --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AchievementTrackerModule />
        </div>
        
    </div>
  );
};

export { Cockpit };
export default Cockpit;
