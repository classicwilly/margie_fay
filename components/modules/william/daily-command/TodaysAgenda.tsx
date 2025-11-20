import React, { useMemo } from 'react';
import { useAppState } from '@contexts/AppStateContext';

const toYMD = (date) => date.toISOString().split('T')[0];
const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};


const TodaysAgenda = () => {
    const { appState } = useAppState();
    const { calendarEvents, recurringTasks, tasks } = appState;

    const agendaCounts = useMemo(() => {
        const today = new Date();
        const todayStr = toYMD(today);
        today.setHours(0, 0, 0, 0);

        const eventCount = calendarEvents.filter(event => toYMD(new Date(event.date)) === todayStr).length;

        const recurringTaskCount = recurringTasks.filter(task => {
            const lastEventDate = task.lastCompletedDate ? new Date(task.lastCompletedDate) : new Date(task.startDate);
            const dueDate = addDays(lastEventDate, task.frequencyDays);
            const daysUntilDue = Math.round((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
            return daysUntilDue <= 0;
        }).length;
            
        const matrixTaskCount = tasks.filter(task => task.status === 'todo' && task.dueDate === todayStr).length;
        
        return { eventCount, taskCount: recurringTaskCount + matrixTaskCount };
    }, [calendarEvents, recurringTasks, tasks]);

    const handleViewAgenda = () => {
        const taskMatrix = document.getElementById('module-task-matrix-module');
        if (taskMatrix) {
            taskMatrix.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // We can also try to force the 'today' tab to be active if needed,
            // but for now, scrolling is the main goal.
        }
    };

    return (
        <details className="p-3 bg-gray-800 rounded-md border border-gray-700">
            <summary className="cursor-pointer font-bold text-accent-teal">
                🗓️ Today's Agenda Summary
            </summary>
             <div className="mt-2 pt-2 border-t border-gray-700 space-y-2">
                <p className="text-center text-lg">
                    You have <span className="font-bold text-accent-blue">{agendaCounts.taskCount} tasks</span> and <span className="font-bold text-accent-green">{agendaCounts.eventCount} events</span> today.
                </p>
                <button 
                    onClick={handleViewAgenda}
                    className="w-full mt-2 p-2 bg-accent-blue text-background-dark font-bold rounded hover:bg-blue-400 transition-colors"
                >
                    View Full Agenda in Task Matrix
                </button>
            </div>
        </details>
    );
};

export default TodaysAgenda;