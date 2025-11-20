import React, { useState } from 'react';
import useSafeAI from '../hooks/useSafeAI';
import useAIPromptSafety from '../hooks/useAIPromptSafety';
import ContentCard from './ContentCard';

const AICommunicationCoach: React.FC = () => {
    const [originalText, setOriginalText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const systemInstruction = `You are an expert communication coach specializing in translating direct, neurodivergent communication styles (like Autism/ADHD) into language that is clear, collaborative, and less likely to be misinterpreted by a neurotypical co-parent. Your goal is to preserve the core facts and intent of the message while rephrasing it to be constructive and low-conflict.

    **Core Directives:**
    1.  **Preserve Facts:** The essential information (who, what, where, when, why) must remain unchanged.
    2.  **Remove Bluntness:** Replace declarative, demand-like statements with collaborative suggestions or questions.
    3.  **Add 'I' Statements:** Reframe accusations or frustrations into statements about personal feelings or observations (e.g., "You're always late" becomes "I feel stressed when pickup times are missed because it disrupts our evening schedule.").
    4.  **Inject Collaboration:** Use phrases like "How can we work together on this?", "What are your thoughts on...?", or "Would it be possible to...".
    5.  **Assume Good Intent:** Frame the translated message as if the user and co-parent are a team solving a logistical problem for the benefit of their children.
    6.  **Keep it Concise:** Do not add excessive fluff. The goal is clarity and reduced conflict, not a corporate email.

    **Example Translation:**
    -   **Original:** "Bash's soccer cleats don't fit. You need to buy him new ones before Friday's game."
    -   **Translated:** "Hey, I noticed Bash's soccer cleats seem too small for him. With the game on Friday, could we coordinate on getting him a new pair? Let me know what works best for you."`;

    const { checkAndExecute, isPiiModalOpen, piiMatches, handlePiiConfirm, handlePiiCancel, isConsentModalOpen, handleConfirm, handleCancel, dontShowAgain, setDontShowAgain } = useAIPromptSafety();
    const { generate } = useSafeAI();

    const handleTranslate = async () => {
        if (!originalText.trim()) {
            setError("Input message cannot be empty. Define the communication objective.");
            return;
        }
        setLoading(true);
        setError('');
        setTranslatedText('');

        try {
            await checkAndExecute(originalText, async (safePrompt) => {
                const result = await generate(safePrompt, { model: 'gemini-2.5-flash', config: { systemInstruction }, skipPromptSafety: true });
                setTranslatedText(result?.text || (result?.json ? JSON.stringify(result.json, null, 2) : ''));
            });
        } catch (e: any) {
            setError(`Error: ${e.message || 'Failed to communicate with the AI model.'}`);
            console.error(e);
        }
        setLoading(false);
    };
    
    const handleCopy = () => {
        navigator.clipboard.writeText(translatedText);
    };

    return (
        <ContentCard title="AI Communication Coach" titleClassName="text-accent-blue text-xl">
             <p className="text-md text-text-light text-opacity-80 mb-4">
                Write your direct, factual message below. The AI will translate it into a collaborative, low-conflict format for your co-parent.
            </p>
            {error && (
              <div role="alert" className="bg-red-800 bg-opacity-30 border border-red-700 text-red-400 p-3 rounded-md mb-4 text-sm">
                <p className="font-semibold">System Error:</p>
                <p>{error}</p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="original-text" className="font-semibold text-accent-teal">Your Direct Message:</label>
                    <textarea
                        id="original-text"
                        value={originalText}
                        onChange={(e) => setOriginalText(e.target.value)}
                        rows={6}
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-text-light placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue"
                        placeholder="e.g., Willow's dentist appointment is Tuesday at 3pm. You have to take her."
                        disabled={loading}
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="translated-text" className="font-semibold text-accent-green">Translated Message:</label>
                    <textarea
                        id="translated-text"
                        value={loading ? "Translating..." : translatedText}
                        readOnly
                        rows={6}
                        className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md text-text-light placeholder-gray-500"
                        placeholder="Translation will appear here..."
                    />
                </div>
            </div>
            <div className="mt-4 flex justify-end items-center space-x-4">
                 {translatedText && !loading && (
                    <button onClick={handleCopy} className="px-4 py-2 bg-gray-600 text-text-light rounded-md hover:bg-gray-500 transition-colors font-semibold">Copy</button>
                 )}
                 <button
                    onClick={handleTranslate}
                    disabled={loading}
                    className="px-6 py-2 bg-accent-blue text-background-dark rounded-md hover:bg-blue-400 transition-colors duration-200 font-semibold disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Translating...
                        </span>
                    ) : (
                        'Translate'
                    )}
                </button>
            </div>
        </ContentCard>
    );
};

export default AICommunicationCoach;