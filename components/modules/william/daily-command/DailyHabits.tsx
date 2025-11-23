import React, { useMemo } from 'react';
import { useAppState } from '@contexts/AppStateContext';

const toYMD = (date) => date.toISOString().split('T')[0];

const DailyHabits = () => {
    const { appState, dispatch } = useAppState();
    const { habitTracker, williamDashboardModules } = appState;
    
    const handleToggleHabit = (habitId) => {
        dispatch({ type: 'TOGGLE_HABIT_LOG', payload: { habitId, date: toYMD(new Date()) } });
    };

    const dailyHabitsCompletion = useMemo(() => {
        const todayLog = habitTracker.log[toYMD(new Date())] || [];
        const completedCount = habitTracker.habits.filter(habit => todayLog.includes(habit.id)).length;
        const totalCount = habitTracker.habits.length;
        return {
            completedCount,
            totalCount,
            allDone: totalCount > 0 && completedCount === totalCount,
        };
    }, [habitTracker.habits, habitTracker.log]);
    
    return (
         <details className="p-3 bg-gray-800 rounded-md border border-gray-700">
            <summary className="cursor-pointer font-bold text-accent-teal flex justify-between items-center">
                <span>
                    {dailyHabitsCompletion.allDone && '✅ '}
                    🔥 Daily Habits ({dailyHabitsCompletion.completedCount}/{dailyHabitsCompletion.totalCount})
                </span>
                {williamDashboardModules.includes('habit-streak-tracker-module') && (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById('module-habit-streak-tracker-module')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }}
                        className="text-xs font-semibold text-accent-blue hover:underline pr-2"
                        aria-label="Go to Habit Streak Tracker module"
                    >
                        Manage Habits &rarr;
                    </button>
                )}
            </summary>
             <div className="mt-2 pt-2 border-t border-gray-700 space-y-2 max-h-40 overflow-y-auto pr-2">
               {habitTracker.habits.length > 0 ? habitTracker.habits.map(habit => {
                   const isDoneToday = habitTracker.log[toYMD(new Date())]?.includes(habit.id);
                   return (
                    <label key={habit.id} className="flex items-center cursor-pointer p-2 bg-gray-900 rounded-md hover:bg-gray-700">
                        <input type="checkbox" checked={isDoneToday} onChange={() => handleToggleHabit(habit.id)} className="h-5 w-5 rounded bg-gray-700 border-gray-600 text-accent-blue focus:ring-accent-blue mr-3"/>
                        <span className={isDoneToday ? 'line-through text-gray-500' : ''}>{habit.name}</span>
                    </label>
                   );
               }) : <p className="text-sm text-gray-400 text-center">No habits being tracked.</p>}
            </div>
        </details>
    );
};

export default DailyHabits;