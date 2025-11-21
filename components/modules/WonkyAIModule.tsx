import React, { useState } from 'react';
import useSafeAI from '@hooks/useSafeAI';
import { useAIPromptSafety } from '@hooks/useAIPromptSafety';
import AIConsentModal from '../AIConsentModal';
import PIIWarningModal from '../PIIWarningModal';
import { Button } from '../Button';
import { SecureMarkdown } from '../../utils/secureMarkdownRenderer.js';
import Skeleton from '../Skeleton';
import ContentCard from '@components/ContentCard';
import { useNeuroPrefs } from '@contexts/NeurodivergentPreferencesContext';
import { useAIEnabled } from '@contexts/FeatureFlagsContext';

const WonkyAIModule = () => {
    const { prefs } = useNeuroPrefs();
    const { simplifiedUi } = prefs;
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState('');
    const [error, setError] = useState('');
    const [manualInput, setManualInput] = useState('');
    const { 
        checkAndExecute, 
        isPiiModalOpen, piiMatches, handlePiiConfirm, handlePiiCancel,
        isConsentModalOpen, handleConfirm, handleCancel, dontShowAgain, setDontShowAgain 
    } = useAIPromptSafety();
    const { generate } = useSafeAI();
    const [controller, setController] = useState<AbortController | null>(null);

    const systemInstruction = `You are "Wonky AI," an assistant for a neurodivergent systems diagnostician named William. Your core philosophy is "Structure Engineered for Chaos" and "Anti-BS." Your responses MUST be:
1.  **Direct and Unambiguous:** No fluff, no motivational platitudes ("You can do it!"). Use clear, concise language. State facts.
2.  **Structured:** Use numbered lists, checklists, or markdown tables. Break down complex problems into small, actionable micro-tasks. Use markdown for formatting lists and bolding.
3.  **System-Oriented:** Frame solutions as protocols, systems, or diagnostic procedures. Use engineering and systems-thinking metaphors.
4.  **Neurodivergent-Aware:** Acknowledge and account for executive dysfunction, sensory overload, and decision paralysis in your solutions. Provide the simplest possible first step.
5.  **Problem-Solving Focused:** Do not offer emotional support. Your job is to help the user diagnose the root cause of a problem and build a system to fix it.
Example Query: "I can't start cleaning my office."
Your Response Style:
"Acknowledged. Executive dysfunction triggered. Initiating 'Office Reset Protocol'.
**Diagnosis:** The task 'clean office' is too large and undefined, causing paralysis.
**Solution:** Reframe as a sequence of micro-tasks.
- Pick up ONE piece of trash off the floor.
- Put ONE item on your desk back where it belongs.
- Set a 5-minute timer.
Execute the first step now."
Your primary function is to be a tool that provides structure, not a coach that provides encouragement.`;

    const aiEnabled = useAIEnabled();

    const handleGenerate = async (safePrompt?: string) => {
        if (!prompt.trim()) {
            setError("Prompt cannot be empty. Define the problem.");
            return;
        }
        setLoading(true);
        setError('');
        setResponse('');
        const ctrl = new AbortController();
        setController(ctrl);
        try {
                const result = await generate(safePrompt ?? prompt, { model: 'gemini-2.5-flash', config: { systemInstruction }, timeoutMs: 20000, skipPromptSafety: true, signal: ctrl.signal });
                // if AI is disabled we return a manual placeholder - show a thin CTA
                if (!aiEnabled) {
                    setResponse('Manual mode active. Use the editor below to paste your notes or structure from templates.');
                    setLoading(false);
                    return;
                }
                    setResponse(result?.text || (result?.json ? JSON.stringify(result.json, null, 2) : ''));
        } catch (e) {
            setError(`Error: ${e.message || 'Failed to communicate with the AI model.'}`);
            console.error(e);
        }
        setLoading(false);
        setController(null);
    };
    
    const handleSubmit = () => {
        checkAndExecute(prompt, handleGenerate);
    };

    const handleEnterPress = (e) => {
        if (e.key === 'Enter' && !loading) {
            handleSubmit();
        }
    };

    return (
        <ContentCard title="🧠 Observer">
            {isConsentModalOpen && <AIConsentModal onConfirm={handleConfirm} onCancel={handleCancel} dontShowAgain={dontShowAgain} setDontShowAgain={setDontShowAgain} />}
            {isPiiModalOpen && <PIIWarningModal isOpen={isPiiModalOpen} onCancel={handlePiiCancel} onConfirm={handlePiiConfirm} matches={piiMatches} />}
            <div className="flex flex-col h-full">
                <div className="flex-grow overflow-y-auto p-4 bg-gray-800 rounded-md min-h-[200px] max-h-[400px] border border-gray-700 mb-4">
                    {loading ? (
                        <div className="flex items-start h-full">
                            {simplifiedUi ? (
                                <p className="text-sm text-text-light">Diagnosing...</p>
                            ) : (
                                <>
                                    <div className="flex-1 mr-4">
                                        <Skeleton lines={4} />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <p className="text-sm text-text-light">Diagnosing…</p>
                                        <p className="text-xs text-text-light text-opacity-80">This may take a few seconds — you can cancel anytime.</p>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : error ? (
                        <div className="text-red-400 whitespace-pre-wrap"><p className="font-bold mb-2">System Error:</p>{error}</div>
                    ) : response ? (
                                <div data-testid="ai-response" className="prose prose-invert prose-sm max-w-none">
                            <SecureMarkdown content={response} />
                        </div>
                    ) : (
                        <p className="text-text-light text-opacity-80 text-center flex items-center justify-center h-full">
                            Define a problem. The Observer will provide structure.
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        data-testid="ask-ai-input"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={handleEnterPress}
                        placeholder="Describe the chaos..."
                        className="flex-grow p-3 bg-gray-800 border border-gray-700 rounded-md text-text-light placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue"
                        disabled={loading}
                    />
                    <div className="flex items-center gap-2">
                        <Button
                            data-testid="ask-ai-btn"
                            onClick={handleSubmit}
                            disabled={loading}
                            className="disabled:bg-gray-600 disabled:cursor-not-allowed"
                            variant="primary"
                        >
                            {loading ? '...' : '✨ Ask AI'}
                        </Button>
                        {!aiEnabled && !simplifiedUi && (
                            <div className="flex flex-col w-full">
                                <textarea
                                    placeholder="Paste or write your own structured plan (AI disabled)
Use the format from the policy: numbered steps, checklists, and a simple first step."
                                    value={manualInput}
                                    onChange={(e) => setManualInput(e.target.value)}
                                    className="mt-2 p-2 bg-gray-800 rounded-md text-text-light"
                                />
                                <div className="flex gap-2 mt-2">
                                    <Button variant="secondary" onClick={() => setResponse(manualInput)}>Save Manual Response</Button>
                                    <Button variant="secondary" onClick={() => setManualInput('')}>Clear</Button>
                                </div>
                            </div>
                        )}
                        {loading && (
                            <Button variant="secondary" onClick={() => { controller?.abort(); setLoading(false); setController(null); }}>
                                Cancel
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </ContentCard>
    );
};

export default WonkyAIModule;