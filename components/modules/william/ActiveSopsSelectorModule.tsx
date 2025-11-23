


import React from 'react';
import { useAppState } from '@contexts/AppStateContext';
import { SOP_DATA } from '../../../constants.js';
import ContentCard from '../../ContentCard.js';

const ActiveSopsSelectorModule = () => {
    const { appState, dispatch } = useAppState();
    const { activeSops, userSops, modifiedSops } = appState;

    const allSops = React.useMemo(() =>
        SOP_DATA.map(sop => modifiedSops[sop.id] || sop).concat(userSops),
        [modifiedSops, userSops]
    );

    const handleToggleSop = (sopId) => {
        const newActiveSops = activeSops.includes(sopId)
            ? activeSops.filter(id => id !== sopId)
            : [...activeSops, sopId];
        dispatch({ type: 'SET_ACTIVE_SOPS', payload: newActiveSops });
    };

    return (
        <ContentCard title="Active SOP Selector">
            <p className="text-sm text-text-light text-opacity-80 mb-4">
                Select protocols to display on your dashboard for quick access during your current mode.
            </p>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {allSops.map((sop) => (
                    <label key={sop.id} htmlFor={`sop-toggle-${sop.id}`} className="flex items-center p-2 bg-gray-800 rounded-md hover:bg-gray-700 cursor-pointer">
                        <input
                            id={`sop-toggle-${sop.id}`}
                            type="checkbox"
                            checked={activeSops.includes(sop.id)}
                            onChange={() => handleToggleSop(sop.id)}
                            className="h-5 w-5 rounded bg-gray-700 border-gray-600 text-accent-blue focus:ring-accent-blue focus:ring-offset-background-dark focus:ring-2 mr-3 flex-shrink-0"
                        />
                        <span className="font-semibold text-text-light">{sop.title}</span>
                    </label>
                ))}
            </div>
        </ContentCard>
    );
};

export default ActiveSopsSelectorModule;