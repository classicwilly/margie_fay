import React from 'react';
import { useAppState } from '@contexts/AppStateContext';
import { Mood, Energy } from '../types';
import ContentCard from './ContentCard';

const StatusButton: React.FC<{
    label: string;
    isActive: boolean;
    onClick: () => void;
    activeClass?: string;
}> = ({ label, isActive, onClick, activeClass = 'bg-accent-blue text-white' }) => {
    const baseClass = 'px-3 py-1 rounded-md text-sm font-semibold transition-colors w-full break-words';
    const inactiveClass = 'bg-gray-700 hover:bg-gray-600';
    return (
        <button onClick={onClick} className={`${baseClass} ${isActive ? activeClass : inactiveClass}`}>
            {label}
        </button>
    );
};

const StatusTracker: React.FC = () => {
    const { appState, dispatch } = useAppState();

    const setMood = (mood: Mood) => dispatch({ type: 'SET_MOOD', payload: mood });
    const setEnergy = (energy: Energy) => dispatch({ type: 'SET_ENERGY', payload: energy });

    return (
        <ContentCard title="👤 Personal Status">
            <div className="space-y-4">
                <div>
                    <h3 className="text-md font-semibold text-accent-teal mb-2">🔋 Voltage</h3>
                    <div className="grid grid-cols-3 gap-2">
                        <StatusButton label="Focused" isActive={appState.statusMood === 'Focused'} onClick={() => setMood('Focused')} activeClass="bg-accent-green text-background-dark" />
                        <StatusButton label="Calm" isActive={appState.statusMood === 'Calm'} onClick={() => setMood('Calm')} activeClass="bg-accent-blue text-background-dark" />
                        <StatusButton label="Overwhelmed" isActive={appState.statusMood === 'Overwhelmed'} onClick={() => setMood('Overwhelmed')} activeClass="bg-red-700 text-white" />
                    </div>
                </div>
                      <div>
                          <h3 className="text-md font-semibold text-accent-teal mb-2">📡 Frequency</h3>
                    <div className="grid grid-cols-3 gap-2">
                        <StatusButton label="High" isActive={appState.statusEnergy === 'High'} onClick={() => setEnergy('High')} activeClass="bg-accent-green text-background-dark" />
                        <StatusButton label="Medium" isActive={appState.statusEnergy === 'Medium'} onClick={() => setEnergy('Medium')} activeClass="bg-yellow-500 text-background-dark" />
                        <StatusButton label="Low" isActive={appState.statusEnergy === 'Low'} onClick={() => setEnergy('Low')} activeClass="bg-red-700 text-white" />
                    </div>
                </div>
            </div>
        </ContentCard>
    );
};

export default StatusTracker;