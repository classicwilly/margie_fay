import React from 'react';
import { useAppState } from '@contexts/AppStateContext';
import Button from './Button';

const CockpitModule = () => {
    const { appState, dispatch } = useAppState();
    const { activeProfileStackId, profileStacks } = appState;

    const activeStack = profileStacks?.find(s => s.id === activeProfileStackId);

    const handleOpenBuilder = () => {
        // Dispatch an action to open the profile stack builder view
        // For now, this will be a placeholder view
        dispatch({ type: 'SET_VIEW', payload: 'profile-stack-builder' });
    };

    return (
        <div className="bg-card-dark rounded-lg p-6 border border-gray-700 shadow-lg">
            <h2 className="text-2xl font-bold text-accent-teal mb-4">Cockpit: Profile Stacks</h2>
            <p className="text-gray-300 mb-6">Manage your attention and focus profiles.</p>

            {activeStack ? (
                <div data-testid="cockpit-active-stack" className="bg-sanctuary-blue/20 p-4 rounded-md mb-4 border border-sanctuary-blue text-sanctuary-blue-text">
                    <h3 className="font-semibold text-lg mb-2">Active Stack: {activeStack.name}</h3>
                    <p className="text-sm">Persona: {activeStack.persona}</p>
                    <p className="text-sm">Audio: {activeStack.audio}</p>
                    <p className="text-sm">Visual: {activeStack.visual}</p>
                    <p className="text-sm">Oral: {activeStack.oral}</p>
                    {activeStack.notes && <p className="text-sm mt-2 italic">"{activeStack.notes}"</p>}
                </div>
            ) : (
                <div data-testid="cockpit-active-stack" className="text-gray-400 italic mb-4">No active profile stack selected.</div>
            )}

            <Button
                onClick={handleOpenBuilder}
                variant="primary"
                size="md"
                data-testid="cockpit-open-builder"
            >
                Open Profile Stack Builder
            </Button>
        </div>
    );
};

export default CockpitModule;
