


import React, { useState, useEffect } from 'react';
import { useAppState } from '@contexts/AppStateContext';
import ContentCard from '../../ContentCard.js';
// FIX: Import ChildProfile type.
import type { ChildProfile } from '../../../types.js';


const ProfileField = ({ label, value, onChange }: { label: string, value: string, onChange: (value: string) => void }) => {
    const [localValue, setLocalValue] = useState(value);
    // Provide a stable id for textarea/label association to improve accessibility
    const [inputId] = useState(() => `profile-field-${label.toLowerCase().replace(/[^a-z0-9]+/g,'-')}-${Math.random().toString(36).slice(2,8)}`);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const handleBlur = () => {
        setIsEditing(false);
        if (localValue !== value) {
            onChange(localValue);
        }
    };

    return (
        <div>
            <label htmlFor={inputId} className="text-sm font-semibold text-accent-teal">{label}</label>
            {isEditing ? (
                <textarea
                    id={inputId}
                    value={localValue}
                    onChange={(e) => setLocalValue(e.target.value)}
                    onBlur={handleBlur}
                    rows={3}
                    className="w-full p-2 mt-1 bg-gray-900 border border-gray-600 rounded-md text-sm"
                    autoFocus
                />
            ) : (
                <div
                    onClick={() => setIsEditing(true)}
                    className="w-full p-2 mt-1 bg-gray-800 rounded-md min-h-[40px] whitespace-pre-wrap text-sm cursor-pointer border border-transparent hover:border-accent-blue"
                >
                    {value || <span className="text-gray-500 italic">Click to edit...</span>}
                </div>
            )}
        </div>
    );
};


const ChildProfileCard = ({ name, emoji, profile }: { name: string, emoji: string, profile: ChildProfile }) => {
    const { dispatch } = useAppState();

    const handleUpdate = (field: keyof ChildProfile, value: string) => {
        dispatch({
            type: 'UPDATE_CHILD_PROFILE',
            payload: {
                persona: name.toLowerCase(),
                profileData: { [field]: value },
            },
        });
    };

    return (
        <div className="p-4 bg-card-dark rounded-lg border border-gray-700 space-y-3">
            <h3 className="text-xl font-bold text-accent-green">{emoji} {name}</h3>
            <ProfileField label="Allergies & Medical Notes" value={profile.allergies} onChange={(val) => handleUpdate('allergies', val)} />
            <ProfileField label="Current Medications" value={profile.medications} onChange={(val) => handleUpdate('medications', val)} />
            <ProfileField label="Emergency Contacts" value={profile.emergencyContacts} onChange={(val) => handleUpdate('emergencyContacts', val)} />
            <ProfileField label="School Information" value={profile.schoolInfo} onChange={(val) => handleUpdate('schoolInfo', val)} />
        </div>
    );
};


const SharedChildProfileModule = () => {
    const { appState } = useAppState();
    const { childProfiles } = appState;

    return (
        <ContentCard title="👧‍👦 Shared Child Profiles" titleClassName="text-accent-blue text-xl">
             <p className="text-md text-text-light text-opacity-80 mb-4">
                A single source of truth for critical information. Click any field to edit. Changes are saved automatically.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ChildProfileCard name="Willow" emoji="🌸" profile={childProfiles.willow} />
                <ChildProfileCard name="Sebastian" emoji="🦖" profile={childProfiles.sebastian} />
            </div>
        </ContentCard>
    );
};

export default SharedChildProfileModule;