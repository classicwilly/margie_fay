import React from 'react';
import { useAppState } from '@contexts/AppStateContext';
import Button from './Button';

const ContextSwitchRestoreModal: React.FC = () => {
    const { appState, dispatch } = useAppState();
    const { savedContext } = appState;

    if (!savedContext) return null;

    const handleClose = () => {
        dispatch({ type: 'SET_CONTEXT_RESTORE_MODAL_OPEN', payload: false });
    };

    const handleRestoreAndClear = () => {
        // Optional: Jump to task if we build that logic
        if (savedContext.taskId) {
            // Logic to focus on the task if needed. For now, we just open the timer.
        }
        
        // Start a 5-minute timer (short break mode is 5 mins)
        dispatch({ type: 'POMODORO_SET_MODE', payload: 'shortBreak' });
        dispatch({ type: 'POMODORO_TOGGLE' });
        
        // Clear the context
        dispatch({ type: 'CLEAR_CONTEXT' });
        
        // Close modal
        handleClose();
        
        // Scroll to pomodoro timer
        document.getElementById('module-pomodoro-timer-module')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleDismiss = () => {
        dispatch({ type: 'CLEAR_CONTEXT' });
        handleClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={handleClose}>
            <div className="bg-card-dark rounded-lg shadow-2xl p-6 border border-accent-green w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <h3 className="text-2xl font-bold text-accent-green mb-4">🛸 The Airlock — Restore Saved Context</h3>
                <p className="text-sm text-gray-400 mb-4">Re-pressurize your state and re-engage the task. This is Phase 3 of the Airlock sequence.</p>
                <div className="space-y-4 p-4 bg-gray-800 rounded-md">
                    <div>
                        <p className="text-xs text-gray-400">Original Task:</p>
                        <p className="font-semibold">{savedContext.taskTitle}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Your Last Thoughts:</p>
                        <p className="italic">"{savedContext.thoughts}"</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Your Next Micro-Step:</p>
                        <p className="font-semibold">"{savedContext.nextStep}"</p>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-4 mt-4 border-t border-gray-700">
                    <Button type="button" onClick={handleDismiss} variant="secondary" className="px-4 py-2 text-sm">Dismiss & Clear</Button>
                    <Button type="button" onClick={handleRestoreAndClear} variant="primary" className="">Start 5-min Reload Timer & Resume</Button>
                </div>
            </div>
        </div>
    );
};

export default ContextSwitchRestoreModal;
