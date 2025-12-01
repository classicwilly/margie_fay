import React, { useState } from 'react';
import { useHaptics } from '../hooks/useHaptics';
import { motion } from 'framer-motion';

// The GroundingRose component as a high-stim anchor point
export const GroundingRose = () => {
    const { vibrate } = useHaptics();
    const [isRippling, setIsRippling] = useState(false);

    const handleClick = () => {
        try { vibrate(300); } catch { /* ignore */ }
        setIsRippling(true);
        setTimeout(() => setIsRippling(false), 600);
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05, rotate: 3 }}
            whileTap={{ scale: 0.95 }}
            data-testid="grounding-rose-button"
            className="relative w-24 h-24 rounded-full bg-accent-pink/20 flex items-center justify-center text-5xl cursor-pointer shadow-neon-md transition-all duration-300 hover:bg-accent-pink/30 border border-accent-pink"
            role="button"
            aria-label="Activate Grounding Rose"
            onClick={handleClick}
            type="button"
        >
            🌹
            {isRippling && (
                <div
                    data-testid="grounding-rose-ripple"
                    className="absolute inset-0 bg-accent-pink rounded-full opacity-70 animate-ping ripple-duration-600"
                />
            )}
        </motion.button>
    );
};
