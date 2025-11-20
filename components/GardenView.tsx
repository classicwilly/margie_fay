import React from 'react';
import { useAppState } from '@contexts/AppStateContext';
import { useSystemHealth } from '../hooks/useSystemHealth.js';
import { useNeuroPrefs } from '@contexts/NeurodivergentPreferencesContext';

const LivingSprout = () => {
    const { score, diagnostics, stateColor, stateDescription, sproutState } = useSystemHealth();
    const { dispatch } = useAppState();
    const { prefs } = useNeuroPrefs();

    const SproutIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-32 w-32 ${sproutState === 'healthy' && !prefs.reduceAnimations ? 'animate-glow' : ''} ${stateColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 20V10M12 10C10 10 8 8 8 6s2-4 4-4 4 2 4 4-2 4-4 4z" className={`${sproutState === 'wilted' && !prefs.reduceAnimations ? 'rotate-6' : 'rotate-0'} origin-bottom transition-transform duration-500`} />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 10c2 0 4-2 4-4" />
        </svg>
    );

    const borderColorClass = sproutState === 'healthy' ? 'border-sanctuary-accent' : sproutState === 'wilted' ? 'border-sanctuary-warning' : 'border-sanctuary-border';

    return (
        <div className={`bg-sanctuary-card rounded-lg shadow-md p-6 border-2 flex flex-col items-center ${borderColorClass}`}>
            <h3 className="text-3xl font-bold text-sanctuary-accent mb-2">My Sprout</h3>
            <div className="flex items-center gap-4 my-4">
                 <SproutIcon />
                 <div className="text-center">
                    <p className={`text-6xl font-bold ${stateColor}`}>{score}</p>
                    <p className={`font-semibold ${stateColor}`}>{stateDescription}</p>
                 </div>
            </div>
            <div className="w-full text-left bg-sanctuary-bg font-mono p-4 rounded-md border border-sanctuary-border mb-4 text-xs h-40 overflow-y-auto">
                <h4 className="font-bold text-sanctuary-focus mb-2 blinking-cursor">SYSTEM LOG:</h4>
                <ul className="list-none space-y-1">
                    {diagnostics.slice(0, 5).map((d, i) => (
                        <li key={i} className={`flex items-start ${d.type === 'negative' ? 'text-yellow-300' : 'text-green-400'}`}>
                            <span className="mr-2 flex-shrink-0">{d.type === 'negative' ? '[WARN]' : '[ OK ]'}</span>
                            <span>{d.message}</span>
                        </li>
                    ))}
                    {diagnostics.length === 0 && <li className="text-gray-500">[INFO] No significant data points for analysis.</li>}
                </ul>
            </div>
            <button
                onClick={() => dispatch({ type: 'SET_VIEW', payload: 'operations-control' })}
                className="w-full px-6 py-3 bg-sanctuary-focus text-sanctuary-bg rounded-md hover:bg-blue-400 font-semibold"
            >
                Go to Ops Control
            </button>
        </div>
    );
};

const GardenView = () => {
    return (
        <div className="max-w-5xl mx-auto">
            <header className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-extrabold text-sanctuary-accent mb-4">Your Sprout Garden</h1>
                <p className="text-lg text-sanctuary-text-secondary">
                    A living dashboard reflecting your system's health and connections.
                </p>
            </header>
            
            <section className="mb-12">
                 <div className="max-w-md mx-auto">
                    <LivingSprout />
                 </div>
            </section>

            <section>
                <h2 className="text-3xl font-extrabold text-accent-teal mb-6 text-center">Other Sprouts</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <SproutOverview persona="willow" />
                    <SproutOverview persona="sebastian" />
                </div>
            </section>
        </div>
    );
};

interface SproutOverviewProps {
    persona: 'willow' | 'sebastian';
}

const SproutOverview: React.FC<SproutOverviewProps> = ({ persona }) => {
    const { appState } = useAppState();
    const name = persona === 'willow' ? 'Willow' : 'Sebastian';

    const familyLogEntries = (appState ? (appState as any).familyLogEntries : []) as any[];
    const recentLogEntry = (familyLogEntries ?? []).filter(e => e.persona === persona).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
    const latestLocation = persona === 'willow' ? appState?.kidsWillowLocation : appState?.kidsSebastianLocation;
    if (!appState) {
        return (
            <div className="bg-sanctuary-card rounded-lg shadow-md p-6 border-2 border-sanctuary-border flex flex-col items-center">
                <h3 className="text-xl font-bold text-sanctuary-accent mb-2">{name}'s Sprout</h3>
                <p className="text-gray-400">Waiting for family data...</p>
            </div>
        );
    }

    const score = Math.floor(Math.random() * 50) + 50; // Mock score for now
    const stateColor = score > 70 ? 'text-accent-green' : 'text-sanctuary-warning';
    const stateDescription = score > 70 ? 'Healthy' : 'Needs Attention';

    return (
        <div className="bg-sanctuary-card rounded-lg shadow-md p-6 border-2 border-sanctuary-border flex flex-col items-center">
            <h3 className="text-2xl font-bold text-sanctuary-accent mb-3">{name}'s Sprout</h3>
            <div className="flex items-center gap-4 my-4">
                <span className={`text-5xl font-bold ${stateColor}`}>{score}</span>
                <p className={`font-semibold ${stateColor}`}>{stateDescription}</p>
            </div>
            <div className="w-full text-left bg-sanctuary-bg font-mono p-4 rounded-md border border-sanctuary-border text-xs mb-4">
                <p className="font-bold text-sanctuary-focus mb-2">Status Report:</p>
                <ul className="list-none space-y-1">
                    <li>Location: {latestLocation || 'Unknown'}</li>
                    {recentLogEntry && <li>Latest Update: {recentLogEntry.content}</li>}
                </ul>
            </div>
            <button
                onClick={() => {}}
                className="w-full px-4 py-2 bg-sanctuary-focus text-sanctuary-bg rounded-md hover:bg-blue-400 font-semibold"
            >
                View {name}'s Dashboard
            </button>
        </div>
    );
};

export default GardenView;