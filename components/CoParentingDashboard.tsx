

import React from 'react';
import { useAppState } from '@contexts/AppStateContext';
import { componentMap } from './componentMap.js';
import { Button } from './Button';

const CoParentingDashboard = () => {
  const { appState, dispatch } = useAppState();
  const { coParentingDashboardModules, isModMode } = appState;

  const handleCustomizeDashboard = () => {
    dispatch({ type: 'SET_VIEW', payload: 'co-parenting-dashboard-builder' });
  };

  const handleViewProtocol = () => {
    dispatch({ type: 'SET_VIEW', payload: 'co-parenting-communication-protocol' });
  };

  const enabledModules = coParentingDashboardModules
    .map(moduleId => componentMap[moduleId])
    .filter(Boolean);

  const getGridColsClass = (count) => {
    if (count <= 1) return 'grid-cols-1';
    return 'grid-cols-1 md:grid-cols-2';
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <header className="text-center mb-12 relative">
        <h1 className="text-5xl font-extrabold text-gradient-accent drop-shadow-lg mb-3 animate-glow">Co-Parenting Hub</h1>
        <p className="text-lg text-text-light text-opacity-90 font-medium mb-2">A structured toolkit for low-friction, high-clarity communication and logistics. Facts, not feelings.</p>
        <div className="mt-6">
            <Button
                onClick={handleViewProtocol}
                className="flex items-center mx-auto btn-neon animate-neon"
                variant="primary"
                aria-label="View the Co-Parenting Communication Protocol"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2H10zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2H10z" clipRule="evenodd" />
                </svg>
                View Communication Protocol
            </Button>
        </div>
        {isModMode && (
          <Button
            onClick={handleCustomizeDashboard}
            className="absolute top-0 right-0 mt-2 px-5 py-2 btn-neon font-semibold rounded-md animate-neon text-sm"
            variant="primary"
            aria-label="Customize Dashboard Modules"
          >
            Customize Dashboard
          </Button>
        )}
      </header>

      <div className={`grid gap-8 ${getGridColsClass(enabledModules.length)}`}> 
        {coParentingDashboardModules.map(moduleId => {
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

export default CoParentingDashboard;