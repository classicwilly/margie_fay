import React, { useState } from 'react';
import { useHaptics } from '../hooks/useHaptics';
import { motion } from 'framer-motion';

// The GroundingRose component as a high-stim anchor point
export const GroundingRose = ({ onActivate, className }: { onActivate?: () => void; className?: string }) => {
    const { vibrate } = useHaptics();
    const [isRippling, setIsRippling] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);

    const handleClick = () => {
        try { vibrate(300); } catch (e) { /* ignore */ }
        setIsRippling(true);
        setTimeout(() => setIsRippling(false), 600);
        if (onActivate) onActivate();
        else setModalOpen(true);
    };

    return (
        <>
        <motion.button
            whileHover={{ scale: 1.05, rotate: 3 }}
            whileTap={{ scale: 0.95 }}
            data-testid="grounding-rose-button"
            className={`relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-accent-pink/20 flex items-center justify-center text-6xl md:text-7xl cursor-pointer shadow-neon-md transition-all duration-300 hover:bg-accent-pink/30 border border-accent-pink ${className || ''}`}
            role="button"
            aria-label="Activate Grounding Rose"
            onClick={handleClick}
            type="button"
        >
            🌹
            {isRippling && (
                <div
                    data-testid="grounding-rose-ripple"
                    className="absolute inset-0 bg-accent-pink rounded-full opacity-70 animate-ping"
                    style={{ animationDuration: '600ms' }}
                />
            )}
        </motion.button>

        {/* Grounding Modal */}
        {isModalOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm">
                <div className="bg-card-dark rounded-2xl p-8 w-[90%] max-w-lg text-center">
                    <h2 className="text-2xl font-bold text-neon-pink mb-4">Grounding — Take 3</h2>
                    <p className="text-text-muted mb-6">Breathe in for 4, hold for 4, breathe out for 6. Repeat 3 times.</p>
                    <div className="mx-auto w-40 h-40 bg-neon-pink/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
                        <div className="w-24 h-24 rounded-full bg-neon-pink/20" />
                    </div>
                    <div className="flex gap-4 justify-center">
                        <button className="btn-neon px-4 py-2 rounded-xl" onClick={() => setModalOpen(false)}>Done</button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
};
