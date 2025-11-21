import React, { useState, useEffect } from 'react';
import { useAppState } from '@contexts/AppStateContext';
import { Button } from './Button';
import { generateId } from '@utils/generateId';
import type { ProfileStack } from '../types';

const personas = ['william', 'willow', 'sebastian'];
const audioOptions = ['none', 'brown_noise', 'pink_noise', 'white_noise', 'lofi_beats', 'nature_sounds'];
const visualOptions = ['none', 'dim_lights', 'dark_mode', 'full_spectrum_light'];
const oralOptions = ['none', 'chew', 'sip', 'hum', 'sing'];

const ProfileStackBuilder = () => {
    const { appState, dispatch } = useAppState();
    const profileStacks = appState?.profileStacks ?? [];
    const activeProfileStackId = appState?.activeProfileStackId ?? null;

    const [editStack, setEditStack] = useState<ProfileStack | null>(null);
    const [stackName, setStackName] = useState('');
    const [persona, setPersona] = useState(personas[0]);
    const [audio, setAudio] = useState(audioOptions[0]);
    const [visual, setVisual] = useState(visualOptions[0]);
    const [oral, setOral] = useState(oralOptions[0]);
    const [notes, setNotes] = useState('');

    useEffect(() => {
        // Reset form when active stack changes or builder is opened/closed
        setEditStack(null);
        setStackName('');
        setPersona(personas[0]);
        setAudio(audioOptions[0]);
        setVisual(visualOptions[0]);
        setOral(oralOptions[0]);
        setNotes('');
    }, [activeProfileStackId]);

    const handleEdit = (stack: ProfileStack) => {
        setEditStack(stack);
        setStackName(stack.name);
        setPersona(stack.persona);
        setAudio(stack.audio);
        setVisual(stack.visual);
        setOral(stack.oral);
        setNotes(stack.notes || '');
    };

    const handleSave = () => {
        if (!stackName.trim()) return;

        const newStack: ProfileStack = {
            id: editStack ? editStack.id : generateId(),
            name: stackName.trim(),
            persona,
            audio,
            visual,
            oral,
            notes,
            createdAt: editStack ? editStack.createdAt : new Date().toISOString(),
        };

        if (editStack) {
            dispatch({ type: 'UPDATE_PROFILE_STACK', payload: newStack });
        } else {
            dispatch({ type: 'ADD_PROFILE_STACK', payload: newStack });
        }

        // Optionally apply the new stack immediately
        dispatch({ type: 'APPLY_PROFILE_STACK', payload: newStack.id });
        dispatch({ type: 'SET_VIEW', payload: 'view-cockpit-module' }); // Return to cockpit
    };

    const handleDelete = (id: string) => {
        if (typeof window !== 'undefined' && window.confirm('Are you sure you want to delete this profile stack?')) {
            dispatch({ type: 'DELETE_PROFILE_STACK', payload: id });
        }
    };

    return (
        <div className="bg-card-dark rounded-lg p-6 border border-gray-700 shadow-lg" data-testid="cockpit-modal">
            <h2 className="text-2xl font-bold text-accent-teal mb-4">Profile Stack Builder</h2>
            <p className="text-gray-300 mb-6">Create or edit your attention and focus profiles.</p>

            <div className="space-y-4 mb-8">
                <div>
                    <label htmlFor="stack-name" className="block text-gray-400 text-sm font-bold mb-2">Stack Name:</label>
                    <input
                        type="text"
                        id="stack-name"
                        data-testid="cockpit-name-input"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 border-gray-700"
                        value={stackName}
                        onChange={(e) => setStackName(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="persona-select" className="block text-gray-400 text-sm font-bold mb-2">Persona:</label>
                    <select
                        id="persona-select"
                        data-testid="cockpit-persona-select"
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 border-gray-700"
                        value={persona}
                        onChange={(e) => setPersona(e.target.value)}
                    >
                        {personas.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="audio-select" className="block text-gray-400 text-sm font-bold mb-2">Audio Stimuli:</label>
                    <select
                        id="audio-select"
                        data-testid="cockpit-audio-select"
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 border-gray-700"
                        value={audio}
                        onChange={(e) => setAudio(e.target.value)}
                    >
                        {audioOptions.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="visual-select" className="block text-gray-400 text-sm font-bold mb-2">Visual Stimuli:</label>
                    <select
                        id="visual-select"
                        data-testid="cockpit-visual-select"
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 border-gray-700"
                        value={visual}
                        onChange={(e) => setVisual(e.target.value)}
                    >
                        {visualOptions.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="oral-select" className="block text-gray-400 text-sm font-bold mb-2">Oral/Tactile Stimuli:</label>
                    <select
                        id="oral-select"
                        data-testid="cockpit-oral-select"
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 border-gray-700"
                        value={oral}
                        onChange={(e) => setOral(e.target.value)}
                    >
                        {oralOptions.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="notes" className="block text-gray-400 text-sm font-bold mb-2">Notes:</label>
                    <textarea
                        id="notes"
                        data-testid="cockpit-notes-input"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-800 border-gray-700 h-24"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </div>
                <Button onClick={handleSave} variant="primary" size="md" data-testid="cockpit-save-apply">
                    {editStack ? 'Update & Apply Stack' : 'Save & Apply Stack'}
                </Button>
                <Button onClick={() => dispatch({ type: 'SET_VIEW', payload: 'view-cockpit-module' })} variant="secondary" size="md" data-testid="cockpit-cancel">
                    Cancel
                </Button>
            </div>

            <hr className="border-gray-700 mb-8" />

            <h3 className="text-xl font-bold text-accent-teal mb-4">Existing Profile Stacks</h3>
            <div className="space-y-4">
                {profileStacks && profileStacks.length > 0 ? (profileStacks.map(stack => (
                    <div key={stack.id} className="bg-gray-800 p-4 rounded-md border border-gray-700 flex justify-between items-center">
                        <div>
                            <p className="font-semibold text-gray-200">{stack.name} ({stack.persona})</p>
                            <p className="text-sm text-gray-400">Audio: {stack.audio}, Visual: {stack.visual}, Oral: {stack.oral}</p>
                        </div>
                        <div className="flex space-x-2">
                            <Button onClick={() => handleEdit(stack)} variant="secondary" size="sm" data-testid={`cockpit-edit-${stack.id}`}>Edit</Button>
                            <Button onClick={() => dispatch({ type: 'APPLY_PROFILE_STACK', payload: stack.id })} variant="success" size="sm" data-testid={`cockpit-apply-${stack.id}`}>Apply</Button>
                            <Button onClick={() => handleDelete(stack.id)} variant="danger" size="sm" data-testid={`cockpit-delete-${stack.id}`}>Delete</Button>
                        </div>
                    </div>
                ))) : (
                    <p className="text-gray-400 italic">No profile stacks created yet.</p>
                )}
            </div>
        </div>
    );
};

export default ProfileStackBuilder;
