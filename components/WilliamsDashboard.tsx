import React from 'react';
import { useAppState } from '@contexts/AppStateContext';
import { useSystemHealth } from '../hooks/useSystemHealth';
import { DailyBriefingModule } from './modules/william/DailyBriefingModule.tsx';
import DashboardLauncher from './DashboardLauncher';
import SystemNudgeModule from './modules/william/SystemNudgeModule';
import { Button } from './Button';
import { useProactiveAI } from '../hooks/useProactiveAI';
import CockpitModule from '../src/components/CockpitModule';
import ProfileStackBuilder from '../src/components/ProfileStackBuilder';

const WilliamsDashboard = () => {
    const { appState, dispatch } = useAppState();
    const { statusMood, statusEnergy } = appState;
    const { score, stateColor } = useSystemHealth();
    const nudges = useProactiveAI(appState, dispatch);

    const handleCustomizeDashboard = () => {
        dispatch({ type: 'SET_VIEW', payload: 'william-dashboard-builder' });
    };

    const handleDismissNudge = (nudgeId) => {
        dispatch({ type: 'DISMISS_NUDGE', payload: nudgeId });
    };
    
    return (
        <div className="max-w-7xl mx-auto">
            <header className="flex flex-col sm:flex-row justify-between sm:items-center text-center sm:text-left mb-10 gap-4">
                <div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-sanctuary-accent">Operations Control</h1>
                    <p className="text-lg text-sanctuary-text-secondary mt-2">
                        Systems Online. Frequency Tuned. Welcome back, Pilot.
                    </p>
                </div>
                {appState.isModMode && (
                    <Button onClick={handleCustomizeDashboard} variant="primary" size="sm" aria-label="Customize Dashboard Modules">Customize Dashboard</Button>
                )}
            </header>

            {nudges.length > 0 && (
                <div className="mb-8">
                    <SystemNudgeModule nudge={nudges[0]} onDismiss={handleDismissNudge} />
                </div>
            )}

            {appState.view === 'view-cockpit-module' && <CockpitModule />}
            {appState.view === 'profile-stack-builder' && <ProfileStackBuilder />}

            {!(appState.view === 'view-cockpit-module' || appState.view === 'profile-stack-builder') && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Vitals and Module Launcher */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-sanctuary-card rounded-lg p-4 border border-sanctuary-border">
                            <h2 className="font-bold text-sanctuary-accent text-lg mb-3 text-center">System Vitals</h2>
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div>
                                    <p className={`text-4xl font-bold ${stateColor}`}>{score}</p>
                                    <p className="text-xs font-semibold text-sanctuary-text-secondary">Health</p>
                                </div>
                                <div>
                                    <p className="text-4xl">🧠</p>
                                    <p className="text-xs font-semibold text-sanctuary-text-secondary">{statusMood || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-4xl">🔌</p>
                                    <p className="text-xs font-semibold text-sanctuary-text-secondary">{statusEnergy || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                        <DashboardLauncher />
                    </div>
                    
                    {/* Right Column: Daily Command Module */}
                    <div className="lg:col-span-2">
                        <DailyBriefingModule />
                    </div>
                </div>
            )}
        </div>
    );
};

export default WilliamsDashboard;