


import React from 'react';
import { useAppState } from '@contexts/AppStateContext';
import ContentCard from '../ContentCard.js';
import GoogleEmoji from '@components/GoogleEmoji';
import { ALL_GEMS } from '../../constants.js';

const GemAdminModule = ({ persona }) => {
    const { appState, dispatch } = useAppState();
    const collectedGems = appState.collectedGems[persona] || [];

    const handleAward = (gemId) => {
        dispatch({ type: 'ADD_GEM', payload: { id: gemId, recipient: persona } });
    };

    const handleRevoke = (gemId) => {
        dispatch({ type: 'REMOVE_GEM', payload: { id: gemId, recipient: persona } });
    };

    return (
        <ContentCard title={<><GoogleEmoji symbol={'⚙️'} size={20} className="mr-2" />Gem Administration for {persona.charAt(0).toUpperCase() + persona.slice(1)}</>} titleClassName="text-accent-warning text-xl">
            <p className="text-sm text-text-light text-opacity-80 mb-4">
                Manually award or revoke gems. This is an administrative tool and is only visible in Mod Mode.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-80 overflow-y-auto pr-2">
                {ALL_GEMS.map(gem => {
                    const isCollected = collectedGems.includes(gem.id);
                    return (
                        <div key={gem.id} className={`p-2 rounded-lg border flex flex-col items-center ${isCollected ? 'bg-accent-green/10 border-accent-green/30' : 'bg-gray-800 border-gray-700'}`}>
                            <div className="text-3xl"><GoogleEmoji symbol={gem.emoji} size={28} /></div>
                            <span className="text-xs text-center mt-1">{gem.label}</span>
                            <div className="flex gap-2 mt-2">
                                <button 
                                    onClick={() => handleAward(gem.id)}
                                    disabled={isCollected}
                                    className="px-2 py-1 text-xs font-semibold rounded bg-accent-blue text-background-dark disabled:bg-gray-600 disabled:cursor-not-allowed"
                                >
                                    Award
                                </button>
                                <button 
                                    onClick={() => handleRevoke(gem.id)}
                                    disabled={!isCollected}
                                    className="px-2 py-1 text-xs font-semibold rounded bg-red-800/80 text-red-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
                                >
                                    Revoke
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </ContentCard>
    );
};

export default GemAdminModule;