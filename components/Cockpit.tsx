import React from 'react';
import { useAppState } from '@contexts/AppStateContext';
import ContentCard from '@components/ContentCard';
import EssentialsTrackerModule from "@components/modules/EssentialsTrackerModule";
import KidsTrackerModule from "@components/modules/KidsTrackerModule";
import { WorkspaceLaunchpadModule } from "@components/modules/WorkspaceLaunchpadModule";
import CriticalTasks from "@components/modules/william/daily-command/CriticalTasks";
import WonkyAIModule from "@components/modules/WonkyAIModule";
import AchievementTrackerModule from "@components/modules/AchievementTrackerModule";
import DayProgressBarModule from '@components/modules/DayProgressBarModule';
import StatusTrackerModule from '@components/modules/StatusTrackerModule';
import { GroundingRose } from '@components/GroundingRose';

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
        <header className="mb-8 text-center">
            <h1 data-testid="command-center-title" className="text-3xl font-bold text-primary-400 mb-2 pt-4">
                The Cockpit
            </h1>
            <p className="text-text-muted">
                Systems Online. Frequency Tuned. Welcome back, Pilot.
            </p>
        </header>

        {/* --- ROW 1: DAY PROGRESS & GROUNDING (Existing) --- */}
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
            <WonkyAIModule />
            <AchievementTrackerModule />
        </div>
        
    </div>
  );
};

export { Cockpit };
export default Cockpit;
