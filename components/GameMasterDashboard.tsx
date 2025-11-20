

import React, { useState } from 'react';
import GemAdminModule from './modules/GemAdminModule.js';
import { useAppState } from '@contexts/AppStateContext';
import ContentCard from './ContentCard.js';
import { ALL_GEMS, REWARD_TIERS } from '../constants.js';

const QuestManagement = () => {
    const { appState, dispatch } = useAppState();
    const { quests } = appState;

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [steps, setSteps] = useState(['']);
    const [gemRewardId, setGemRewardId] = useState('quest-bronze');
    const [assignedTo, setAssignedTo] = useState('both');

    const questRewardGems = ALL_GEMS.filter(g => g.id.startsWith('quest-'));

    const handleAddStep = () => setSteps([...steps, '']);
    const handleStepChange = (index: number, value: string) => {
        const newSteps = [...steps];
        newSteps[index] = value;
        setSteps(newSteps);
    };
    const handleRemoveStep = (index: number) => {
        setSteps(steps.filter((_, i) => i !== index));
    };

    const handleCreateQuest = (e: React.FormEvent) => {
        e.preventDefault();
        const filteredSteps = steps.filter(s => s.trim() !== '');
        if (!title.trim() || !description.trim() || filteredSteps.length === 0) return;

        dispatch({
            type: 'ADD_QUEST',
            payload: { title, description, steps: filteredSteps, gemRewardId, assignedTo }
        });
        
        // Reset form
        setTitle('');
        setDescription('');
        setSteps(['']);
        setGemRewardId('quest-bronze');
        setAssignedTo('both');
    };
    
    const handleDeleteQuest = (id: string) => {
      if (window.confirm("Are you sure you want to permanently delete this quest?")) {
        dispatch({ type: 'DELETE_QUEST', payload: id });
      }
    };
    
    const handleApproveQuest = (id: string) => {
        dispatch({ type: 'UPDATE_QUEST_STATUS', payload: { questId: id, status: 'complete' } });
    };

    const questsInReview = quests.filter(q => q.status === 'review');
    const activeQuests = quests.filter(q => q.status === 'active');

    return (
        <ContentCard title="Quest Board" titleClassName="text-accent-blue text-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Create Quest Form */}
                 <details className="space-y-3 p-4 bg-gray-800 rounded-md border border-gray-700">
                    <summary className="cursor-pointer text-lg font-bold text-accent-green">Create New Quest</summary>
                    <form onSubmit={handleCreateQuest} className="space-y-3 pt-3 border-t border-gray-700">
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Quest Title" className="w-full p-2 bg-gray-900 border border-gray-600 rounded" required />
                        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" rows={3} className="w-full p-2 bg-gray-900 border border-gray-600 rounded" required />
                        <div>
                            <h4 className="text-sm font-semibold mb-1">Steps:</h4>
                            <div className="space-y-2">
                                {steps.map((step, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <input type="text" value={step} onChange={e => handleStepChange(index, e.target.value)} className="flex-grow p-2 bg-gray-900 border border-gray-600 rounded" placeholder={`Step ${index + 1}`} />
                                        {steps.length > 1 && <button type="button" onClick={() => handleRemoveStep(index)} className="p-1 bg-red-800/80 rounded">&times;</button>}
                                    </div>
                                ))}
                            </div>
                            <button type="button" onClick={handleAddStep} className="mt-2 text-xs text-accent-blue hover:underline">+ Add Step</button>
                        </div>
                        <div className="flex gap-2">
                            <select value={gemRewardId} onChange={e => setGemRewardId(e.target.value)} className="w-1/2 p-2 bg-gray-900 border border-gray-600 rounded">
                                {questRewardGems.map(gem => <option key={gem.id} value={gem.id}>{gem.label}</option>)}
                            </select>
                            <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)} className="w-1/2 p-2 bg-gray-900 border border-gray-600 rounded">
                                <option value="both">Both Kids</option>
                                <option value="willow">Willow</option>
                                <option value="sebastian">Sebastian</option>
                            </select>
                        </div>
                        <button type="submit" className="w-full p-2 bg-accent-blue text-background-dark font-bold rounded">Create Quest</button>
                    </form>
                </details>

                {/* Active & Review Quests */}
                <div className="space-y-4">
                     <div>
                        <h3 className="text-lg font-bold text-accent-warning">Quests for Review ({questsInReview.length})</h3>
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                            {questsInReview.map(q => (
                                <div key={q.id} className="p-2 bg-gray-800 rounded-md">
                                    <p className="font-semibold">{q.title} ({q.assignedTo})</p>
                                    <button onClick={() => handleApproveQuest(q.id)} className="text-xs text-accent-green hover:underline">Approve & Grant Reward</button>
                                </div>
                            ))}
                        </div>
                    </div>
                     <div>
                        <h3 className="text-lg font-bold text-accent-teal">Active Quests ({activeQuests.length})</h3>
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                             {activeQuests.map(q => (
                                <div key={q.id} className="p-2 bg-gray-800 rounded-md flex justify-between items-center">
                                    <p className="font-semibold">{q.title} ({q.assignedTo})</p>
                                    <button onClick={() => handleDeleteQuest(q.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </ContentCard>
    );
};

const RedemptionHub = () => {
    const { appState, dispatch } = useAppState();
    const { redeemedRewards, acknowledgedRedemptions, fulfillmentLog } = appState;
    const [notes, setNotes] = useState<Record<string, string>>({});

    const handleAcknowledge = (persona: 'willow' | 'sebastian', threshold: number, rewardTitle: string) => {
        const redemptionId = `${persona}-${threshold}`;
        dispatch({
            type: 'ACKNOWLEDGE_REDEMPTION',
            payload: { persona, threshold, notes: notes[redemptionId] || '', rewardTitle }
        });
    };

    const pendingRedemptions = (['willow', 'sebastian'] as const).flatMap(persona => {
        const redeemed = redeemedRewards[persona] || [];
        const acknowledged = acknowledgedRedemptions[persona] || [];
        return redeemed
            .filter(threshold => !acknowledged.includes(threshold))
            .map(threshold => ({
                persona,
                threshold,
                tier: REWARD_TIERS.find(t => t.threshold === threshold),
            }));
    });

    return (
        <ContentCard data-testid="redemption-hub" title="Redemption Hub" titleClassName="text-accent-purple text-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 data-testid="pending-redemptions" className="text-lg font-bold text-accent-warning mb-2">Pending Redemptions ({pendingRedemptions.length})</h3>
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                        {pendingRedemptions.map(({ persona, threshold, tier }) => {
                            if (!tier) return null;
                            const redemptionId = `${persona}-${threshold}`;
                            return (
                                <div key={redemptionId} className="p-3 bg-gray-800 rounded-md border border-yellow-700">
                                    <p className="font-bold">{tier.emoji} {tier.title} for {persona.charAt(0).toUpperCase() + persona.slice(1)}</p>
                                    <textarea
                                        value={notes[redemptionId] || ''}
                                        onChange={e => setNotes(prev => ({ ...prev, [redemptionId]: e.target.value }))}
                                        placeholder="Add fulfillment notes..."
                                        rows={2}
                                        className="w-full text-sm p-1 my-2 bg-gray-900 border border-gray-600 rounded"
                                        data-testid={`redemption-note-${redemptionId}`}
                                    />
                                    <button onClick={() => handleAcknowledge(persona, threshold, tier.title)} className="w-full p-2 bg-accent-green text-background-dark font-bold rounded" data-testid={`mark-fulfilled-${redemptionId}`}>
                                        Mark as Fulfilled
                                    </button>
                                </div>
                            );
                        })}
                        {pendingRedemptions.length === 0 && <p className="text-sm text-gray-400">No rewards waiting for fulfillment.</p>}
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-accent-green mb-2">Fulfillment Log</h3>
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                        {fulfillmentLog.map(item => (
                            <div key={item.id} className="p-2 bg-gray-800 rounded-md text-sm">
                                <p className="font-semibold">{item.rewardTitle} for {item.persona}</p>
                                <p className="text-xs text-gray-400">Fulfilled on {new Date(item.fulfilledAt).toLocaleDateString()}</p>
                                {item.notes && <p className="text-xs italic mt-1">"{item.notes}"</p>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </ContentCard>
    );
};

const GameMasterDashboard = () => {
    return (
        <div>
            <header className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-extrabold text-accent-teal mb-4">Game Master Hub</h1>
                <p className="text-lg text-text-light text-opacity-80">
                    Administrative control center for managing the children's quests, rewards, and achievements.
                </p>
            </header>
            <div className="space-y-6">
                <QuestManagement />
                <RedemptionHub />
                <GemAdminModule persona="willow" />
                <GemAdminModule persona="sebastian" />
            </div>
        </div>
    );
};
// FIX: Changed the default export to be the main dashboard component.
export default GameMasterDashboard;