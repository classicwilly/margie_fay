
import React from 'react';
import GemCollector from '../../GemCollector';
import { useAppState } from '@contexts/AppStateContext';

const SebastianGemCollectorModule = () => {
    const { appState } = useAppState();
    const { collectedGems } = appState;

    return (
        <GemCollector name="Sebastian" collectedGems={collectedGems.sebastian || []} />
    );
};

export default SebastianGemCollectorModule;