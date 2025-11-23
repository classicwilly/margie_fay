import React, { useEffect } from 'react';
import { useOscilloscope } from '../context/OscilloscopeContext';

interface Props {
    children: React.ReactNode;
}

export const DeepFocusContainer: React.FC<Props> = ({ children }) => {
    const { setFocusState } = useOscilloscope();

    useEffect(() => {
        // On Mount: Enter Deep Work
        setFocusState('deep-work');

        // On Unmount: Return to Neutral (unless specific logic overrides)
        return () => {
            setFocusState('neutral');
        };
    }, [setFocusState]);

    return (
        <div className="relative w-full h-full border-2 border-accent-pink/30 rounded-lg p-1">
            <div className="absolute top-0 right-0 -mt-3 mr-4 bg-background-dark px-2 text-xs text-accent-pink font-mono tracking-widest">
                DEEP FOCUS PROTOCOL ACTIVE
            </div>
            {children}
        </div>
    );
};
export default DeepFocusContainer;