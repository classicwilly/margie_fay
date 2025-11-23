
import React, { useState, useMemo } from 'react';
import { useAppState } from '@contexts/AppStateContext';
import useSafeAI from '../hooks/useSafeAI.js';
import { useAIPromptSafety } from '../hooks/useAIPromptSafety.js';
import AIConsentModal from '@components/AIConsentModal';
import PIIWarningModal from '@components/PIIWarningModal';
import ContentCard from './ContentCard.js';
import { SecureMarkdown } from '../utils/secureMarkdownRenderer.js';

const toYMD = (date: Date): string => date.toISOString().split('T')[0];

const DailyDebrief: React.FC = () => {
    const { appState, dispatch } = useAppState();
    const { tasks, brainDumpText, statusMood, statusEnergy } = appState;
    const [step, setStep] = useState(1);
    
    // Step 3 State
    const [wins, setWins] = useState('');
    const [friction, setFriction] = useState('');
    const [analysisText, setAnalysisText] = useState('');
    const [nextDayTask, setNextDayTask] = useState('');
    const [isAssisting, setIsAssisting] = useState(false);
    const [assistError, setAssistError] = useState('');

    const { 
        checkAndExecute, 
        isPiiModalOpen, piiMatches, handlePiiConfirm, handlePiiCancel,
        isConsentModalOpen, handleConfirm, handleCancel, dontShowAgain, setDontShowAgain 
    } = useAIPromptSafety();

    const dailyPerformance = useMemo(() => {
        const todayStr = toYMD(new Date());
        const todaysTasks = tasks.filter(t => t.dueDate === todayStr);
        const completedTasks = todaysTasks.filter(t => t.status === 'done');
        const completionRate = todaysTasks.length > 0 ? (completedTasks.length / todaysTasks.length) * 100 : 100;

        return {
            total: todaysTasks.length,
            completed: completedTasks.length,
            uncompleted: todaysTasks.filter(t => t.status === 'todo'),
            rate: completionRate,
        };
    }, [tasks]);

    const { generate } = useSafeAI();

    const handleAssistReflection = async (safePrompt?: string) => {
        setIsAssisting(true);
        setAssistError('');

        const prompt = `
            You are a systems analyst AI preparing a daily debrief for a neurodivergent user.
            Analyze the provided daily performance data and generate a DRAFT for their reflection.
            The draft should be concise and analytical.
            
            - "wins": A bulleted list of 1-2 successes based on completed tasks or a high completion rate.
            - "friction": A bulleted list of 1-2 challenges, based on uncompleted tasks, low energy, or brain dump contents.

            Daily Context:
            - Task Completion: ${dailyPerformance.completed} of ${dailyPerformance.total} tasks completed (${dailyPerformance.rate.toFixed(0)}%).
            - Uncompleted Tasks: ${dailyPerformance.uncompleted.map(t => t.title).join(', ') || 'None'}.
            - Final Status: Mood=${statusMood || 'N/A'}, Energy=${statusEnergy || 'N/A'}.
            - Final Brain Dump Thoughts: """${brainDumpText || "Empty"}"""
            
            Based on this, generate the reflection draft.
        `;

        try {
            const result = await generate(safePrompt ?? prompt, { model: 'gemini-2.5-flash', timeoutMs: 20000, skipPromptSafety: true });
            const text = result?.text || (result?.json ? JSON.stringify(result.json, null, 2) : '');
            const winsMatch = text.match(/(?:wins|successes|achievements):?\s*([\s\S]*?)(?:\n\n|##|$)/i);
            const frictionMatch = text.match(/(?:friction|challenges|blockers):?\s*([\s\S]*?)(?:\n\n|##|$)/i);
            
            setWins(winsMatch ? winsMatch[1].trim() : '');
            setFriction(frictionMatch ? frictionMatch[1].trim() : '');
            setAnalysisText(text);
        } catch (e: any) {
            setAssistError(`Failed to get assistance: ${e.message}`);
        } finally {
            setIsAssisting(false);
        }
    };
    
        const triggerAssist = () => {
            checkAndExecute("Daily debrief context data", handleAssistReflection);
    };

    const handleCompleteDebrief = () => {
        // 1. Save reflection to Knowledge Vault
        const debriefContent = `## System Diagnostics\n\n### ✅ Wins\n${wins}\n\n### ⚠️ Friction Points\n${friction}\n\n### 🎯 Critical Task for Tomorrow\n${nextDayTask}`;
        const date = new Date().toLocaleString();
        dispatch({ type: 'ADD_KNOWLEDGE_ENTRY', payload: { title: `System Diagnostics - ${date}`, content: debriefContent, tags: ['system-diagnostics'] } });

        // 2. Add critical task for tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dispatch({ type: 'ADD_TASK', payload: { title: nextDayTask, priority: 'High', dueDate: toYMD(tomorrow) } });

        // 3. Clear Brain Dump
        dispatch({ type: 'RESET_BRAIN_DUMP' });

        // 4. Move to final step
        setStep(4);
    };

    const ProgressBar = () => (
        <div className="flex justify-center items-center gap-2 my-8">
            {[1, 2, 3].map(num => (
                <div key={num} className={`w-16 h-2 rounded-full transition-colors ${step >= num ? 'bg-accent-blue' : 'bg-gray-700'}`}></div>
            ))}
        </div>
    );
    
    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <ContentCard title="Step 1: Performance Review">
                        <p className="text-gray-300 mb-4">Review today's task completion metrics.</p>
                        <div className="text-center p-6 bg-gray-800 rounded-lg">
                            <p className="text-6xl font-bold text-accent-teal">{dailyPerformance.rate.toFixed(0)}%</p>
                            <p className="text-gray-400">({dailyPerformance.completed} of ${dailyPerformance.total} tasks completed)</p>
                        </div>
                        {dailyPerformance.uncompleted.length > 0 && (
                            <div className="mt-4">
                                <h4 className="font-bold text-accent-warning">Uncompleted Tasks:</h4>
                                <ul className="list-disc list-inside text-gray-400 text-sm">
                                    {dailyPerformance.uncompleted.map(t => <li key={t.id}>{t.title}</li>)}
                                </ul>
                            </div>
                        )}
                        <button onClick={() => setStep(2)} className="w-full mt-6 p-3 bg-accent-blue text-background-dark font-bold rounded hover:bg-blue-400">Proceed to Analysis</button>
                    </ContentCard>
                );
            case 2:
                return (
                     <ContentCard title="Step 2: AI-Assisted Analysis">
                        {isConsentModalOpen && <AIConsentModal onConfirm={handleConfirm} onCancel={handleCancel} dontShowAgain={dontShowAgain} setDontShowAgain={setDontShowAgain} />}
                        {isPiiModalOpen && <PIIWarningModal isOpen={isPiiModalOpen} onCancel={handlePiiCancel} onConfirm={handlePiiConfirm} matches={piiMatches} />}
                        <p className="text-gray-300 mb-4">Let the AI analyze your day's performance, status, and remaining thoughts to identify wins and friction points.</p>
                        <button onClick={triggerAssist} disabled={isAssisting} className="w-full p-3 bg-accent-blue text-background-dark font-bold rounded hover:bg-blue-400 disabled:bg-gray-600">
                           {isAssisting ? 'Analyzing...' : '✨ Analyze Day'}
                        </button>
                         <div className="mt-4 p-3 bg-gray-800 rounded-md min-h-[150px] border border-gray-700">
                             {isAssisting && <p className="animate-pulse">Analyzing data...</p>}
                             {assistError && <p className="text-red-400">{assistError}</p>}
                             {!isAssisting && !assistError && analysisText && (
                                 <div className="prose prose-invert prose-sm max-w-none"><SecureMarkdown content={analysisText} /></div>
                             )}
                         </div>
                        <div className="flex justify-between mt-6">
                            <button onClick={() => setStep(1)} className="p-3 bg-gray-600 font-bold rounded hover:bg-gray-500">Back</button>
                            <button onClick={() => setStep(3)} className="p-3 bg-accent-blue text-background-dark font-bold rounded hover:bg-blue-400">Proceed to Final Capture</button>
                        </div>
                    </ContentCard>
                );
            case 3:
                return (
                     <ContentCard title="Step 3: Final Capture & Shutdown">
                        <p className="text-gray-300 mb-4">Finalize your reflection, define tomorrow's critical task, and complete the shutdown sequence.</p>
                        <div className="space-y-4">
                            <textarea value={wins} onChange={e => setWins(e.target.value)} placeholder="✅ What went well today? (Wins)" rows={3} className="w-full p-2 bg-gray-800 border border-gray-600 rounded" />
                            <textarea value={friction} onChange={e => setFriction(e.target.value)} placeholder="⚠️ What created friction? (Friction Points)" rows={3} className="w-full p-2 bg-gray-800 border border-gray-600 rounded" />
                            <input type="text" value={nextDayTask} onChange={e => setNextDayTask(e.target.value)} placeholder="🎯 Single Most Critical Task for Tomorrow" className="w-full p-2 bg-gray-800 border border-gray-600 rounded" required />
                        </div>
                         <div className="flex justify-between mt-6">
                            <button onClick={() => setStep(2)} className="p-3 bg-gray-600 font-bold rounded hover:bg-gray-500">Back</button>
                            <button onClick={handleCompleteDebrief} disabled={!nextDayTask.trim()} className="p-3 bg-accent-green text-background-dark font-bold rounded hover:bg-green-500 disabled:bg-gray-600">Complete Debrief & Shutdown</button>
                        </div>
                    </ContentCard>
                );
            case 4:
                      return (
                          <ContentCard title="System Diagnostics Complete">
                        <div className="text-center p-8">
                            <span className="text-5xl mb-4">🌙</span>
                            <h3 className="text-2xl font-bold text-accent-green">System Shutdown Complete</h3>
                            <p className="text-gray-300 mt-2">Your debrief is logged. The system is primed for tomorrow.</p>
                            <button onClick={() => dispatch({ type: 'SET_VIEW', payload: 'operations-control'})} className="mt-6 px-6 py-3 bg-accent-blue text-background-dark font-bold rounded hover:bg-blue-400">
                                Return to Dashboard
                            </button>
                        </div>
                    </ContentCard>
                );
            default: return null;
        }
    }

  return (
    <div>
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-accent-teal mb-4">System Diagnostics Wizard</h1>
        <p className="text-lg text-text-light text-opacity-80">
          A guided process to review, analyze, and shut down the day's operations.
        </p>
      </header>
      {step < 4 && <ProgressBar />}
      {renderStep()}
    </div>
  );
};

export default DailyDebrief;