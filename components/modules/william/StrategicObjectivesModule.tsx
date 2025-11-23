
import React, { useState, useMemo } from 'react';
import useProgressVar from '@hooks/useProgressVar';
import { useAppState } from '@contexts/AppStateContext';
import ContentCard from '../../ContentCard.js';


// --- PROJECT FOCUS MODAL ---
const ProjectFocusModal = ({
    project,
    onClose,
}) => {
    const { appState, dispatch } = useAppState();
    const { tasks } = appState;
    const [newTaskTitle, setNewTaskTitle] = useState('');

    const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

    const backlogTasks = useMemo(() =>
        tasks.filter(t => t.projectId === project.id && t.status === 'todo' && !t.dueDate)
            .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1)),
        [tasks, project.id]
    );

    const todaysProjectTasks = useMemo(() =>
        tasks.filter(t => t.projectId === project.id && t.dueDate === todayStr && t.status === 'todo'),
        [tasks, project.id, todayStr]
    );
    
    const completedProjectTasks = useMemo(() =>
        tasks.filter(t => t.projectId === project.id && t.status === 'done'),
        [tasks, project.id]
    );

    const handleScheduleForToday = (taskId) => {
        dispatch({ type: 'UPDATE_TASK', payload: { id: taskId, dueDate: todayStr } });
    };

    const handleQuickAddTask = (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;
        dispatch({
            type: 'ADD_TASK',
            payload: {
                title: newTaskTitle.trim(),
                priority: 'Medium',
                dueDate: null,
                projectId: project.id,
            }
        });
        setNewTaskTitle('');
    };

    // Compute project progress for this focused project
    const progress = React.useMemo(() => {
        const linkedTasks = tasks.filter(t => t.projectId === project.id);
        if (!linkedTasks || linkedTasks.length === 0) return 0;
        const completedTasks = linkedTasks.filter(t => t.status === 'done').length;
        return (completedTasks / linkedTasks.length) * 100;
    }, [tasks, project.id]);

    const progressRef = React.useRef<HTMLDivElement | null>(null);
    useProgressVar(progressRef, progress);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-card-dark rounded-lg shadow-2xl p-6 border border-gray-700 w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                <header className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-2xl font-bold text-accent-teal">🏗️ Project Focus: {project.title}</h3>
                        <p className="text-sm text-gray-400">Plan and execute tasks for this project.</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl" aria-label="Close modal">&times;</button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto pr-2">
                    {/* Backlog Column */}
                    <div>
                        <h4 className="font-bold text-accent-blue mb-2">Project Backlog ({backlogTasks.length})</h4>
                        <div className="space-y-2">
                            {backlogTasks.length > 0 ? backlogTasks.map(task => (
                                <div key={task.id} className="p-2 bg-gray-800 rounded-md flex justify-between items-center text-sm">
                                    <span>{task.title}</span>
                                    <button onClick={() => handleScheduleForToday(task.id)} className="px-2 py-1 text-xs bg-accent-green text-background-dark font-semibold rounded hover:bg-green-500 flex-shrink-0">
                                        Do Today
                                    </button>
                                </div>
                            )) : <p className="text-xs text-gray-500 p-2">No unscheduled tasks.</p>}
                        </div>
                    </div>

                    {/* Today's Agenda for this project */}
                    <div>
                        <h4 className="font-bold text-accent-green mb-2">Today's Agenda ({todaysProjectTasks.length})</h4>
                        <div className="space-y-2">
                             {todaysProjectTasks.length > 0 ? todaysProjectTasks.map(task => (
                                <div key={task.id} className="p-2 bg-gray-800 rounded-md text-sm">
                                    <span>{task.title}</span>
                                </div>
                             )) : <p className="text-xs text-gray-500 p-2">No tasks scheduled for today.</p>}
                        </div>
                         <h4 className="font-bold text-gray-500 mt-4 mb-2">Completed ({completedProjectTasks.length})</h4>
                         <div className="space-y-2">
                             {completedProjectTasks.length > 0 ? completedProjectTasks.map(task => (
                                <div key={task.id} className="p-2 bg-gray-800 rounded-md text-sm opacity-60">
                                    <span className="line-through">{task.title}</span>
                                </div>
                             )) : <p className="text-xs text-gray-500 p-2">No tasks completed yet.</p>}
                        </div>
                    </div>
                </div>

                <form onSubmit={handleQuickAddTask} className="mt-4 pt-4 border-t border-gray-700 flex gap-2">
                    <input type="text" value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} placeholder="Quick add task to this project..." className="flex-grow p-2 bg-gray-900 border border-gray-600 rounded" />
                    <button type="submit" className="px-4 bg-accent-blue text-background-dark font-bold rounded">Add</button>
                </form>
            </div>
        </div>
    );
};

// FIX: Explicitly typed component with React.FC and a props interface to handle the `key` prop correctly.
interface ProjectItemProps {
    project: any;
    tasks: any[];
    setFocusedProject: (project: any) => void;
}
const ProjectItem: React.FC<ProjectItemProps> = ({ project, tasks, setFocusedProject }) => {
    const { progress, completed, total } = useMemo(() => {
        const linkedTasks = tasks.filter(t => t.projectId === project.id);
        if (linkedTasks.length === 0) return { progress: 0, completed: 0, total: 0 };

        const completedTasks = linkedTasks.filter(t => t.status === 'done').length;
        const progress = (completedTasks / linkedTasks.length) * 100;
        return { progress, completed: completedTasks, total: linkedTasks.length };
    }, [tasks, project.id]);

    const progressRef = React.useRef<HTMLDivElement | null>(null);
    useProgressVar(progressRef, progress);

    return (
        <button onClick={() => setFocusedProject(project)} className="w-full text-left p-3 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors">
            <div className="flex justify-between items-center mb-1">
                <p className="font-semibold">{project.title}</p>
                <p className="text-xs text-gray-400">{completed}/{total} tasks</p>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5" role="progressbar" aria-label={`Project progress: ${Math.round(progress)}%`}>
                <div ref={progressRef} className="bg-accent-blue h-2.5 rounded-full progress-fill" />
                <span className="sr-only">Project progress: {Math.round(progress)}%</span>
            </div>
        </button>
    );
};

