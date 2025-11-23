import React from 'react';
import { useAppState } from '@contexts/AppStateContext';
import { KidLocation } from '../types';
import ContentCard from './ContentCard';
import TextInputItem from './TextInputItem';

const StatusButton: React.FC<{
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, isActive, onClick }) => {
    const baseClass = 'px-2 py-1 rounded-md text-xs font-semibold transition-colors w-full break-words';
    const activeClass = 'bg-accent-blue text-background-dark';
    const inactiveClass = 'bg-gray-700 hover:bg-gray-600';
    return (
        <button onClick={onClick} className={`${baseClass} ${isActive ? activeClass : inactiveClass}`}>
            {label}
        </button>
    );
};

const KidStatus: React.FC<{ 
    name: 'Willow' | 'Sebastian';
    idPrefix: string;
    emoji: string;
}> = ({ name, idPrefix, emoji }) => {
    const { appState, dispatch } = useAppState();
    const isWillow = name === 'Willow';
    const location = isWillow ? appState.kidsWillowLocation : appState.kidsSebastianLocation;
    
    const setLocation = (loc: KidLocation) => {
        dispatch({
            type: 'SET_KID_LOCATION',
            payload: { kid: isWillow ? 'willow' : 'sebastian', location: loc }
        });
    };

    return (
        <div>
            <h3 className="text-lg font-semibold text-accent-teal mb-2">{emoji} {name}</h3>
            <div className="grid grid-cols-3 gap-2 mb-3">
                <StatusButton label="At Mom's" isActive={location === "At Mom's"} onClick={() => setLocation("At Mom's")} />
                <StatusButton label="With Me" isActive={location === "With Me"} onClick={() => setLocation("With Me")} />
                <StatusButton label="School/Other" isActive={location === "School/Other"} onClick={() => setLocation("School/Other")} />
            </div>
            <TextInputItem id={`${idPrefix}-note`} label="Note:" placeholder="Quick update..." />
        </div>
    );
};

const KidsTracker: React.FC = () => {
    return (
        <ContentCard title="👨‍👧‍👦 Kids Status">
            <div className="space-y-4">
                <KidStatus name="Willow" idPrefix="kids-willow" emoji="🌸" />
                <div className="border-t border-gray-700"></div>
                <KidStatus name="Sebastian" idPrefix="kids-sebastian" emoji="🦖" />
            </div>
        </ContentCard>
    );
};

export default KidsTracker;