

import React from 'react';
import { useAppState } from '@contexts/AppStateContext';
import { componentMap } from './componentMap.js';

const WillowsDashboard = () => {
  const { appState, dispatch } = useAppState();
  const { willowDashboardModules, isModMode } = appState;

  const handleCustomizeDashboard = () => {
    dispatch({ type: 'SET_VIEW', payload: 'willow-dashboard-builder' });
  };

  const getGridColsClass = (count) => {
    if (count <= 1) return 'grid-cols-1';
    return 'grid-cols-1 md:grid-cols-2'; 
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <header className="text-center mb-12 relative">
        <h1 className="text-5xl font-extrabold text-gradient-accent drop-shadow-lg mb-3 animate-glow">🌸 Willow's Dashboard</h1>
        <p className="text-lg text-text-light text-opacity-90 font-medium mb-2">Your personalized Flight Protocols. Predictability and fun.</p>
        {isModMode && (
          <button
            onClick={handleCustomizeDashboard}
            className="absolute top-0 right-0 mt-2 px-5 py-2 btn-neon font-semibold rounded-md animate-neon text-sm"
            aria-label="Customize Dashboard Modules"
          >
            Customize Dashboard
          </button>
        )}
      </header>

      {/* Always render Dopamine Mining and Reward Store modules visibly for E2E and user clarity */}
      <div className="grid gap-8 mb-8">
        <h2 className="text-3xl font-bold text-neon-green mb-4 animate-glow" data-testid="kids-corner-heading">Kids Corner</h2>
        <div className="card-base shadow-neon border-neon-green mb-4">
          <h2 className="text-2xl font-bold text-neon-blue mb-2 animate-neon" data-testid="kids-gem-collection">Dopamine Cache</h2>
          {(() => {
            const GemCollector = componentMap['willow-gem-collector-module'];
            return GemCollector ? <GemCollector /> : null;
          })()}
        </div>
        <div className="card-base shadow-neon border-neon-pink">
          <h2 className="text-2xl font-bold text-neon-pink mb-2 animate-neon" data-testid="kids-reward-store">Dopamine Mining</h2>
          {(() => {
            const RewardStore = componentMap['reward-store-module'];
            return RewardStore ? <RewardStore /> : null;
          })()}
        </div>
      </div>

      <div className={`grid gap-8 ${getGridColsClass(willowDashboardModules.length)}`}> 
        {willowDashboardModules.map(moduleId => {
          const ModuleComponent = componentMap[moduleId];
          if (!ModuleComponent) return null;
          return (
            <div key={moduleId} className="card-base shadow-neon border-neon-green mb-4">
              <ModuleComponent />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WillowsDashboard;
export { WillowsDashboard };