const StrategicObjectivesModule = () => {
    const { appState, dispatch } = useAppState();
    const { objectives, projects, tasks } = appState;

    const [newObjectiveTitle, setNewObjectiveTitle] = useState('');
    const [addingProjectTo, setAddingProjectTo] = useState(null);
    const [newProjectTitle, setNewProjectTitle] = useState('');
    const [newProjectStart, setNewProjectStart] = useState('');
    const [newProjectEnd, setNewProjectEnd] = useState('');
    const [focusedProject, setFocusedProject] = useState(null);

    const handleAddObjective = (e) => {
        e.preventDefault();
        if (!newObjectiveTitle.trim()) return;
        dispatch({ type: 'ADD_OBJECTIVE', payload: { title: newObjectiveTitle.trim() } });
        setNewObjectiveTitle('');
    };
    
    const handleAddProject = (e) => {
        e.preventDefault();
        if (!newProjectTitle.trim() || !addingProjectTo) return;
        dispatch({ 
            type: 'ADD_PROJECT', 
            payload: { 
                title: newProjectTitle.trim(), 
                objectiveId: addingProjectTo,
                startDate: newProjectStart || undefined,
                endDate: newProjectEnd || undefined,
            } 
        });
        setNewProjectTitle('');
        setNewProjectStart('');
        setNewProjectEnd('');
        setAddingProjectTo(null);
    };

    return (
        <>
            {focusedProject && <ProjectFocusModal project={focusedProject} onClose={() => setFocusedProject(null)} />}
            <ContentCard title="🎯 Strategic Objectives">
                <div className="flex flex-col h-full">
                    <p className="text-sm text-text-light text-opacity-80 mb-4">
                        Define high-level objectives and break them into actionable projects. Click a project to focus.
                    </p>

                    <div className="flex-grow space-y-4 overflow-y-auto max-h-96 pr-2">
                        {objectives.filter(o => !o.isArchived).length > 0 ? (
                            objectives.filter(o => !o.isArchived).map(objective => {
                                const objectiveProjects = projects.filter(p => p.objectiveId === objective.id && !p.isArchived);
                                return (
                                    <details key={objective.id} className="p-3 bg-card-dark rounded-lg border border-gray-700 group">
                                        <summary className="cursor-pointer font-bold text-accent-green text-lg">{objective.title}</summary>
                                        <div className="pt-2 mt-2 border-t border-gray-600 space-y-2">
                                            {objectiveProjects.length > 0 ? (
                                                objectiveProjects.map(proj => <ProjectItem key={proj.id} project={proj} tasks={tasks} setFocusedProject={setFocusedProject} />)
                                            ) : (
                                                <p className="text-sm text-gray-500 italic">No projects defined for this objective.</p>
                                            )}
                                            {addingProjectTo === objective.id ? (
                                                <form onSubmit={handleAddProject} className="p-2 space-y-2 bg-gray-900/50 rounded-md">
                                                    <input type="text" value={newProjectTitle} onChange={e => setNewProjectTitle(e.target.value)} placeholder="New project title..." className="w-full p-2 bg-gray-800 border border-gray-600 rounded" autoFocus />
                                                    <div className="flex gap-2">
                                                        <input type="date" value={newProjectStart} onChange={e => setNewProjectStart(e.target.value)} className="w-1/2 p-2 bg-gray-800 border border-gray-600 rounded" title="Optional: Start Date"/>
                                                        <input type="date" value={newProjectEnd} onChange={e => setNewProjectEnd(e.target.value)} className="w-1/2 p-2 bg-gray-800 border border-gray-600 rounded" title="Optional: End Date"/>
                                                    </div>
                                                    <div className="flex justify-end gap-2">
                                                        <button type="button" onClick={() => setAddingProjectTo(null)} className="px-3 py-1 bg-gray-600 rounded text-sm">Cancel</button>
                                                        <button type="submit" className="px-3 py-1 bg-accent-blue text-background-dark font-bold rounded text-sm">Add</button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <button onClick={() => setAddingProjectTo(objective.id)} className="text-xs text-accent-blue hover:underline mt-2">+ Add Project</button>
                                            )}
                                        </div>
                                    </details>
                                );
                            })
                        ) : (
                            <div className="text-center text-gray-500 p-8">
                                <span className="text-4xl">🎯</span>
                                <p className="mt-2 font-semibold">Define Your Mission</p>
                                <p className="text-sm">Add your first long-term objective below to begin strategic planning.</p>
                            </div>
                        )}
                    </div>
                    
                    <form onSubmit={handleAddObjective} className="mt-auto pt-4 border-t border-gray-700 flex gap-2">
                        <input type="text" placeholder="Add new objective..." value={newObjectiveTitle} onChange={e => setNewObjectiveTitle(e.target.value)} className="w-full p-2 bg-gray-800 border border-gray-600 rounded" required />
                        <button type="submit" className="px-4 bg-accent-green text-background-dark font-bold rounded hover:bg-green-500">Add</button>
                    </form>
                </div>
            </ContentCard>
        </>
    );
};

export default StrategicObjectivesModule;