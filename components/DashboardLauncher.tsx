import React from 'react';
import { useAppState } from '@contexts/AppStateContext';
import { ALL_WILLIAM_MODULES_CONFIG } from '../constants';
import ModuleIcon from './ModuleIcon';

const DashboardLauncher = () => {
    const { appState, dispatch } = useAppState();
    const { williamDashboardModules } = appState;

    const handleLaunch = (moduleId) => {
        dispatch({ type: 'SET_VIEW', payload: `view-${moduleId}` });
    };

    const coreModules = ['daily-briefing-module', 'task-matrix-module'];
    const enabledRemovableModules = williamDashboardModules.filter(id => !coreModules.includes(id));
    
    return (
        <div className="bg-card-dark rounded-lg p-4 border border-gray-700">
            <h2 className="font-bold text-accent-teal text-lg mb-4 text-center">Module Launcher</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {/* Core Modules First */}
                {coreModules.map(moduleId => {
                    const module = ALL_WILLIAM_MODULES_CONFIG.find(m => m.id === moduleId);
                    if (!module) return null;
                    return (
                        <ModuleIcon
                            key={module.id}
                            id={module.id}
                            iconPath={module.icon}
                            label={module.name}
                            onClick={() => handleLaunch(module.id)}
                        />
                    );
                })}

                {/* Then enabled removable modules */}
                 {enabledRemovableModules.map(moduleId => {
                    const module = ALL_WILLIAM_MODULES_CONFIG.find(m => m.id === moduleId);
                    if (!module) return null;
                    return (
                        <ModuleIcon
                            key={module.id}
                            id={module.id}
                            iconPath={module.icon}
                            label={module.name}
                            onClick={() => handleLaunch(module.id)}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default DashboardLauncher;