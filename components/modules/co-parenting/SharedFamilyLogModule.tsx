


import React, { useState } from 'react';
import { useAppState } from '@contexts/AppStateContext';
import ContentCard from '../../ContentCard.js';


const personaDetails = {
    'william': { name: 'Dad', emoji: '🛠️' },
    'willow': { name: 'Willow', emoji: '🌸' },
    'sebastian': { name: 'Bash', emoji: '🦖' },
    'co-parenting': { name: 'Co-Parent', emoji: '👩‍👧‍👦' },
    'launcher': { name: 'System', emoji: '🌱' },
};

const SharedFamilyLogModule = () => {
    const { appState, dispatch } = useAppState();
    const { familyLogEntries, dashboardType } = appState;
    const [newLogText, setNewLogText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newLogText.trim()) return;

        dispatch({
            type: 'ADD_FAMILY_LOG_ENTRY',
            payload: {
                persona: dashboardType,
                text: newLogText.trim(),
                type: 'log',
            },
        });
        setNewLogText('');
    };
    
    const handleDelete = (id) => {
        // Confirmation could be added here in a real app
        dispatch({ type: 'REMOVE_FAMILY_LOG_ENTRY', payload: id });
    };

    return (
        <ContentCard title="📝 Shared Family Log" titleClassName="text-accent-blue text-xl">
            <p className="text-md text-text-light text-opacity-80 mb-4">
                A persistent log for important, non-urgent information like medication updates, school notes, or agreements.
            </p>
            <form onSubmit={handleSubmit} className="mb-4">
                <textarea
                    value={newLogText}
                    onChange={(e) => setNewLogText(e.target.value)}
                    rows={4}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-text-light placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue"
                    placeholder="Add a new log entry..."
                />
                <button
                    type="submit"
                    className="mt-2 w-full p-2 bg-accent-blue text-background-dark font-bold rounded hover:bg-blue-400 transition-colors"
                >
                    Add Log Entry
                </button>
            </form>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {familyLogEntries.length > 0 ? (
                    familyLogEntries.map(entry => {
                        const details = personaDetails[entry.persona] || personaDetails.launcher;
                        const isHandoff = entry.type === 'handoff';

                        let entryTitle, entryIcon, titleColor;
                        if (isHandoff) {
                            entryTitle = 'Handoff Report';
                            entryIcon = '📋';
                            titleColor = 'text-accent-warning';
                        } else {
                            entryTitle = details.name;
                            entryIcon = details.emoji;
                            titleColor = 'text-accent-teal';
                        }


                        return (
                            <div key={entry.id} className="p-3 bg-gray-800 rounded-lg border border-gray-700">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className={`text-sm font-bold ${titleColor}`}>{entryIcon} {entryTitle}</p>
                                        <p className="text-xs text-gray-400 mb-2">
                                            {new Date(entry.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(entry.id)}
                                        className="text-red-500 hover:text-red-400 text-lg font-bold p-1 leading-none"
                                        aria-label={`Delete log entry from ${new Date(entry.timestamp).toLocaleString()}`}
                                    >
                                        &times;
                                    </button>
                                </div>
                                <p className="text-text-light whitespace-pre-wrap">{entry.text}</p>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-center text-text-light text-opacity-80 p-4">No log entries yet.</p>
                )}
            </div>
        </ContentCard>
    );
};

export default SharedFamilyLogModule;