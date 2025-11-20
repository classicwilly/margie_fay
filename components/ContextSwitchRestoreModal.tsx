import React from 'react';
import { useAppState } from '@contexts/AppStateContext';
import Button from './Button';

const ContextSwitchRestoreModal: React.FC = () => {
    const { appState, dispatch } = useAppState();
    // Debug: Airlock render check
    // console.log('AIRLOCK RENDER CHECK:', { isOpen: appState.isContextRestoreModalOpen, savedContext });
    const { savedContext } = appState;
    const DECOMPRESS_SECONDS = 60;
    const [decompressTime, setDecompressTime] = React.useState(DECOMPRESS_SECONDS);
    const [decompressStarted, setDecompressStarted] = React.useState(false);
    const [physicalTaskDone, setPhysicalTaskDone] = React.useState(false);
    const timerRef = React.useRef<NodeJS.Timeout | null>(null);

    React.useEffect(() => {
        if (!decompressStarted && savedContext) {
            setDecompressStarted(true);
            setDecompressTime(DECOMPRESS_SECONDS);
            setPhysicalTaskDone(false);
        }
        if (decompressStarted && decompressTime > 0) {
            timerRef.current = setTimeout(() => {
                setDecompressTime(t => t - 1);
            }, 1000);
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [decompressStarted, decompressTime, savedContext]);

    // Only gate on modal open, not savedContext
    // if (!appState.isContextRestoreModalOpen) return null;
    // if (!savedContext) return null;

    const handleClose = () => {
        dispatch({ type: 'SET_CONTEXT_RESTORE_MODAL_OPEN', payload: false });
    };

    const handleRestoreAndClear = () => {
        if (savedContext.taskId) {
            // Optionally focus on the task
        }
        dispatch({ type: 'POMODORO_SET_MODE', payload: 'shortBreak' });
        dispatch({ type: 'POMODORO_TOGGLE' });
        dispatch({ type: 'CLEAR_CONTEXT' });
        handleClose();
        document.getElementById('module-pomodoro-timer-module')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleDismiss = () => {
        dispatch({ type: 'CLEAR_CONTEXT' });
        handleClose();
    };

    // Physical decompression task prompt
    const physicalTaskPrompt = (
        <div className="flex items-center gap-2 mt-2">
            <input
                type="checkbox"
                id="decompress-task"
                checked={physicalTaskDone}
                onChange={e => setPhysicalTaskDone(e.target.checked)}
                className="accent-green h-5 w-5"
            />
            <label htmlFor="decompress-task" className="text-sm text-accent-green font-semibold">
                I have completed the decompression task: <span className="italic">Take 3 deep breaths and touch your toes</span>
            </label>
        </div>
    );

    // Timer progress bar
    const timerProgress = (
        <div className="w-full bg-gray-700 rounded h-3 mt-2">
            <div
                className="bg-accent-green h-3 rounded"
                style={{ width: `${((DECOMPRESS_SECONDS - decompressTime) / DECOMPRESS_SECONDS) * 100}%` }}
            />
        </div>
    );

    // Restore button is gated until decompression and physical task are done
    const canRestore = decompressTime <= 0 && physicalTaskDone;

    return (
        <div className="fixed inset-0 z-[9999] bg-red-500/80 border-4 border-yellow-400 flex items-center justify-center p-4" onClick={handleClose}>
            <div className="bg-card-dark rounded-lg shadow-2xl p-6 border border-accent-green w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <h3 className="text-2xl font-bold text-accent-green mb-4">🛸 The Airlock — Sensory Decompression</h3>
                <p className="text-sm text-gray-400 mb-4">Phase 1: Decompress before restoring context. This prevents dopamine crashes and supports neurodivergent recovery.</p>
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
                <div className="mt-6 p-4 bg-gray-900 rounded-md border border-gray-700">
                    <div className="flex items-center justify-between">
                        <span className="text-accent-green font-bold">Decompression Timer:</span>
                        <span className="text-lg font-mono text-accent-green">{decompressTime}s</span>
                    </div>
                    {timerProgress}
                    {physicalTaskPrompt}
                    <p className="text-xs text-gray-400 mt-2">Complete both the timer and the physical task to unlock context restoration.</p>
                </div>
                <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-4 mt-4 border-t border-gray-700">
                    <Button type="button" onClick={handleDismiss} variant="secondary" className="px-4 py-2 text-sm">Dismiss & Clear</Button>
                    <Button
                        type="button"
                        onClick={handleRestoreAndClear}
                        variant="primary"
                        className="px-4 py-2 text-sm"
                        disabled={!canRestore}
                    >
                        {canRestore ? 'Restore Context & Resume' : 'Complete Decompression to Restore'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ContextSwitchRestoreModal;
