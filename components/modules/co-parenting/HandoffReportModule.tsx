
import React, { useState } from 'react';
import { useAppState } from '@contexts/AppStateContext';
import ContentCard from '../../ContentCard.js';
import useSafeAI from '../../../hooks/useSafeAI';
import { useAIPromptSafety } from '../../../hooks/useAIPromptSafety.js';
import AIConsentModal from '../../AIConsentModal.js';
import PIIWarningModal from '../../PIIWarningModal.js';
import { SecureMarkdown } from '../../../utils/secureMarkdownRenderer.js';

const HandoffReportModule: React.FC = () => {
    const { appState, dispatch } = useAppState();
    const [health, setHealth] = useState('');
    const [behavior, setBehavior] = useState('');
    const [school, setSchool] = useState('');
    const [logistics, setLogistics] = useState('');
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { checkAndExecute, isPiiModalOpen, piiMatches, handlePiiConfirm, handlePiiCancel, isConsentModalOpen, handleConfirm, handleCancel, dontShowAgain, setDontShowAgain } = useAIPromptSafety();

    const generatePrompt = () => `
        You are an AI assistant helping a co-parent write a handoff report. Your tone must be neutral, factual, and collaborative, following the BIFF model (Brief, Informative, Friendly, Firm).
        Convert the following bullet points into a concise, well-structured summary paragraph.

        - Health Notes: ${health || "None"}
        - Behavior Notes: ${behavior || "None"}
        - School Notes: ${school || "None"}
        - Logistics/Other Notes: ${logistics || "None"}
    `;

    const handleGenerateSummary = async () => {
        setLoading(true);
        setError('');
        const prompt = generatePrompt();
        try {
            const { generate } = useSafeAI();
            const result = await generate(prompt, { model: 'gemini-2.5-flash', timeoutMs: 20000, skipPromptSafety: true });
            setSummary(result?.text || (result?.json ? JSON.stringify(result.json) : ''));
        } catch (e: any) {
            setError(`Failed to generate summary: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };
    
    const triggerAnalysis = () => checkAndExecute(generatePrompt(), handleGenerateSummary);
    
    const handleLogReport = () => {
        const fullReport = `
**Handoff Report**

**Health:**
${health || "N/A"}

**Behavior:**
${behavior || "N/A"}

**School:**
${school || "N/A"}

**Logistics:**
${logistics || "N/A"}

---
**AI-Generated Summary:**
${summary}
        `.trim();

        dispatch({
            type: 'ADD_FAMILY_LOG_ENTRY',
            payload: {
                persona: appState.dashboardType, // This will be 'co-parenting' but log shows timestamp.
                text: fullReport,
                type: 'handoff',
            }
        });
        
        // Reset form
        setHealth(''); setBehavior(''); setSchool(''); setLogistics(''); setSummary('');
    };

    return (
        <ContentCard title="📋 Guided Handoff Report" titleClassName="text-accent-blue text-xl">
            {isConsentModalOpen && <AIConsentModal onConfirm={handleConfirm} onCancel={handleCancel} dontShowAgain={dontShowAgain} setDontShowAgain={setDontShowAgain} />}
            {isPiiModalOpen && <PIIWarningModal isOpen={isPiiModalOpen} onCancel={handlePiiCancel} onConfirm={handlePiiConfirm} matches={piiMatches} />}
            <p className="text-md text-text-light text-opacity-80 mb-4">
                Fill out the checklist to prepare for a handoff, then generate an AI-assisted summary to send to your co-parent.
            </p>
            <div className="space-y-4">
                <div>
                    <label htmlFor="handoff-health" className="font-semibold text-accent-teal">Health (Meds, issues, etc.)</label>
                    <textarea id="handoff-health" aria-label="Health notes" value={health} onChange={e => setHealth(e.target.value)} rows={2} className="w-full p-2 mt-1 bg-gray-800 border border-gray-700 rounded"/>
                </div>
                 <div>
                    <label htmlFor="handoff-behavior" className="font-semibold text-accent-teal">Behavior (Mood, challenges, wins)</label>
                    <textarea id="handoff-behavior" aria-label="Behavior notes" value={behavior} onChange={e => setBehavior(e.target.value)} rows={2} className="w-full p-2 mt-1 bg-gray-800 border border-gray-700 rounded"/>
                </div>
                 <div>
                    <label htmlFor="handoff-school" className="font-semibold text-accent-teal">School (Homework, events, feedback)</label>
                    <textarea id="handoff-school" aria-label="School notes" value={school} onChange={e => setSchool(e.target.value)} rows={2} className="w-full p-2 mt-1 bg-gray-800 border border-gray-700 rounded"/>
                </div>
                 <div>
                    <label htmlFor="handoff-logistics" className="font-semibold text-accent-teal">Logistics (Items to transfer, schedule notes)</label>
                    <textarea id="handoff-logistics" aria-label="Logistics notes" value={logistics} onChange={e => setLogistics(e.target.value)} rows={2} className="w-full p-2 mt-1 bg-gray-800 border border-gray-700 rounded"/>
                </div>
            </div>

            <button onClick={triggerAnalysis} disabled={loading} className="w-full mt-4 p-2 bg-accent-blue text-background-dark font-bold rounded">
                {loading ? 'Generating...' : '✨ Generate BIFF Summary'}
            </button>
            
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            
            {summary && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                    <h4 className="font-bold text-accent-green mb-2">AI-Generated Summary:</h4>
                    <div className="p-3 bg-gray-800 rounded prose prose-invert prose-sm max-w-none">
                        <SecureMarkdown content={summary} />
                    </div>
                    <button onClick={handleLogReport} className="w-full mt-2 p-2 bg-accent-green text-background-dark font-bold rounded">
                        Save Report to Shared Log
                    </button>
                </div>
            )}
        </ContentCard>
    );
};

export default HandoffReportModule;