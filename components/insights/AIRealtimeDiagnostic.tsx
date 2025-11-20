

import React, { useState } from 'react';
import { useAppState } from '@contexts/AppStateContext';
import ContentCard from '../ContentCard.js';
import useSafeAI from '../../hooks/useSafeAI';
import { SecureMarkdown } from '../../utils/secureMarkdownRenderer.js';
import { useAIPromptSafety } from '../../hooks/useAIPromptSafety.js';
import AIConsentModal from '../AIConsentModal.js';
import PIIWarningModal from '../PIIWarningModal.js';

const toYMD = (date) => date.toISOString().split('T')[0];

const AIRealtimeDiagnostic = () => {
    const { appState } = useAppState();
    const [analysis, setAnalysis] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { 
        checkAndExecute, 
        isPiiModalOpen, piiMatches, handlePiiConfirm, handlePiiCancel,
        isConsentModalOpen, handleConfirm, handleCancel, dontShowAgain, setDontShowAgain 
    } = useAIPromptSafety();

    const generatePrompt = () => {
        const todayStr = toYMD(new Date());
        const todaysEvents = appState.calendarEvents.filter(e => toYMD(new Date(e.date)) === todayStr).length;
        const todaysTasks = appState.tasks.filter(t => t.dueDate === todayStr && t.status === 'todo').length;

        return `
            You are a systems diagnostician AI for a neurodivergent user. Analyze the following real-time system data and generate a concise, actionable report.

            **Core Directives:**
            1.  **Assess Current State:** Synthesize all inputs into a single "System Status" sentence (e.g., "System stable but at risk of cognitive load," "Warning: Sensory overload imminent").
            2.  **Identify Key Factors:** In "Diagnostic Notes," list the 2-3 most critical data points contributing to the current status.
            3.  **Provide ONE Next Action:** In "Recommended Action," suggest the single most impactful, concrete, and small next step the user should take. Be specific.

            **Real-time System Data:**
            - Current Mood: ${appState.statusMood || 'Not Set'}
            - Current Energy: ${appState.statusEnergy || 'Not Set'}
            - Sensory State (Sound, Sight, Touch): ${appState.sensoryState.sound || 'OK'}, ${appState.sensoryState.sight || 'OK'}, ${appState.sensoryState.touch || 'OK'}
            - Today's Calendar Events: ${todaysEvents}
            - Today's Open Tasks: ${todaysTasks}
            - Brain Dump Content: """${appState.brainDumpText.slice(0, 200) || "Empty"}"""

            Now, generate the diagnostic report in markdown with "## System Status", "## Diagnostic Notes", and "## Recommended Action" sections.
        `;
    };
    
    const { generate } = useSafeAI();

    const handleAnalysis = async (safePrompt?: string) => {
        setLoading(true);
        setError('');
        const prompt = generatePrompt();
        try {
            const result = await generate(safePrompt ?? prompt, { model: 'gemini-2.5-flash', timeoutMs: 20000, skipPromptSafety: true });
            setAnalysis(result?.text || (result?.json ? JSON.stringify(result.json) : ''));
        } catch (e) {
            setError(`Analysis failed: ${e.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    const triggerAnalysis = () => {
        checkAndExecute(generatePrompt(), handleAnalysis);
    };

    return (
        <ContentCard title="On-Demand System Diagnostic">
             {isConsentModalOpen && <AIConsentModal onConfirm={handleConfirm} onCancel={handleCancel} dontShowAgain={dontShowAgain} setDontShowAgain={setDontShowAgain} />}
             {isPiiModalOpen && <PIIWarningModal isOpen={isPiiModalOpen} onCancel={handlePiiCancel} onConfirm={handlePiiConfirm} matches={piiMatches} />}
             <p className="text-text-light text-opacity-80 mb-4">
                Get an immediate, AI-powered analysis of your current system state and the single most important next action to take.
            </p>
            <button
                onClick={triggerAnalysis}
                disabled={loading}
                className="w-full px-6 py-2 bg-accent-blue text-background-dark font-bold rounded hover:bg-blue-400 disabled:bg-gray-600"
            >
               {loading ? 'Diagnosing...' : '✨ Run Real-time Diagnostic'}
            </button>
            
            <div className="mt-4 flex-grow p-3 bg-gray-800 rounded-md min-h-[150px] border border-gray-700 overflow-y-auto">
                {loading && <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-blue"></div><p className="ml-3">Diagnosing system state...</p></div>}
                {error && <div className="text-red-400 p-4">{error}</div>}
                {analysis && (
                    <div className="prose prose-invert prose-sm max-w-none">
                        <SecureMarkdown content={analysis} />
                    </div>
                )}
                {!loading && !error && !analysis && <p className="text-center text-text-light text-opacity-80 p-4">Run diagnostic to see current system analysis.</p>}
            </div>
        </ContentCard>
    );
};

export default AIRealtimeDiagnostic;