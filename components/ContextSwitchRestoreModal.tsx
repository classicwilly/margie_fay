import React, { useState, useEffect } from 'react';
import { useAppState } from '@contexts/AppStateContext';

const DEFAULT_DECOMPRESS_SECONDS = 60;
const PHYSICAL_TASKS = [
    '10 Heavy Chews (Proprioception)',
    '10 Wall Pushups (Heavy Work)',
    'Deep squeeze (Self-hug, 10s)',
    'Blow into hand (Vagal Nerve Reset)'
];

const ContextSwitchRestoreModal: React.FC = () => {
    const { appState, dispatch, isTestMode } = useAppState() as any;
    const { isContextRestoreModalOpen, savedContext } = appState || {};
    const DECOMPRESS_SECONDS = isTestMode ? 3 : DEFAULT_DECOMPRESS_SECONDS;

    // --- RESTORED HOOKS (CRASH ZONE 1) ---
    const [decompressTime, setDecompressTime] = useState(DECOMPRESS_SECONDS);
    const [isTaskCompleted, setIsTaskCompleted] = useState(false);
    const [currentTask, setCurrentTask] = useState('');
    // Diagnostic mount flag used by E2E tests
    useEffect(() => {
        try { (window as any).__WONKY_CONTEXT_RESTORE_MODAL_MOUNTED__ = true; } catch { /* ignore */ }
        return () => { try { delete (window as any).__WONKY_CONTEXT_RESTORE_MODAL_MOUNTED__; } catch { /* ignore */ } };
    }, []);

    // Debug init log removed — keep the mounted flag for E2E detection.

    // CRITICAL GUARD - DO NOT REMOVE (keeps component safe at mount time)
    if (!isContextRestoreModalOpen || !savedContext) return null;

    // --- LOGIC: TIMER EFFECT (ENABLED) ---
    useEffect(() => {
        let timer: any = null;
        if (isContextRestoreModalOpen && decompressTime > 0) {
            timer = setTimeout(() => setDecompressTime(t => Math.max(0, t - 1)), 1000);
        }
        return () => { if (timer) clearTimeout(timer); };
    }, [decompressTime, isContextRestoreModalOpen]);

    // Initialize a current physical task when the modal opens
    useEffect(() => {
        if (isContextRestoreModalOpen && PHYSICAL_TASKS.length > 0) {
            setCurrentTask(PHYSICAL_TASKS[0]);
            setIsTaskCompleted(false);
            setDecompressTime(DECOMPRESS_SECONDS);
        }
    }, [isContextRestoreModalOpen]);

    // Calculate progress percentage for styling
    // (already declared later; keep only a single declaration below)

    // Avoid inline style for width: we inject a stylesheet rule dynamically
    // to update the progress bar width without using inline styles.

    // Calculate progress percentage for styling
    const progressPercentage = Math.round(((DECOMPRESS_SECONDS - decompressTime) / DECOMPRESS_SECONDS) * 100);

    // Avoid inline style for width: create a dynamic CSS rule to set the width
    // for `.context-restore-progress .progress` using an injected <style> element
    // so lint won't complain about inline styles.
    useEffect(() => {
        if (typeof document !== 'undefined') {
            const id = 'wonky-ctx-restore-progress';
            let styleEl = document.getElementById(id) as HTMLStyleElement | null;
            if (!styleEl) {
                styleEl = document.createElement('style');
                styleEl.id = id;
                document.head.appendChild(styleEl);
            }
            styleEl.textContent = `.context-restore-progress .progress { width: ${progressPercentage}%; }`;
        }
        return () => { /* keep the style for other tests */ };
    }, [progressPercentage]);

    // Debug: Log decompression ticks so we can see if test mode and completion logic works
    // Debug tick logging removed

    // completion effect will be declared after isDecompressionComplete

    const isDecompressionComplete = decompressTime <= 0 && isTaskCompleted;

    // Debug completion logging removed

    // Handler functions
    const handleRestore = () => {
        // Close the modal and dispatch any restoration logic here
        try { dispatch({ type: 'SET_CONTEXT_RESTORE_MODAL_OPEN', payload: false }); } catch { /* ignore in tests */ }
    };
    const handleDismiss = () => {
        try { dispatch({ type: 'SET_CONTEXT_RESTORE_MODAL_OPEN', payload: false }); } catch { /* ignore */ }
    };

    // --- RESTORED JSX ---
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[99999]"
            data-testid="context-restore-modal"
        >
            <div className="bg-surface-800 p-10 space-y-6">
                <h3 id="context-restore-modal-heading" className="text-3xl font-bold text-accent-teal text-center">
                    🛸 The Airlock — Sensory Decompression
                </h3>

                {/* TIMER VISUALS */}
                <div className="space-y-2">
                    <p data-testid="context-restore-timer" className="text-center font-mono text-primary-400">
                        {decompressTime} seconds remaining
                    </p>
                    <div className="relative w-full h-2 bg-surface-700/50 context-restore-progress">
                        <div className="absolute top-0 h-full bg-accent-teal progress origin-bottom-center" />
                    </div>
                </div>

                {/* PHYSICAL TASK CHECKBOX */}
                <label className="flex items-center">
                    <input type="checkbox" checked={isTaskCompleted} onChange={() => setIsTaskCompleted(p => !p)} data-testid="physical-task-checkbox" />
                    <span className="text-accent-orange font-bold pl-3">{currentTask || 'Protocol'}</span>
                </label>

                {/* ACTION BUTTONS */}
                <div className="flex justify-between pt-4">
                    <button onClick={handleDismiss}>Dismiss</button>
                    <button disabled={!isDecompressionComplete} data-testid="context-restore-restore-btn">
                        {isDecompressionComplete ? 'Restore Session' : 'Awaiting Protocol'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export { ContextSwitchRestoreModal };
export default ContextSwitchRestoreModal;