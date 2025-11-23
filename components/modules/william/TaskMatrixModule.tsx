
import React, { useState, useMemo, useEffect } from 'react';
import { useAppState } from '@contexts/AppStateContext';
import ContentCard from '../../ContentCard.js';
import { SOP_DATA } from '../../../constants.js';
import DailyTimeline from './task-matrix/DailyTimeline.js';

const toYMD = (date) => date.toISOString().split('T')[0];
const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

// --- URGENT TASK MODAL ---
const UrgentTaskModal = ({
    isOpen,
    onClose,
}) => {
    const { appState, dispatch } = useAppState();
    const [title, setTitle] = useState('');
    const [impact, setImpact] = useState('low');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        const todayStr = toYMD(new Date());
        
        dispatch({
            type: 'ADD_TASK',
            payload: { title: `URGENT: ${title.trim()}`, priority: 'High', dueDate: todayStr }
        });

        if (impact === 'high' && appState.isFocusModeActive && appState.focusModeTaskId) {
            // Suggest snoozing the current task if in focus mode
            dispatch({ type: 'SNOOZE_TASK', payload: { taskId: appState.focusModeTaskId } });
            // In a more complex app, we might set the new urgent task as the focus task
        }
        
        onClose();
        setTitle('');
        setImpact('low');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-card-dark rounded-lg shadow-2xl p-6 border border-accent-warning w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <h3 className="text-2xl font-bold text-accent-warning mb-4">🚨 Urgent Task Interruption Protocol</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="urgent-task-title" className="block text-sm font-medium mb-1">What is the urgent task?</label>
                        <input id="urgent-task-title" type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-600 rounded" required autoFocus />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Impact Assessment:</label>
                        <div className="flex gap-4">
                            <button type="button" onClick={() => setImpact('high')} className={`w-full p-3 rounded border-2 ${impact === 'high' ? 'bg-red-800/50 border-red-500' : 'bg-gray-800 border-gray-700 hover:border-red-600'}`}>
                                <p className="font-bold">High Impact</p>
                                <p className="text-xs">Must be done immediately, dropping everything else.</p>
                            </button>
                            <button type="button" onClick={() => setImpact('low')} className={`w-full p-3 rounded border-2 ${impact === 'low' ? 'bg-yellow-800/50 border-yellow-500' : 'bg-gray-800 border-gray-700 hover:border-yellow-600'}`}>
                                <p className="font-bold">Low Impact</p>
                                <p className="text-xs">Urgent, but can be done after current commitments.</p>
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 rounded">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-accent-blue text-background-dark font-bold rounded">Integrate Task</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// --- SOP GENERATOR MODAL ---
const SopGeneratorModal = ({
    isOpen,
    onClose,
    templates,
    onSelect,
}) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="bg-card-dark rounded-lg shadow-2xl p-6 border border-gray-700 w-full max-w-lg m-4" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold text-accent-teal mb-4">Generate Tasks from SOP</h3>
                {templates.length > 0 ? (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {templates.map(sop => (
                            <button key={sop.id} onClick={() => onSelect(sop)} className="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-md">
                                <p className="font-semibold">{sop.title}</p>
                                <p className="text-xs text-gray-400">{sop.taskTemplate?.length} tasks</p>
                            </button>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-400 p-4">No SOPs with task templates found.</p>
                )}
            </div>
        </div>
    );
};

// --- TRIAGE MODE SUB-COMPONENT ---
const TriageView = ({
    inboxTasks,
    triageTaskId,
}) => {
    const { dispatch } = useAppState();
    const [isScheduling, setIsScheduling] = useState(false);
    const [scheduleDate, setScheduleDate] = useState(toYMD(addDays(new Date(), 7)));

    const currentTask = useMemo(() => inboxTasks.find(item => item.id === triageTaskId), [inboxTasks, triageTaskId]);
    
    // FIX: Made deferId optional to allow calling without an argument.
    const findNextTask = (deferId?: string) => {
        const currentIndex = inboxTasks.findIndex(item => item.id === (deferId || triageTaskId));
        return inboxTasks[currentIndex + 1] || null;
    };

    // FIX: Made deferId optional to allow calling without an argument.
    const advanceToNext = (deferId?: string) => {
        const nextTask = findNextTask(deferId);
        if (nextTask) {
            dispatch({ type: 'SET_TRIAGE_TASK', payload: { taskId: nextTask.id } });
        } else {
            dispatch({ type: 'STOP_TRIAGE_MODE' });
        }
    };
    
    const handleDoToday = () => {
        if (!currentTask) return;
        dispatch({ type: 'UPDATE_TASK', payload: { id: currentTask.id, dueDate: toYMD(new Date()) } });
        advanceToNext();
    };

    const handleSchedule = () => {
        if (!currentTask) return;
        dispatch({ type: 'UPDATE_TASK', payload: { id: currentTask.id, dueDate: scheduleDate } });
        setIsScheduling(false);
        advanceToNext();
    };

    const handleDelete = () => {
        if (!currentTask) return;
        dispatch({ type: 'DELETE_TASK', payload: currentTask.id });
        advanceToNext();
    };
    
    const handleDefer = () => {
        if (!currentTask) return;
        advanceToNext(currentTask.id);
    };

    const handleExit = () => dispatch({ type: 'STOP_TRIAGE_MODE' });

    if (!currentTask) {
        return (
            <div className="text-center p-8 flex flex-col items-center justify-center">
                <span className="text-5xl mb-4">📥✨</span>
                <h3 className="text-2xl font-bold text-accent-green">Inbox Zero!</h3>
                <p className="text-gray-400 mt-2">All captured chaos has been processed into structure.</p>
                <button onClick={handleExit} className="mt-6 px-6 py-3 bg-accent-blue text-background-dark font-bold rounded hover:bg-blue-400">
                    Exit Triage
                </button>
            </div>
        );
    }
    
    return (
        <div className="p-4 flex flex-col items-center justify-center min-h-[450px]">
            <p className="text-sm text-accent-teal mb-2 font-semibold">PROCESS THIS ITEM:</p>
            <div className="w-full max-w-lg p-6 bg-gray-800 rounded-lg border border-gray-700 text-center">
                <p className="text-2xl font-bold text-text-light">{currentTask.title}</p>
            </div>
            
            {isScheduling ? (
                <div className="mt-4 flex items-center gap-2 p-3 bg-gray-800 rounded-md">
                    <label htmlFor="schedule-date" className="sr-only">Schedule Date</label>
                    <input id="schedule-date" type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} className="p-2 bg-gray-900 border border-gray-600 rounded" />
                    <button onClick={handleSchedule} className="px-4 py-2 bg-accent-green text-background-dark font-bold rounded">Set Date</button>
                    <button onClick={() => setIsScheduling(false)} className="px-4 py-2 bg-gray-600 rounded">Cancel</button>
                </div>
            ) : (
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 items-center gap-4">
                    <button onClick={handleDoToday} className="px-4 py-3 bg-accent-green text-background-dark font-bold rounded hover:bg-green-500">Do Today</button>
                    <button onClick={() => setIsScheduling(true)} className="px-4 py-3 bg-accent-blue text-background-dark font-bold rounded hover:bg-blue-400">Schedule</button>
                    <button onClick={handleDefer} className="px-4 py-3 bg-gray-600 text-gray-300 rounded hover:bg-gray-500">Defer</button>
                    <button onClick={handleDelete} className="px-4 py-3 bg-red-800 text-red-200 rounded hover:bg-red-700">Delete</button>
                </div>
            )}
            
            <button onClick={handleExit} className="mt-8 text-sm text-gray-500 hover:text-gray-300">Exit Triage</button>
        </div>
    );
};


// --- FOCUS MODE SUB-COMPONENT ---
const FocusView = ({
    agenda,
    focusTaskId,
    snoozedTaskIds,
    onStartTimer,
}) => {
    const { dispatch } = useAppState();

    const currentTask = useMemo(() => agenda.find(item => item.id === focusTaskId), [agenda, focusTaskId]);
    
    const findNextTask = () => {
        const currentIndex = agenda.findIndex(item => item.id === focusTaskId);
        for (let i = currentIndex + 1; i < agenda.length; i++) {
            const item = agenda[i];
            if (item.itemType !== 'event' && !item.completedAt && !snoozedTaskIds.includes(item.id)) {
                return item;
            }
        }
        return null; // No more tasks
    };

    const handleComplete = () => {
        if (!currentTask || currentTask.itemType === 'event') return;
        
        const actionType = currentTask.itemType === 'recurring' ? 'COMPLETE_RECURRING_TASK' : 'UPDATE_TASK';
        const payload = actionType === 'UPDATE_TASK' 
            ? { id: currentTask.id, status: 'done' }
            : currentTask.id.replace('recurring-', '');
            
        dispatch({ type: actionType, payload });

        const nextTask = findNextTask();
        dispatch({ type: 'SET_FOCUS_TASK', payload: { taskId: nextTask ? nextTask.id : null } });
    };

    const handleSnooze = () => {
        if (!currentTask) return;
        dispatch({ type: 'SNOOZE_TASK', payload: { taskId: currentTask.id } });
        
        const nextTask = findNextTask();
        dispatch({ type: 'SET_FOCUS_TASK', payload: { taskId: nextTask ? nextTask.id : null } });
    };

    const handleExit = () => dispatch({ type: 'STOP_FOCUS_MODE' });

    if (!currentTask) {
        return (
            <div className="text-center p-8 flex flex-col items-center justify-center">
                <span className="text-5xl mb-4">🎉</span>
                <h3 className="text-2xl font-bold text-accent-green">All Tasks for Today Complete!</h3>
                <p className="text-gray-400 mt-2">Excellent work. System is stable.</p>
                <button onClick={handleExit} className="mt-6 px-6 py-3 bg-accent-blue text-background-dark font-bold rounded hover:bg-blue-400">
                    Exit Focus Mode
                </button>
            </div>
        );
    }
    
    const priorityColors = { 'High': 'border-red-500', 'Medium': 'border-yellow-500', 'Low': 'border-gray-600' };
    const task = currentTask; // We know it's a task in focus mode

    return (
        <div className="p-4 flex flex-col items-center justify-center min-h-[450px]">
            <p className="text-sm text-accent-teal mb-2 font-semibold">THE NEXT OBJECTIVE IS:</p>
            <div className={`w-full max-w-lg p-6 bg-gray-800 rounded-lg border-l-8 ${priorityColors[task.priority]}`}>
                <p className="text-2xl font-bold text-text-light">{task.title}</p>
                <p className="text-sm text-gray-400 mt-2">Priority: {task.priority}</p>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
                <button onClick={handleComplete} className="px-10 py-4 bg-accent-green text-background-dark font-bold rounded text-lg hover:bg-green-500 w-full sm:w-auto">
                    ✓ Complete
                </button>
                <button onClick={handleSnooze} className="px-4 py-2 bg-gray-600 text-gray-300 rounded hover:bg-gray-500">Snooze (15m)</button>
                <button onClick={() => onStartTimer(currentTask ? currentTask.id : null)} className="px-4 py-2 bg-accent-blue text-background-dark rounded hover:bg-blue-400">Start 25-min Timer</button>
            </div>
            <button onClick={handleExit} className="mt-8 text-sm text-gray-500 hover:text-gray-300">Exit Focus Mode</button>
        </div>
    );
};

// --- TASK ITEM SUB-COMPONENT ---
// FIX: Explicitly typed component with React.FC and a props interface to handle the `key` prop correctly.
interface TaskItemProps {
    task: any;
    onUpdate: (id: string, updates: any) => void;
    onDelete: (id: string) => void;
    onEdit: (task: any) => void;
    projects: any[];
}
const TaskItem: React.FC<TaskItemProps> = ({
    task,
    onUpdate,
    onDelete,
    onEdit,
    projects,
}) => {
    const isCompleted = task.status === 'done';
    const priorityColors = {
        'High': 'border-red-500',
        'Medium': 'border-yellow-500',
        'Low': 'border-gray-600',
    };
    const project = useMemo(() => 
        projects.find(p => p.id === task.projectId), 
        [projects, task.projectId]
    );

    return (
        <div className={`p-3 bg-gray-800 rounded-md border-l-4 flex items-center gap-3 transition-opacity ${priorityColors[task.priority]} ${isCompleted ? 'opacity-50' : ''}`}>
            <input
                type="checkbox"
                checked={isCompleted}
                onChange={() => onUpdate(task.id, { status: isCompleted ? 'todo' : 'done' })}
                className="h-5 w-5 rounded bg-gray-700 border-gray-600 text-accent-blue focus:ring-accent-blue flex-shrink-0"
                aria-label={`Mark task as ${isCompleted ? 'not done' : 'done'}`}
                // Recurring tasks cannot be "un-completed" from this view. Once done, they are recalculated.
                disabled={isCompleted && task.itemType === 'recurring'}
            />
            <div className="flex-grow">
                <p className={`${isCompleted ? 'line-through text-gray-500' : ''}`}>{task.title}</p>
                <div className="text-xs text-gray-400 flex items-center gap-2 flex-wrap mt-1">
                    {task.dueDate && <span>Due: {task.dueDate}</span>}
                    {project && <span className="px-1.5 py-0.5 bg-purple-900/50 text-purple-300 rounded-full text-xs">🎯 {project.title}</span>}
                    {task.itemType === 'recurring' && <span className="px-1.5 py-0.5 bg-blue-900/50 text-blue-300 rounded-full text-xs">Recurring</span>}
                </div>
            </div>
            {!isCompleted && (
                 <div className="flex-shrink-0 flex gap-1">
                    {task.itemType !== 'recurring' && <button onClick={() => onEdit(task)} className="p-2 text-gray-400 hover:text-white" aria-label="Edit task">✏️</button>}
                    <button onClick={() => onDelete(task.id)} className="p-2 text-gray-400 hover:text-red-500" aria-label="Delete task">🗑️</button>
                </div>
            )}
        </div>
    );
};


const TaskMatrixModule = () => {
    const { appState, dispatch } = useAppState();
    const { tasks, recurringTasks, calendarEvents, isFocusModeActive, focusModeTaskId, snoozedTaskIds, userSops, modifiedSops, isTriageModeActive, triageTaskId, projects } = appState;
    const [view, setView] = useState('today');
    const [editingTask, setEditingTask] = useState(null);
    const [isSopGeneratorOpen, setSopGeneratorOpen] = useState(false);
    const [isUrgentModalOpen, setIsUrgentModalOpen] = useState(false);

    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [projectId, setProjectId] = useState('');
    
    const detailsRef = React.useRef(null);

    useEffect(() => {
        if (editingTask) {
            setTitle(editingTask.title);
            setDueDate(editingTask.dueDate || '');
            setPriority(editingTask.priority);
            setProjectId(editingTask.projectId || '');
            if (detailsRef.current) detailsRef.current.open = true;
        } else {
            setTitle(''); setDueDate(''); setPriority('Medium'); setProjectId('');
        }
    }, [editingTask]);

    const todayStr = useMemo(() => toYMD(new Date()), []);
    
    const fullAgenda = useMemo(() => {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const todaysCalEvents = calendarEvents.filter(event => toYMD(new Date(event.date)) === todayStr).map(e => ({ ...e, itemType: 'event' }));
        const dueRecurring = recurringTasks.filter(task => {
                const lastEventDate = task.lastCompletedDate ? new Date(task.lastCompletedDate) : new Date(task.startDate);
                const dueDate = addDays(lastEventDate, task.frequencyDays);
                return Math.round((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24)) <= 0;
            }).map(task => ({
                ...task, id: `recurring-${task.id}`, status: 'todo', dueDate: todayStr, priority: 'Medium', createdAt: task.startDate, completedAt: null, itemType: 'recurring',
            }));
        const todayT = tasks.filter(t => t.status === 'todo' && t.dueDate === todayStr).map(t => ({ ...t, itemType: 'task' }));
        
        const agenda = [...todaysCalEvents, ...dueRecurring, ...todayT];
        agenda.sort((a, b) => {
            const timeA = a.itemType === 'event' ? new Date(a.date).getTime() : Infinity;
            const timeB = b.itemType === 'event' ? new Date(b.date).getTime() : Infinity;
            if (timeA !== timeB) return timeA - timeB;
            const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
            const priorityA = 'priority' in a ? priorityOrder[a.priority] : 4;
            const priorityB = 'priority' in b ? priorityOrder[b.priority] : 4;
            return priorityA - priorityB;
        });
        return agenda;
    }, [calendarEvents, recurringTasks, tasks, todayStr]);

    const { upcomingTasks, inboxTasks, completedTasks } = useMemo(() => {
        return {
            upcomingTasks: tasks.filter(t => t.status === 'todo' && t.dueDate && t.dueDate > todayStr).sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()),
            inboxTasks: tasks.filter(t => t.status === 'todo' && !t.dueDate),
            completedTasks: tasks.filter(t => t.status === 'done').sort((a,b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()),
        };
    }, [tasks, todayStr]);

    // SOP Task Generator Logic
    const allSops = useMemo(() => 
        SOP_DATA.map(sop => modifiedSops[sop.id] || sop).concat(userSops),
        [modifiedSops, userSops]
    );
    const sopTemplates = useMemo(() => 
        allSops.filter(sop => sop.taskTemplate && sop.taskTemplate.length > 0),
        [allSops]
    );
    const handleGenerateFromSop = (sop) => {
        sop.taskTemplate?.forEach(task => {
            dispatch({
                type: 'ADD_TASK',
                payload: { title: task.title, priority: task.priority, dueDate: null }
            });
        });
        setSopGeneratorOpen(false);
        setView('inbox');
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        const taskPayload = {
            title: title.trim(),
            dueDate: dueDate || null,
            priority,
            projectId: projectId || undefined,
        };

        if (editingTask) {
            dispatch({ type: 'UPDATE_TASK', payload: { id: editingTask.id, ...taskPayload } });
            setEditingTask(null);
        } else {
            dispatch({ type: 'ADD_TASK', payload: taskPayload });
        }
        setTitle(''); setDueDate(''); setPriority('Medium'); setProjectId('');
        if (detailsRef.current && !editingTask) detailsRef.current.open = false;
    };
    
    const handleUpdateTask = (id, updates) => {
        if (id.startsWith('recurring-')) {
            dispatch({ type: 'COMPLETE_RECURRING_TASK', payload: id.replace('recurring-', '') });
        } else {
            dispatch({ type: 'UPDATE_TASK', payload: { id, ...updates } });
        }
    };

    const handleDeleteTask = (id) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            if (id.startsWith('recurring-')) {
                dispatch({ type: 'REMOVE_RECURRING_TASK', payload: id.replace('recurring-', '') });
            } else {
                dispatch({ type: 'DELETE_TASK', payload: id });
            }
        }
    };
    
    const handleEditClick = (task) => setEditingTask(task);
    const handleCancelEdit = () => {
        setEditingTask(null);
        if (detailsRef.current) detailsRef.current.open = false;
    };
    
    const handleStartFocus = () => {
        const firstTask = fullAgenda.find(item => item.itemType !== 'event' && !item.completedAt);
        dispatch({ type: 'START_FOCUS_MODE', payload: { firstTaskId: firstTask ? firstTask.id : null } });
    };

    const handleStartTriage = () => {
        const firstTask = inboxTasks[0];
        dispatch({ type: 'START_TRIAGE_MODE', payload: { firstTaskId: firstTask ? firstTask.id : null } });
    };
    
    const handleStartTimer = (taskId) => {
        if (!taskId) return;
        dispatch({ type: 'POMODORO_SET_TASK_ID', payload: { taskId } });
        dispatch({ type: 'POMODORO_SET_MODE', payload: 'work' });
        dispatch({ type: 'POMODORO_TOGGLE' });
        document.getElementById('module-pomodoro-timer-module')?.scrollIntoView({ behavior: 'smooth' });
    };

    const filteredList = useMemo(() => {
        switch (view) {
            case 'inbox': return inboxTasks.map(t => ({...t, itemType: 'task'}));
            case 'today': return fullAgenda;
            case 'upcoming': return upcomingTasks.map(t => ({...t, itemType: 'task'}));
            case 'completed': return completedTasks.map(t => ({...t, itemType: 'task'}));
            default: return [];
        }
    }, [view, fullAgenda, inboxTasks, upcomingTasks, completedTasks]);
    
    const TabButton = ({ label, targetView, count }) => (
        <button onClick={() => setView(targetView)} className={`px-3 py-2 text-sm font-semibold rounded-t-md transition-colors w-full ${view === targetView ? 'bg-card-dark border-b-2 border-accent-blue text-accent-blue' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
            {label} ({count})
        </button>
    );
    
    const isFocusPossible = fullAgenda.some(item => item.itemType !== 'event' && !item.completedAt);
    const isTriagePossible = inboxTasks.length > 0;

    if (isFocusModeActive) {
        return (
            <ContentCard title="⚡️ Task Matrix: Focus Mode">
                <FocusView agenda={fullAgenda} focusTaskId={focusModeTaskId} snoozedTaskIds={snoozedTaskIds} onStartTimer={handleStartTimer} />
            </ContentCard>
        );
    }

    if (isTriageModeActive) {
        return (
            <ContentCard title="⚡️ Task Matrix: Inbox Triage">
                <TriageView inboxTasks={inboxTasks} triageTaskId={triageTaskId} />
            </ContentCard>
        );
    }

    return (
        <ContentCard title="⚡️ Task Matrix">
             <UrgentTaskModal isOpen={isUrgentModalOpen} onClose={() => setIsUrgentModalOpen(false)} />
             <div className="flex flex-col h-full min-h-[500px]">
                <div className="flex border-b border-gray-700">
                    <TabButton label="Inbox" targetView="inbox" count={inboxTasks.length} />
                    <TabButton label="Today" targetView="today" count={fullAgenda.length} />
                    <TabButton label="Upcoming" targetView="upcoming" count={upcomingTasks.length} />
                    <TabButton label="Completed" targetView="completed" count={completedTasks.length} />
                </div>

                <div className="flex-grow pt-4 overflow-y-auto max-h-[28rem] pr-2 space-y-4">
                     <div className="space-y-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {view === 'today' && (
                                <button onClick={handleStartFocus} disabled={!isFocusPossible} className="w-full p-2 bg-accent-teal text-background-dark font-bold rounded hover:bg-teal-400 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed text-sm">
                                ✨ Start Focus Session
                                </button>
                            )}
                            {view === 'inbox' && (
                                <button onClick={handleStartTriage} disabled={!isTriagePossible} className="w-full p-2 bg-yellow-500 text-background-dark font-bold rounded hover:bg-yellow-400 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed text-sm">
                                ⚡️ Start Triage Session
                                </button>
                            )}
                            {view === 'inbox' && (
                                <button onClick={() => setSopGeneratorOpen(true)} className="w-full p-2 bg-accent-purple text-white font-bold rounded hover:bg-purple-500 transition-colors text-sm">
                                    Generate from SOP
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                             <button onClick={() => dispatch({ type: 'SET_CONTEXT_CAPTURE_MODAL_OPEN', payload: true })} className="w-full p-2 bg-yellow-600 text-background-dark font-bold rounded hover:bg-yellow-500 transition-colors text-sm">
                               ⏸️ Interrupt
                            </button>
                             <button onClick={() => setIsUrgentModalOpen(true)} className="w-full p-2 bg-accent-warning text-background-dark font-bold rounded hover:bg-yellow-400 transition-colors text-sm">
                               🚨 Urgent Task
                            </button>
                        </div>
                    </div>
                    {view === 'today' && (
                        <DailyTimeline events={fullAgenda.filter(item => item.itemType === 'event')} />
                    )}
                    <div className="space-y-2">
                        {filteredList.length > 0 ? (
                            filteredList.map(item => {
                                if (item.itemType === 'event') {
                                    return (
                                        <div key={item.id} className="p-2 bg-gray-900/50 rounded-md flex items-center text-sm">
                                            <span className="mr-3">🗓️</span>
                                            <span className="font-bold text-accent-blue w-20 flex-shrink-0">{new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            <span>{item.title}</span>
                                        </div>
                                    );
                                }
                                return <TaskItem key={item.id} task={item} onUpdate={handleUpdateTask} onDelete={handleDeleteTask} onEdit={handleEditClick} projects={projects} />;
                            })
                        ) : (
                            <p className="text-center text-gray-500 pt-8">No items in this view.</p>
                        )}
                    </div>
                </div>

                <details ref={detailsRef} className="mt-auto pt-4 border-t border-gray-700">
                    <summary className="cursor-pointer font-semibold text-accent-green">{editingTask ? `Editing Task: ${editingTask.title}` : 'Add New Task'}</summary>
                    <form onSubmit={handleFormSubmit} className="mt-2 space-y-2">
                        <input type="text" placeholder="New task title..." value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-600 rounded" required />
                        <div className="flex gap-2">
                            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-1/2 p-2 bg-gray-800 border border-gray-600 rounded" />
                            <select value={priority} onChange={e => setPriority(e.target.value)} className="w-1/2 p-2 bg-gray-800 border border-gray-600 rounded">
                                <option>High</option><option>Medium</option><option>Low</option>
                            </select>
                        </div>
                        <select value={projectId} onChange={e => setProjectId(e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-600 rounded">
                            <option value="">No Project</option>
                            {projects.map(p => (
                                <option key={p.id} value={p.id}>{p.title}</option>
                            ))}
                        </select>
                        <div className="flex justify-end gap-2">
                            {editingTask && <button type="button" onClick={handleCancelEdit} className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500">Cancel</button>}
                            <button type="submit" className="px-4 py-2 bg-accent-blue text-background-dark font-bold rounded hover:bg-blue-400">
                                {editingTask ? 'Update Task' : 'Add Task'}
                            </button>
                        </div>
                    </form>
                </details>
                <SopGeneratorModal isOpen={isSopGeneratorOpen} onClose={() => setSopGeneratorOpen(false)} templates={sopTemplates} onSelect={handleGenerateFromSop} />
            </div>
        </ContentCard>
    );
};

export default TaskMatrixModule;