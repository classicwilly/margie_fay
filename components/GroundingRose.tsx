import React, { useState } from 'react';
import { useHaptics } from '../hooks/useHaptics';

// This is a minimal functional GroundingRose component that mimics the
// behavior used in the E2E tests (haptics + visual ripple), so tests can
// reliably interact with the component even in the stubbed module.
export const GroundingRose = () => {
    const { vibrate } = useHaptics();
    const [isRippling, setIsRippling] = useState(false);

    const handleClick = () => {
        try { vibrate(300); } catch (e) { /* ignore */ }
        setIsRippling(true);
        setTimeout(() => setIsRippling(false), 600);
    };

    return (
        <button
            data-testid="grounding-rose-button"
            className="w-16 h-16 rounded-full bg-pink-500/50 flex items-center justify-center text-3xl cursor-pointer shadow-lg transition-all hover:bg-pink-400"
            role="button"
            aria-label="Activate Grounding Rose"
            onClick={handleClick}
            type="button"
        >
            🌹
            {isRippling && (
                <div
                    data-testid="grounding-rose-ripple"
                    className="absolute inset-0 bg-rose-400/30 rounded-full animate-ping"
                    style={{ animationDuration: '600ms' }}
                />
            )}
        </button>
    );
};
