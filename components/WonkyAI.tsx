import React, { useState, useRef } from 'react';
import useSafeAI from '../hooks/useSafeAI';
import ContentCard from './ContentCard';
import SecureMarkdown from '../utils/secureMarkdownRenderer';
import useAIPromptSafety from '../hooks/useAIPromptSafety';
import { Button } from './Button';

// Wonky AI: uses GoogleGenAI with safety wrapper and JSON schema enforcement when needed.


const WonkyAI: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState('');
    const [error, setError] = useState('');

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
* Pick up ONE piece of trash off the floor.
* Put ONE item on your desk back where it belongs.
* Set a 5-minute timer.
Execute the first step now."
Your primary function is to be a tool that provides structure, not a coach that provides encouragement.`;

        const { checkAndExecute } = useAIPromptSafety();
        // Call hooks at top-level per the rules of hooks
        const { generate } = useSafeAI();

        const abortRef = useRef<AbortController | null>(null);

        async function timeoutPromise<T>(p: Promise<T>, timeoutMs = 15_000) {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), timeoutMs);
            try {
                const ret = await p;
                clearTimeout(id);
                return ret;
            } finally {
                clearTimeout(id);
            }
        }

        const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError("Prompt cannot be empty. Define the problem.");
            return;
        }
        setLoading(true);
        setError('');
        setResponse('');
        try {
            console.log('WonkyAI: invoking generate with prompt and opts', { prompt: prompt.trim() });
                // Use the top-level `generate` which already uses the prompt safety wrapper
                        const responseSchema = {
                            type: 'object',
                            properties: {
                                summary: { type: 'string' },
                                assist: { type: 'string' }
                            },
                            required: ['summary']
                        } as const;

                        const result = await generate(prompt.trim(), {
                            model: 'gemini-2.5-pro',
                            responseMimeType: 'application/json',
                            responseSchema,
                            timeoutMs: 20_000,
                            skipPromptSafety: true,
                        });

                        // useSafeAI returns parsed JSON in `json` when responseMimeType is application/json
                        const json = result?.json;
                        const summary = json?.summary || result?.text || 'No response from model';
                        const assist = json?.assist || '';
                        setResponse(`${summary}\n\n${assist}`.trim());
        } catch (e: any) {
            setError(`Error: ${e.message || 'Failed to communicate with the AI model.'}`);
            console.error(e);
        }
        setLoading(false);
    };

    return (
        <ContentCard title="👁️ The Mood">
            <div className="flex flex-col h-full">
                <div className="flex-grow overflow-y-auto p-4 bg-gray-800 rounded-md min-h-[200px] max-h-[400px] border border-gray-700 mb-4">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-blue"></div>
                            <p className="ml-3">Diagnosing...</p>
                        </div>
                    ) : error ? (
                         <div className="text-red-400 whitespace-pre-wrap"><p className="font-bold mb-2">System Error:</p>{error}</div>
                    ) : response ? (
                        <div className="whitespace-pre-wrap prose prose-invert prose-sm max-w-none">
                            <SecureMarkdown source={response} />
                        </div>
                    ) : (
                        <p className="text-text-light text-opacity-80 text-center flex items-center justify-center h-full">
                            Define a problem. The Mood will provide structure.
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !loading && handleGenerate()}
                        placeholder="Describe the chaos..."
                        className="flex-grow p-3 bg-gray-800 border border-gray-700 rounded-md text-text-light placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue"
                        disabled={loading}
                    />
                    <Button onClick={handleGenerate} disabled={loading} variant="primary">
                        {loading ? 'Executing...' : 'Generate'}
                    </Button>
                </div>
            </div>
        </ContentCard>
    );
};

export default WonkyAI;
