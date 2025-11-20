
import React from 'react';
import { useAppState } from '@contexts/AppStateContext';
import ContentCard from '../../ContentCard.js';
import ChecklistItem from '../../ChecklistItem.js';
import { ALL_GEMS } from '../../../constants.js';

const QuestLogModule = () => {
    const { appState, dispatch } = useAppState();
    const { dashboardType, quests } = appState;

    if (dashboardType !== 'willow' && dashboardType !== 'sebastian') {
        return null;
    }

    const personaQuests = quests.filter(q => q.status === 'active' && (q.assignedTo === dashboardType || q.assignedTo === 'both'));

    const handleToggleStep = (questId, stepId) => {
        dispatch({ type: 'TOGGLE_QUEST_STEP', payload: { questId, stepId } });
    };

    const handleSubmitForReview = (questId) => {
        dispatch({ type: 'UPDATE_QUEST_STATUS', payload: { questId, status: 'review' } });
    };
    
    return (
        <ContentCard title="📜 Quest Log" titleClassName="text-yellow-400">
             <div className="space-y-4">
                {personaQuests.length > 0 ? (
                    personaQuests.map(quest => {
                        const allStepsCompleted = quest.steps.every(step => step.completed);
                        const rewardGem = ALL_GEMS.find(g => g.id === quest.gemRewardId);

                        return (
                            <details key={quest.id} className="p-3 bg-gray-800 rounded-lg border border-gray-700 group">
                                <summary className="cursor-pointer font-bold text-accent-teal text-lg">
                                    {quest.title}
                                </summary>
                                <div className="pt-2 mt-2 border-t border-gray-600">
                                    <p className="text-sm text-gray-300 mb-3">{quest.description}</p>
                                    
                                    <h4 className="font-semibold text-accent-blue mb-1">Steps:</h4>
                                    <ul className="list-none space-y-1">
                                        {quest.steps.map(step => (
                                            <ChecklistItem
                                                key={step.id}
                                                id={step.id}
                                                isChecked={step.completed}
                                                onToggle={() => handleToggleStep(quest.id, step.id)}
                                            >
                                                {step.label}
                                            </ChecklistItem>
                                        ))}
                                    </ul>

                                    <div className="mt-4 pt-2 border-t border-gray-600 flex justify-between items-center">
                                         <div className="font-semibold text-yellow-400">
                                            Reward: {rewardGem?.emoji || '💎'} {rewardGem?.label || 'Special Gem'}
                                        </div>
                                        {allStepsCompleted && (
                                            <button 
                                                onClick={() => handleSubmitForReview(quest.id)}
                                                className="px-4 py-2 bg-accent-green text-background-dark font-bold rounded hover:bg-green-500 animate-pulse"
                                            >
                                                Turn In Quest!
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </details>
                        );
                    })
                ) : (
                    <p className="text-center text-text-light text-opacity-80 p-4">
                            Nothing to show here — create a quest to get started!
                    </p>
                )}
            </div>
        </ContentCard>
    );
};

export default QuestLogModule;