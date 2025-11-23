

import React, { useMemo, useState } from 'react';

import useSafeAI from '../../../../hooks/useSafeAI';
import { SecureMarkdown } from '../../../../utils/secureMarkdownRenderer.js';
import { useAIPromptSafety } from '../../../../hooks/useAIPromptSafety.js';
import AIConsentModal from '@components/AIConsentModal';
import PIIWarningModal from '@components/PIIWarningModal';
// FIX: Imported utility function directly to fix type errors.
import { isHabitDoneOn } from '../../../../utils/habitUtils.js';

const toYMD = (date) => date.toISOString().split('T')[0];



const HabitDetailModal = ({ habit, log, onClose }) => {
    const [analysis, setAnalysis] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { 
        checkAndExecute, 
        isPiiModalOpen, piiMatches, handlePiiConfirm, handlePiiCancel,
        isConsentModalOpen, handleConfirm, handleCancel, dontShowAgain, setDontShowAgain 
    } = useAIPromptSafety();

    const calendarData = useMemo(() => {
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        const days = [];
        // Add empty cells for days before the 1st of the month
        for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
            days.push({ key: `empty-${i}`, isDay: false });
        }

        for (let d = 1; d <= lastDayOfMonth.getDate(); d++) {
            const date = new Date(today.getFullYear(), today.getMonth(), d);
            const ymd = toYMD(date);
            days.push({
                key: ymd,
                isDay: true,
                day: d,
                isToday: ymd === toYMD(new Date()),
                isCompleted: isHabitDoneOn(log, habit.id, ymd),
                isFuture: date > today,
            });
        }
        return days;
    }, [habit.id, log]);
    
    const stats = useMemo(() => {
        const last30Days = Object.keys(log).filter(date => {
            const d = new Date(date);
            const diffDays = (new Date().getTime() - d.getTime()) / (1000 * 3600 * 24);
            return diffDays <= 30;
        });
        const completedInLast30 = last30Days.filter(date => isHabitDoneOn(log, habit.id, date)).length;
        const completionRate = (completedInLast30 / 30) * 100;
        return { completionRate };
    }, [habit.id, log]);

    const generatePrompt = () => {
        const last30DaysLog = Object.keys(log)
            .filter(date => new Date(date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
            .map(date => `${date}: ${isHabitDoneOn(log, habit.id, date) ? 'Completed' : 'Missed'}`)
            .join('\n');
            
        return `
            You are a habit formation coach for a neurodivergent user. Analyze the compliance data for the habit "${habit.name}" over the last 30 days.

            **Core Directives:**
            1.  **Identify Patterns:** Look for specific days of the week where the habit is consistently missed (e.g., "Mondays appear to be a challenge.").
            2.  **Highlight Success:** Note any consistent streaks or periods of high compliance.
            3.  **Provide ONE Actionable Suggestion:** Based on the pattern, offer a single, concrete recommendation. Frame it as a system adjustment, not a judgment. (e.g., "Recommendation: Link this habit to an existing routine on Mondays, or set a specific calendar reminder.")
            
            **Compliance Data (Last 30 Days):**
            ${last30DaysLog || "No data."}

            Generate a very brief analysis with "## Pattern" and "## Recommendation" sections.
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
            setError(`Analysis failed: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };
    
    const triggerAnalysis = () => checkAndExecute(generatePrompt(), handleAnalysis);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            {isConsentModalOpen && <AIConsentModal onConfirm={handleConfirm} onCancel={handleCancel} dontShowAgain={dontShowAgain} setDontShowAgain={setDontShowAgain} />}
            {isPiiModalOpen && <PIIWarningModal isOpen={isPiiModalOpen} onCancel={handlePiiCancel} onConfirm={handlePiiConfirm} matches={piiMatches} />}
            <div className="bg-card-dark rounded-lg shadow-2xl p-6 border border-gray-700 w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                <header className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-accent-teal">{habit.name}</h2>
                        <p className="text-sm text-gray-400">Compliance & Analysis</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-bold text-accent-blue mb-2">This Month's Compliance</h3>
                        <div className="grid grid-cols-7 text-center text-xs font-bold text-gray-400 mb-1">
                            <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                            {calendarData.map(day => {
                                if (!day.isDay) return <div key={day.key}></div>;
                                return (
                                    <div key={day.key} title={day.key} className={`w-full aspect-square flex items-center justify-center rounded-sm text-xs ${
                                        day.isCompleted ? 'bg-accent-green text-background-dark font-bold' :
                                        day.isFuture ? 'bg-gray-800/50 text-gray-600' : 'bg-gray-700'
                                    } ${day.isToday ? 'ring-2 ring-accent-blue' : ''}`}>
                                        {day.day}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h3 className="font-bold text-accent-blue mb-2">Statistics</h3>
                            <div className="p-3 bg-gray-800 rounded-md space-y-2 text-sm">
                                <div className="flex justify-between"><span>Current Streak:</span><strong className="text-accent-blue">{habit.currentStreak} 🔥</strong></div>
                                <div className="flex justify-between"><span>Longest Streak:</span><strong className="text-accent-green">{habit.longestStreak} ⭐</strong></div>
                                <div className="flex justify-between"><span>30-Day Completion:</span><strong className="text-accent-teal">{stats.completionRate.toFixed(0)}%</strong></div>
                            </div>
                        </div>
                        <div>
                             <h3 className="font-bold text-accent-blue mb-2">🤖 AI Habit Coach</h3>
                             <button onClick={triggerAnalysis} disabled={loading} className="w-full p-2 bg-accent-blue text-background-dark font-bold rounded hover:bg-blue-400 disabled:bg-gray-600">
                                {loading ? 'Analyzing...' : '✨ Get Insight'}
                             </button>
                             <div className="mt-2 text-sm p-2 bg-gray-800 rounded-md min-h-[80px]">
                                {loading && <p className="animate-pulse">Analyzing patterns...</p>}
                                {error && <p className="text-red-400">{error}</p>}
                                {analysis && <div className="prose prose-invert prose-sm max-w-none"><SecureMarkdown content={analysis} /></div>}
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HabitDetailModal;