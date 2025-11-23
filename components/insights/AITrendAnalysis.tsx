

import React, { useState, useEffect } from 'react';
import { useAppState } from '@contexts/AppStateContext';
import ContentCard from '../ContentCard.js';
import useSafeAI from '../../hooks/useSafeAI.js';
import { SecureMarkdown } from '../../utils/secureMarkdownRenderer.js';
import { useAIPromptSafety } from '../../hooks/useAIPromptSafety.js';
import AIConsentModal from '@components/AIConsentModal';
import PIIWarningModal from '@components/PIIWarningModal';

const toYMD = (date) => date.toISOString().split('T')[0];

const getWeekKey = (d) => {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay()||7));
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(),0,1));
    const weekNo = Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1)/7);
    return `${date.getUTCFullYear()}-W${weekNo}`;
};

const CACHE_KEY = 'wonky-sprout-weekly-trend-analysis';


const AITrendAnalysis = () => {
    const { appState } = useAppState();
    const [analysis, setAnalysis] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { 
        checkAndExecute, 
        isPiiModalOpen, piiMatches, handlePiiConfirm, handlePiiCancel,
        isConsentModalOpen, handleConfirm, handleCancel, dontShowAgain, setDontShowAgain 
    } = useAIPromptSafety();
    const safeAI = useSafeAI();

    const generatePrompt = () => {
        const timeRange = 7;
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - timeRange);

        const filteredHabitData = Object.entries(appState.habitTracker.log)
            .filter(([date]) => new Date(date) >= startDate && new Date(date) <= endDate)
            // FIX: Cast habitIds to string[] to resolve type error.
            .map(([date, habitIds]) => `${date}: ${(habitIds as string[]).map(id => appState.habitTracker.habits.find(h => h.id === id)?.name || 'Unknown Habit').join(', ')}`)
            .join('\n');
            
        const filteredExpenseData = appState.expenses
            .filter(exp => new Date(exp.date) >= startDate && new Date(exp.date) <= endDate)
            .map(exp => `${toYMD(new Date(exp.date))}: $${exp.amount.toFixed(2)} on ${exp.description} (${exp.category})`)
            .join('\n');

        const filteredCalendarData = appState.calendarEvents
            .filter(event => new Date(event.date) >= startDate && new Date(event.date) <= endDate)
            .map(event => `${toYMD(new Date(event.date))}: ${event.title}`)
            .join('\n');
        
        return `
            You are a data analyst AI for a neurodivergent user's personal operating system. Your task is to find non-obvious correlations and patterns within their life data from the last 7 days to prepare them for their Weekly Review.

            **Core Directives:**
            1.  **Synthesize, Don't Summarize:** Do not just list the data. Find connections *between* different data types.
            2.  **Focus on Causality:** Hypothesize potential causal links. Use phrases like "It appears that...", "This may indicate...", "There is a correlation between...".
            3.  **Output Actionable Questions:** Your primary output should be a list of 2-4 insightful questions for the user to reflect on during their Weekly Review. These questions should be based on the patterns you identify.

            **Provided Data for the last 7 days:**

            **Habit Compliance Log:**
            ${filteredHabitData || "No habit data."}

            **Expense Log:**
            ${filteredExpenseData || "No expense data."}

            **Calendar Events:**
            ${filteredCalendarData || "No calendar data."}

            Now, generate the analysis. The output should be a concise markdown list of questions for reflection.
        `;
    };
    
    const runAnalysis = async () => {
        setLoading(true);
        setError('');
        const prompt = generatePrompt();
            try {
            const response = await safeAI.generate(prompt, { model: 'gemini-2.5-pro', timeoutMs: 20000 });
            const analysisText = response.text || (response.json ? JSON.stringify(response.json) : '');
            setAnalysis(analysisText);
            const currentWeekKey = getWeekKey(new Date());
            localStorage.setItem(CACHE_KEY, JSON.stringify({ weekKey: currentWeekKey, analysis: analysisText }));
        } catch (e) {
            setError(`Analysis failed: ${e.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    const triggerAnalysis = () => checkAndExecute(generatePrompt(), runAnalysis);

    useEffect(() => {
        const currentWeekKey = getWeekKey(new Date());
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
            try {
                const parsed = JSON.parse(cachedData);
                if (parsed.weekKey === currentWeekKey) {
                    setAnalysis(parsed.analysis);
                    return; // Valid cache for this week exists
                }
            } catch (e) { console.error("Failed to parse analysis cache:", e); }
        }
        // If no valid cache, automatically run analysis
        triggerAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only on mount

    return (
        <ContentCard title="🤖 Weekly AI Trend Analysis">
             {isConsentModalOpen && <AIConsentModal onConfirm={handleConfirm} onCancel={handleCancel} dontShowAgain={dontShowAgain} setDontShowAgain={setDontShowAgain} />}
             {isPiiModalOpen && <PIIWarningModal isOpen={isPiiModalOpen} onCancel={handlePiiCancel} onConfirm={handlePiiConfirm} matches={piiMatches} />}
             <p className="text-text-light text-opacity-80 mb-4">
                The AI automatically analyzes your last 7 days of data once a week to find patterns and generate questions for your Weekly Review.
            </p>
            
            <div className="flex-grow p-3 bg-gray-800 rounded-md min-h-[200px] border border-gray-700 overflow-y-auto">
                {loading && <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-blue"></div><p className="ml-3">Running weekly analysis...</p></div>}
                {error && <div className="text-red-400 p-4">{error}</div>}
                {analysis && !loading && (
                    <>
                        <h4 className="font-bold text-accent-green mb-2">Questions for Your Weekly Review:</h4>
                        <div className="prose prose-invert prose-sm max-w-none">
                            <SecureMarkdown content={analysis} />
                        </div>
                    </>
                )}
                {!loading && !error && !analysis && <p className="text-center text-text-light text-opacity-80 p-4">Generating analysis for this week...</p>}
            </div>
             <button
                onClick={triggerAnalysis}
                disabled={loading}
                className="w-full mt-4 px-6 py-2 bg-accent-blue text-background-dark font-bold rounded hover:bg-blue-400 disabled:bg-gray-600"
            >
               {loading ? 'Re-analyzing...' : '✨ Force Re-analysis'}
            </button>
        </ContentCard>
    );
};

export default AITrendAnalysis;
