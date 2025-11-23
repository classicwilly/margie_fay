import React, { useState, useMemo } from 'react';
import { useAppState } from '@contexts/AppStateContext';

const ContextSwitchCaptureModal: React.FC = () => {
    const { appState, dispatch } = useAppState();
    const { focusModeTaskId, tasks, recurringTasks } = appState;
    
    const [thoughts, setThoughts] = useState('');
    const [nextStep, setNextStep] = useState('');

    const activeTask = useMemo(() => {
        if (!focusModeTaskId) return null;
        if (focusModeTaskId.startsWith('recurring-')) {
            return recurringTasks.find(t => t.id === focusModeTaskId.replace('recurring-', ''));
        }
        return tasks.find(t => t.id === focusModeTaskId);
    }, [focusModeTaskId, tasks, recurringTasks]);

    const handleSaveContext = () => {
        if (!thoughts.trim() || !nextStep.trim()) {
            alert("Please fill out both fields to save your context.");
            return;
        }
        dispatch({
            type: 'SAVE_CONTEXT',
            payload: {
                taskId: activeTask?.id || null,
                taskTitle: activeTask?.title || 'General Work',
                thoughts: thoughts,
                nextStep: nextStep,
            }
        });
        dispatch({ type: 'SET_CONTEXT_CAPTURE_MODAL_OPEN', payload: false });
    };
    
    const handleClose = () => {
        dispatch({ type: 'SET_CONTEXT_CAPTURE_MODAL_OPEN', payload: false });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={handleClose}>
            <div className="bg-card-dark rounded-lg shadow-2xl p-6 border border-accent-blue w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <h3 className="text-2xl font-bold text-accent-blue mb-4">⏸️ Capture Context Before Entering The Airlock</h3>
                <p className="text-sm text-gray-400 mb-4">Offload your current mental state before handling the interruption. This is Phase 1 of the Airlock sequence.</p>
                <div className="space-y-4">
                    <div className="p-3 bg-gray-800 rounded">
                        <p className="text-xs text-gray-400">Current Task:</p>
                        <p className="font-semibold">{activeTask?.title || 'Not in focus mode'}</p>
                    </div>
                    <div>
                        <label htmlFor="current-thoughts" className="block text-sm font-medium mb-1">What were you just thinking?</label>
                        <textarea id="current-thoughts" value={thoughts} onChange={e => setThoughts(e.target.value)} rows={3} className="w-full p-2 bg-gray-800 border border-gray-600 rounded" placeholder="e.g., 'Okay, I need to refactor the state management for...'"></textarea>
                    </div>
                    <div>
                        <label htmlFor="next-step" className="block text-sm font-medium mb-1">What was the very next micro-step?</label>
                        <input id="next-step" type="text" value={nextStep} onChange={e => setNextStep(e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-600 rounded" placeholder="e.g., 'Rename the `useUser` hook to `useAuth`'"></input>
                    </div>
                </div>
                <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-gray-700">
                    <button type="button" onClick={handleClose} className="px-4 py-2 bg-gray-600 rounded">Cancel</button>
                    <button type="button" onClick={handleSaveContext} className="px-4 py-2 bg-accent-blue text-background-dark font-bold rounded">Save & Handle Interrupt</button>
                </div>
            </div>
        </div>
    );
};

export default ContextSwitchCaptureModal;
