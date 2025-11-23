


import React, { useState } from 'react';
import { useAppState } from '@contexts/AppStateContext';
import ContentCard from '../../ContentCard.js';
import SensoryOverloadModal from '../../SensoryOverloadModal.js';

const SenseButton = ({ label, isActive, onClick }) => {
    const baseClass = 'px-2 py-1 rounded-md text-xs font-semibold transition-colors w-full break-words';
    
    const colorClasses = {
        'Under': 'bg-blue-800/80 text-blue-200',
        'OK': 'bg-green-800/80 text-green-200',
        'Over': 'bg-red-800/80 text-red-200',
    };

    const activeClass = label ? colorClasses[label] : '';
    const inactiveClass = 'bg-gray-700 hover:bg-gray-600';
    
    return (
        <button onClick={onClick} className={`${baseClass} ${isActive ? activeClass : inactiveClass}`}>
            {label}
        </button>
    );
};

const SensoryRow = ({ sense, label, emoji, onOverload }) => {
    const { appState, dispatch } = useAppState();
    const currentValue = appState.sensoryState[sense];

    const setSenseValue = (value) => {
        dispatch({ type: 'SET_SENSORY_STATE', payload: { sense, value } });
        if (value === 'Over') {
            onOverload();
        }
    };

    return (
        <div className="flex items-center gap-4">
            <h4 className="font-semibold text-accent-teal w-16 flex-shrink-0">{emoji} {label}</h4>
            <div className="grid grid-cols-3 gap-2 w-full">
                <SenseButton label="Under" isActive={currentValue === 'Under'} onClick={() => setSenseValue('Under')} />
                <SenseButton label="OK" isActive={currentValue === 'OK'} onClick={() => setSenseValue('OK')} />
                <SenseButton label="Over" isActive={currentValue === 'Over'} onClick={() => setSenseValue('Over')} />
            </div>
        </div>
    );
};


const SensoryCheckInModule = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <SensoryOverloadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <ContentCard title="🌡️ Sensory Check-in">
                 <p className="text-sm text-text-light text-opacity-80 mb-4">
                    Quickly log your current sensory state. Tap a selection again to clear it.
                </p>
                <div className="space-y-3">
                    <SensoryRow sense="sound" label="Sound" emoji="🔊" onOverload={() => setIsModalOpen(true)} />
                    <SensoryRow sense="sight" label="Sight" emoji="👁️" onOverload={() => setIsModalOpen(true)} />
                    <SensoryRow sense="touch" label="Touch" emoji="🤚" onOverload={() => setIsModalOpen(true)} />
                </div>
            </ContentCard>
        </>
    );
};

export default SensoryCheckInModule;