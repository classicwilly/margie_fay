import { useMemo } from 'react';
import { useAppState } from '@contexts/AppStateContext';
import type { Task } from '../src/types';
import type { AppState } from '../src/contexts/types';

const toYMD = (date: Date) => date.toISOString().split('T')[0];

export function useSystemHealth() {
    const { appState } = useAppState();

    const healthData = useMemo(() => {
        if (!appState) {
            return {
                score: 0,
                diagnostics: [{ message: "System state not loaded.", type: 'negative' }],
                stateColor: 'text-gray-500',
                stateDescription: 'Offline',
                sproutState: 'wilted',
            };
        }

        let score = 100;
        const diagnostics: { message: string, type: 'positive' | 'negative' }[] = [];
        const { checkedItems, tasks, statusMood, statusEnergy, habitTracker } = appState as AppState;

        // 1. Foundational Protocols (Essentials are critical)
        const morningMedsDone = checkedItems['essentials-meds-am'];
        const firstWaterDone = checkedItems['essentials-water-1'];
        const breakfastDone = checkedItems['essentials-food-1'];

        if (!morningMedsDone) {
            score -= 25;
            diagnostics.push({ message: "Morning medication not logged.", type: 'negative' });
        }
        if (!firstWaterDone) {
            score -= 15;
            diagnostics.push({ message: "Initial hydration protocol missed.", type: 'negative' });
        }
        if (!breakfastDone) {
            score -= 10;
            diagnostics.push({ message: "Morning nutrition not logged.", type: 'negative' });
        }
        if (morningMedsDone && firstWaterDone && breakfastDone) {
            diagnostics.push({ message: "Foundational protocols engaged.", type: 'positive' });
        }

        // 2. User Status
        if (statusMood === 'Overwhelmed') {
            score -= 20;
            diagnostics.push({ message: "Mood: Overwhelmed. System strain detected.", type: 'negative' });
        }
        if (statusEnergy === 'Low') {
            score -= 20;
            diagnostics.push({ message: "Energy: Low. Capacity reduced.", type: 'negative' });
        }
        if (statusMood === 'Focused' || statusMood === 'Calm') {
            diagnostics.push({ message: `Mood status nominal: ${statusMood}.`, type: 'positive' });
        }

        // 3. Task Velocity
        const todayStr = toYMD(new Date());
        const todaysTasks = (tasks as Task[]).filter((t: Task) => t.dueDate === todayStr);
        const completedToday = todaysTasks.filter((t: Task) => t.status === 'done').length;
        if (todaysTasks.length > 0) {
            const completionRatio = completedToday / todaysTasks.length;
            if (completionRatio > 0.5) {
                diagnostics.push({ message: `Task velocity nominal (${completedToday}/${todaysTasks.length} complete).`, type: 'positive' });
            } else {
                score -= 15;
                diagnostics.push({ message: `Task velocity low (${todaysTasks.length - completedToday} tasks remain).`, type: 'negative' });
            }
        } else {
            diagnostics.push({ message: "No tasks scheduled for today.", type: 'positive' });
        }
        

        // 4. Habit Compliance
        const todayHabitsLog = habitTracker.log[todayStr] || [];
        const totalHabits = habitTracker.habits.length;
        if (totalHabits > 0) {
            const completionRatio = todayHabitsLog.length / totalHabits;
            if (completionRatio === 1) {
                diagnostics.push({ message: "All daily habits completed.", type: 'positive' });
            } else {
                score -= 10;
                diagnostics.push({ message: `${totalHabits - todayHabitsLog.length} habits pending.`, type: 'negative' });
            }
        }
        
        const finalScore = Math.max(0, Math.round(score));
        
        let sproutState = 'normal';
        let stateColor = 'text-accent-teal';
        let stateDescription = 'System Stable';
        if (finalScore >= 80) {
            sproutState = 'healthy';
            stateColor = 'text-accent-green';
            stateDescription = 'System Optimal';
        } else if (finalScore < 40) {
            sproutState = 'wilted';
            stateColor = 'text-accent-warning';
            stateDescription = 'Warning: System Strain';
        }

        return { score: finalScore, diagnostics, stateColor, stateDescription, sproutState };

    }, [appState]);

    return healthData;
}