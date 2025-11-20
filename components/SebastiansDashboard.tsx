

import React from 'react';
import { useAppState } from '@contexts/AppStateContext';
import { componentMap } from './componentMap.js';

const SebastiansDashboard = () => {
  const { appState, dispatch } = useAppState();
  const { sebastianDashboardModules, isModMode } = appState;

  const handleCustomizeDashboard = () => {
    dispatch({ type: 'SET_VIEW', payload: 'sebastian-dashboard-builder' });
  };

  const getGridColsClass = (count) => {
    if (count <= 1) return 'grid-cols-1';
    return 'grid-cols-1 md:grid-cols-2'; 
  };

  return (
    <div className="max-w-5xl mx-auto">
      <header className="text-center mb-10 relative">
        <h1 className="text-4xl md:text-5xl font-extrabold text-accent-teal mb-4">🦖 Bash's Dashboard</h1>
        <p className="text-lg text-text-light text-opacity-80">
          Your personalized Flight Protocols. Adventure with structure.
        </p>
        {isModMode && (
          <button
            onClick={handleCustomizeDashboard}
            className="absolute top-0 right-0 mt-2 px-4 py-2 bg-accent-blue text-background-dark font-semibold rounded-md hover:bg-blue-400 transition-colors duration-200 text-sm"
            aria-label="Customize Dashboard Modules"
          >
            Customize Dashboard
          </button>
        )}
      </header>

        {/* Always render Dopamine Mining and Reward Store modules visibly for E2E and user clarity */}
        <div className="grid gap-6 mb-6">
          <h2 className="text-3xl font-bold text-accent-teal mb-4" data-testid="kids-corner-heading">Kids Corner</h2>
          <div>
            <h2 className="text-2xl font-bold text-accent-teal mb-2">Dopamine Cache</h2>
            <componentMap['sebastian-gem-collector-module'] />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-accent-teal mb-2">Dopamine Mining</h2>
            <componentMap['reward-store-module'] />
          </div>
        </div>

      <div className={`grid gap-6 ${getGridColsClass(sebastianDashboardModules.length)}`}>
        {sebastianDashboardModules.map(moduleId => {
          const ModuleComponent = componentMap[moduleId];
          if (!ModuleComponent) return null;
          return (
            <ModuleComponent 
              key={moduleId} 
            />
          );
        })}
      </div>
      
    </div>
  );
};

export default SebastiansDashboard;