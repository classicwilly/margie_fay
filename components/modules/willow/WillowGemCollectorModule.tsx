
import React from 'react';
import GemCollector from '../../GemCollector'; // Adjusted path
import { useAppState } from '@contexts/AppStateContext';

const WillowGemCollectorModule = () => {
    const { appState } = useAppState();
    const { collectedGems } = appState;

    return (
        <GemCollector name="Willow" collectedGems={collectedGems.willow || []} />
    );
};

export default WillowGemCollectorModule;