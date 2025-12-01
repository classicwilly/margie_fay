import React, { useRef } from 'react';
import useProgressVar from '@hooks/useProgressVar';
import ContentCard from './ContentCard';
import { ALL_GEMS, REWARD_TIERS } from '../constants';
import GoogleEmoji from '@components/GoogleEmoji';

const Gem: React.FC<{ emoji: string; label: string; collected: boolean }> = ({ emoji, label, collected }) => {
    const progressRef = useRef<HTMLDivElement | null>(null);
    useProgressVar(progressRef, progressPercentage);

    return (
        <div className={`flex flex-col items-center p-2 rounded-lg transition-all duration-300 ${collected ? 'bg-accent-green bg-opacity-20' : 'bg-gray-800'}`}>
            <div className={`transition-all duration-500 ${collected ? 'grayscale-0' : 'grayscale'}`}>
                <GoogleEmoji symbol={emoji} size={36} />
            </div>
            <div className={`text-xs text-center mt-1 ${collected ? 'text-accent-green font-semibold' : 'text-text-light text-opacity-50'}`}>{label}</div>
        </div>
    );
};

interface GemCollectorProps {
    name: string;
    collectedGems: string[];
}

const GemCollector: React.FC<GemCollectorProps> = ({ name, collectedGems }) => {
    const collectedCount = collectedGems.length;
    const totalCount = ALL_GEMS.length;

    const nextTier = REWARD_TIERS.find(tier => collectedCount < tier.threshold);
    const gemsForNextTier = nextTier ? nextTier.threshold - collectedCount : 0;
    const progressPercentage = nextTier ? (collectedCount / nextTier.threshold) * 100 : 100;

    return (
        <ContentCard title={<><GoogleEmoji symbol={'💎'} size={20} className="mr-2" />{name}'s Dopamine Cache ({collectedCount}/{totalCount})</>}>
            <div className="mb-6">
                {nextTier ? (
                    <>
                        <h3 className="text-lg font-semibold text-accent-blue text-center mb-2">
                            Collect {gemsForNextTier} more dopamine units to unlock: <span className="font-bold">{nextTier.title}!</span>
                        </h3>
                        <div className="w-full bg-gray-700 rounded-full h-4" role="progressbar" aria-label={`Dopamine progress: ${Math.round(progressPercentage)}%`}>
                            <div ref={progressRef} className="bg-gradient-to-r from-accent-blue to-accent-green h-4 rounded-full transition-all duration-500 progress-fill" />
                            <span className="sr-only">Dopamine progress: {Math.round(progressPercentage)}%</span>
                        </div>
                    </>
                ) : (
                    <h3 className="text-lg font-bold text-accent-green text-center">
                       🎉 All Tiers Unlocked! Amazing Job! 🎉
                    </h3>
                )}
            </div>
            
            <p className="text-sm text-text-light text-opacity-80 mb-4">
                Mine dopamine by completing tasks in your checklists! Mined dopamine is in color.
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {ALL_GEMS.map(gem => (
                    <Gem 
                        key={gem.id}
                        emoji={gem.emoji}
                        label={gem.label}
                        collected={collectedGems.includes(gem.id)}
                    />
                ))}
            </div>
        </ContentCard>
    );
};

export default GemCollector;