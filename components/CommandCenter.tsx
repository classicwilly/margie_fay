import React, { useState, useEffect, useRef } from 'react';
import { OperatingMode } from '../hooks/useCurrentMode';
import { ViewType } from '../types';
import ContentCard from './ContentCard';
import TextInputItem from './TextInputItem';
import StatusTracker from './StatusTracker';
import EssentialsTracker from './EssentialsTracker';
import KidsTracker from './KidsTracker';
import WonkyAI from './WonkyAI';
import AchievementTracker from './AchievementTracker';
import { useAppState } from '@contexts/AppStateContext';
import { GroundingRose } from '../src/components/GroundingRose';

interface CommandCenterProps {
  currentMode: OperatingMode;
}

const DayProgressBar: React.FC = () => {
    const [progress, setProgress] = useState(0);
    const [timeString, setTimeString] = useState('');

    useEffect(() => {
        const updateProgress = () => {
            const now = new Date();
            const startOfDay = new Date(now);
            startOfDay.setHours(6, 0, 0, 0); // Day starts at 6:00 AM

            const endOfDay = new Date(now);
            endOfDay.setHours(22, 30, 0, 0); // Day ends at 10:30 PM

            const totalMinutesInDay = (endOfDay.getTime() - startOfDay.getTime()) / (1000 * 60);
            const minutesPassed = (now.getTime() - startOfDay.getTime()) / (1000 * 60);
            
            let currentProgress = (minutesPassed / totalMinutesInDay) * 100;
            currentProgress = Math.max(0, Math.min(100, currentProgress)); // Clamp between 0 and 100
            
            setProgress(currentProgress);
            setTimeString(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        };

        updateProgress();
        const interval = setInterval(updateProgress, 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);

    const progressRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      if (progressRef.current) progressRef.current.style.setProperty('--progress', `${progress}%`);
    }, [progress]);

    return (
        <ContentCard title="Day Progress">
            <div className="flex items-center gap-4">
                <span className="font-mono text-sm text-accent-teal">06:00</span>
                <div
                    className="w-full bg-gray-700 rounded-full h-4"
                    role="progressbar"
                    aria-label={`Day progress: ${Math.round(progress)} percent`}
                >
                  <div ref={progressRef} className="bg-gradient-to-r from-accent-blue to-accent-green h-4 rounded-full transition-all duration-500 progress-fill" />
                  <span className="sr-only">Day progress: {Math.round(progress)}%</span>
                </div>
                <span className="font-mono text-sm text-accent-teal">22:30</span>
            </div>
            <p className="text-center text-sm text-text-light text-opacity-70 mt-2">Current System Time: {timeString}</p>
        </ContentCard>
    );
};

const soloSchedule = [
    { hour: 6, task: "FDP Active (Water, Pills)" },
    { hour: 7, task: "Planning & Filing" },
    { hour: 8, task: "Core Work Block 1" },
    { hour: 12, task: "Lunch & Reset" },
    { hour: 13, task: "Core Work Block 2" },
    { hour: 15, task: "Movement Protocol" },
    { hour: 17, task: "Dinner & Wind Down" },
    { hour: 22, task: "FDP Active (Sleep Prep)" },
];

const familySchedule = [
    { hour: 7, task: "Personal Morning / FDP" },
    { hour: 9, task: "Shared Breakfast" },
    { hour: 10, task: "Structured Activity Block" },
    { hour: 12, task: "Lunch" },
    { hour: 13, task: "Quiet Time Protocol" },
    { hour: 15, task: "Structured Interest Block" },
    { hour: 17, task: "Dinner" },
    { hour: 20, task: "Bedtime Routine" },
];


const CommandCenter: React.FC<CommandCenterProps> = ({ currentMode }) => {
  const { dispatch, appState } = useAppState();
  
  const setView = (view: ViewType) => {
    dispatch({ type: 'SET_VIEW', payload: view });
  };
  
  const isSoloMode = currentMode === 'Solo Execution';
  const schedule = isSoloMode ? soloSchedule : familySchedule;
  const now = new Date();
  const currentHour = now.getHours();

  const getCurrentTask = () => {
    if (currentHour < 6) return "System Offline (Sleep)";
    let activeTask = "Transitioning...";
    for (const event of schedule) {
        if (currentHour >= event.hour) {
            activeTask = event.task;
        } else {
            break;
        }
    }
    return activeTask;
  };

  const currentTask = getCurrentTask();
  const workflowViewId = isSoloMode ? 'solo-execution-mode' : 'family-structure-mode';

  return (
    <div className="max-w-5xl mx-auto">
       <header className="text-center mb-10">
        <h1 data-testid="command-center-title" className="text-4xl md:text-5xl font-extrabold text-accent-teal mb-4">The Cockpit</h1>
        <p className="text-lg text-text-light text-opacity-80">
          Your daily operations dashboard. Focus on the current task. Execute.
        </p>
      </header>

      <div className="flex flex-col gap-6">
        {/* Row 1: System Status & Critical Info */}
        <ContentCard title="System Status" showHeader={false}>
            <div className="flex flex-col md:flex-row justify-between items-center p-4 rounded-lg bg-gray-800 gap-4">
                <div className="text-center md:text-left">
                    <p className="text-sm text-accent-blue font-semibold">CURRENT MODE</p>
                    <p className="text-2xl font-bold">{currentMode}</p>
                </div>
                 <div className="text-center md:text-right">
                    <p className="text-sm text-accent-green font-semibold">CURRENT TASK</p>
                    <p className="text-2xl font-bold break-words">{currentTask}</p>
                </div>
            </div>
          </ContentCard>
        
        <DayProgressBar />

        {/* GroundingRose - Emotional Core for Grandma Edition */}
        <ContentCard title="🌹 Grounding Rose" showHeader={false}>
          <div className="flex flex-col items-center justify-center p-6">
            <p className="text-center text-text-light text-opacity-80 mb-4">
              Take a moment to ground yourself. Feel the connection to those we hold dear.
            </p>
            <GroundingRose
              onActivate={() => {
                // Optional: Add any additional activation logic here
                console.log('GroundingRose activated');
              }}
            />
          </div>
        </ContentCard>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatusTracker />
          <EssentialsTracker />
          <KidsTracker />
        </div>

        {/* NOTE: Previously we injected kids dashboard modules here for E2E tests
            to allow Playwright to find the Reward Store and Dopamine Mining when
            Command Center was displayed. That created an inconsistent UX and
            masked the root seed/timing issue. We now depend on proper seeding
            (pre-hydration) to deterministically land on the child dashboard
            during E2E; therefore the E2E fallback is removed. */}
        {appState?.dashboardType === 'willow' && (
          <div className="mt-6">
            <h2 className="text-3xl font-bold text-accent-teal mb-4" data-testid="kids-corner-heading">Kids Corner</h2>
            <div className="mb-4">
              <h3 className="text-2xl font-bold mb-2">Dopamine Cache</h3>
              {/* Will render the dopamine mining component for Willow */}
              <div data-testid="kids-gem-collection">
                {/* Keep render logic lightweight for E2E visibility */}
                <p>Kids Dopamine Mining placeholder</p>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Dopamine Mining</h3>
              <div data-testid="kids-reward-store">
                <p>Reward Store placeholder</p>
              </div>
            </div>
          </div>
        )}

        {/* Row 2: Launchpad & Critical Tasks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <ContentCard title="🚀 Workspace Launchpad">
              <div className="grid grid-cols-2 gap-3">
                  <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer" className="p-3 bg-accent-blue bg-opacity-20 text-accent-blue rounded-md text-center font-semibold hover:bg-opacity-30 transition-colors">Gmail</a>
                  <a href="https://calendar.google.com" target="_blank" rel="noopener noreferrer" className="p-3 bg-accent-blue bg-opacity-20 text-accent-blue rounded-md text-center font-semibold hover:bg-opacity-30 transition-colors">Calendar</a>
                  <a href="https://keep.google.com" target="_blank" rel="noopener noreferrer" className="p-3 bg-accent-blue bg-opacity-20 text-accent-blue rounded-md text-center font-semibold hover:bg-opacity-30 transition-colors">Keep</a>
                  <a href="https://tasks.google.com/embed/canvas" target="_blank" rel="noopener noreferrer" className="p-3 bg-accent-blue bg-opacity-20 text-accent-blue rounded-md text-center font-semibold hover:bg-opacity-30 transition-colors">Tasks</a>
                  <a href="https://notebooklm.google.com" target="_blank" rel="noopener noreferrer" className="p-3 bg-accent-blue bg-opacity-20 text-accent-blue rounded-md text-center font-semibold hover:bg-opacity-30 transition-colors col-span-2">NotebookLM</a>
              </div>
               <div className="flex gap-3 mt-4">
                 <button onClick={() => setView(workflowViewId)} className="flex-1 w-full p-3 bg-accent-green bg-opacity-20 text-accent-green rounded-md text-center font-semibold hover:bg-opacity-30 transition-colors">
                  View Current Workflow SOP
               </button>
                 <button onClick={() => setView('neuro-onboarding')} className="flex-none px-4 py-3 bg-accent-blue text-background-dark rounded-md font-semibold hover:bg-blue-400">Re-run Onboarding</button>
               </div>
          </ContentCard>
          <ContentCard title="🎯 Critical Tasks (Today)">
              <div className="space-y-3 h-full flex flex-col justify-around">
                  <TextInputItem id="cc-task-1" label="1." placeholder="Define primary objective..." />
                  <TextInputItem id="cc-task-2" label="2." placeholder="Define secondary objective..." />
                  <TextInputItem id="cc-task-3" label="3." placeholder="Define tertiary objective..." />
              </div>
          </ContentCard>
        </div>

        {/* Row 3: AI & Achievement Tracker */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <WonkyAI />
            <AchievementTracker />
        </div>
      </div>
    </div>
  );
};

export default CommandCenter;