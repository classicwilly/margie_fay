import React from 'react';
import { useAppState } from '@contexts/AppStateContext';
import ContentCard from '@components/ContentCard';
import { GroundingRose } from '@components-src/GroundingRose';
import DayProgressBarModule from '@components/modules/DayProgressBarModule';
import StatusTrackerModule from '@components/modules/StatusTrackerModule';

const CommandCenter: React.FC = () => {
  const { appState, dispatch } = useAppState();

  const handleTestAirlock = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch?.({ type: 'SET_SAVED_CONTEXT', payload: { view: 'cockpit', dashboardType: 'william' } });
    dispatch?.({ type: 'SET_CONTEXT_RESTORE_MODAL_OPEN', payload: true });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 pb-24">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary-400 mb-2">The Cockpit</h1>
        <p className="text-text-muted">Systems Online. Frequency Tuned. Welcome back, Pilot.</p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        <ContentCard title="Day Progress">
          <DayProgressBarModule />
        </ContentCard>

        <ContentCard title="🌹 Grounding Rose" showHeader={false} className="flex flex-col items-center justify-center space-y-6">
          <p className="text-text-muted text-sm">Take a moment to ground yourself. Feel the connection.</p>
          <GroundingRose />
        </ContentCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <StatusTrackerModule />
        {appState?.williamDashboardModules?.map((moduleId: string) => (
          <div key={moduleId} className="min-h-[200px]" />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <button type="button" className="px-6 py-3 bg-red-600 text-white font-bold rounded shadow-lg hover:bg-red-700 transition-all active:scale-95" onClick={handleTestAirlock}>
          🛑 Test Airlock Protocol
        </button>
      </div>
    </div>
  );
};

export default CommandCenter;
