import React, { useMemo, useEffect, useState } from 'react';
import { REWARD_TIERS } from '../constants.js';
import useSafeAI from './useSafeAI';
import { useTime } from './useTime.js';
import { renderSecureMarkdown } from '../utils/secureMarkdownRenderer.js';

// Helper function to get YYYY-MM-DD string
const toYMD = (date) => date.toISOString().split('T')[0];
const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

const AI_INSIGHT_CACHE_KEY = 'wonky-sprout-daily-ai-insight';


export function useProactiveAI(appState, dispatch) {
    const {
        expenses,
        financialBudgets,
        collectedGems,
        acknowledgedRewards,
        redeemedRewards,
        acknowledgedRedemptions,
        parentalAlerts, // New state
        recurringTasks,
        habitTracker,
        sensoryState,
        calendarEvents,
        statusEnergy,
        statusMood,
        brainDumpText,
        tasks, // Using new tasks state
        checkedItems, // Added for essentials check
        savedContext,
        dismissedNudges,
    } = appState;
    
    const [dailyAIInsight, setDailyAIInsight] = useState(null);
    const { hour, date: now } = useTime();
    const { generate } = useSafeAI();

    useEffect(() => {
        const performDailyAIAnalysis = async () => {
            const todayStr = toYMD(new Date());
            const cachedData = localStorage.getItem(AI_INSIGHT_CACHE_KEY);
            if (cachedData) {
                try {
                    const parsed = JSON.parse(cachedData);
                    if (parsed.date === todayStr) {
                        setDailyAIInsight(parsed.content);
                        return; // Valid cache for today exists
                    }
                } catch (e) { console.error("Failed to parse AI insight cache:", e); }
            }

            const criticalTasks = tasks
                .filter((t) => t.status === 'todo' && t.dueDate === todayStr && t.priority === 'High')
                .map((t) => t.title);
            const todaysEvents = calendarEvents.filter((e) => toYMD(new Date(e.date)) === todayStr).map((e) => e.title);
            
            const prompt = `
                Analyze the following OS data for a neurodivergent user and generate a concise diagnostic report.
                Your goal is to identify patterns and surface actionable insights to prevent system instability (burnout, overwhelm).
                Structure your report with three markdown sections: "## ⚠️ Warnings", "## 💡 Insights", and "## ✅ Recommendations".
                - Warnings: Immediate risks (e.g., "Consistently low energy suggests burnout risk.").
                - Insights: Non-obvious connections (e.g., "Brain dump themes of 'anxiety' correlate with days with multiple meetings.").
                - Recommendations: Concrete steps (e.g., "Schedule a 30-minute 'buffer' after meetings.").
                If data for a section is insufficient, state "Insufficient data for analysis." Be direct and analytical.

                System Data:
                - Critical Tasks: ${criticalTasks.join(', ') || 'Not set'}
                - Brain Dump: """${brainDumpText || "Empty"}"""
                - Status: Mood=${statusMood || 'N/A'}, Energy=${statusEnergy || 'N/A'}
                - Sensory: Sound=${sensoryState.sound || 'N/A'}, Sight=${sensoryState.sight || 'N/A'}, Touch=${sensoryState.touch || 'N/A'}
                - Today's Calendar: ${todaysEvents.join(', ') || 'None'}
            `;
            const systemInstruction = "You are a systems diagnostician AI. Analyze user data and provide a structured report with Warnings, Insights, and Recommendations in markdown. Be direct and factual.";

            try {
                try {
                    // Use safe AI wrapper to ensure PII checks, timeouts and telemetry
                    const result = await generate(prompt, { model: 'gemini-2.5-flash', timeoutMs: 20000, config: { systemInstruction } });
                    const content = result?.text || (result?.json ? JSON.stringify(result.json) : '');
                    setDailyAIInsight(content);
                    localStorage.setItem(AI_INSIGHT_CACHE_KEY, JSON.stringify({ date: todayStr, content }));
                } catch (error) {
                    console.error('Daily AI analysis failed:', error);
                    setDailyAIInsight("AI analysis could not be completed at this time.");
                }
            } catch (error) {
                console.error("Daily AI analysis failed:", error);
                setDailyAIInsight("AI analysis could not be completed at this time.");
            }
        };

        if (hour >= 12) {
            performDailyAIAnalysis();
        }
    }, [hour, brainDumpText, calendarEvents, statusEnergy, statusMood, sensoryState, tasks]); 

    const allNudges = useMemo(() => {
        const nudges = [];

        // NUDGE: Missed Morning Meds
        if (hour >= 12 && !checkedItems['essentials-meds-am']) {
            nudges.push({
                id: 'missed-morning-meds',
                theme: 'warning',
                icon: '💊',
                title: 'System Stability Warning',
                message: "System detects morning medication has not been logged. Compliance is critical.",
                actionLabel: 'View Essentials Tracker',
                onAction: () => dispatch({ type: 'SET_VIEW', payload: 'view-daily-briefing-module' }),
            });
        }
        
        // NUDGE: High Density / Low Capacity
        const todaysEvents = calendarEvents.filter((event) => new Date(event.date).toDateString() === now.toDateString());
        if (statusEnergy === 'Low' && todaysEvents.length > 2) {
            nudges.push({
                id: 'high-density-low-energy',
                theme: 'warning',
                icon: '🔋',
                title: 'High Density / Low Capacity Alert',
                message: `System detects Low Energy combined with ${todaysEvents.length} events today. Risk of burnout is high.`,
                actionLabel: 'Review Agenda',
                onAction: () => dispatch({ type: 'SET_VIEW', payload: 'view-task-matrix-module' }),
            });
        }

        // Add other nudges here...
        // ... (parental alerts, redemptions, etc.)

        return nudges;

    }, [
        appState, // Depend on the whole appState to recalculate when anything changes
        hour, 
        now,
        dispatch,
        checkedItems,
        calendarEvents,
        statusEnergy,
    ]);

    // Filter out dismissed nudges
    return useMemo(() => {
        return allNudges.filter(nudge => !dismissedNudges.includes(nudge.id));
    }, [allNudges, dismissedNudges]);
}
