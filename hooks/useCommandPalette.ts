

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAppState } from '@contexts/AppStateContext';

import { SOP_DATA } from '../constants.js';

export function useCommandPalette() {
    const { appState, dispatch } = useAppState();
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const openPalette = () => setIsOpen(true);
    const closePalette = () => {
        setIsOpen(false);
        setSearchTerm('');
    };
    
    const staticActions = useMemo(() => [
        { id: 'action-interrupt', type: 'action', title: "I've been interrupted!", description: 'Run the Context Switching Recovery Protocol.', action: () => {
            dispatch({ type: 'SET_CONTEXT_CAPTURE_MODAL_OPEN', payload: true });
        }},
        { id: 'action-new-task', type: 'action', title: 'Create New Task', description: 'Add a new item to the Task Matrix.', action: () => {
            dispatch({ type: 'SET_VIEW', payload: 'operations-control' });
            setTimeout(() => {
                const taskMatrix = document.getElementById('module-task-matrix-module');
                if (taskMatrix) {
                    taskMatrix.scrollIntoView({ behavior: 'smooth' });
                    (taskMatrix.querySelector('details') as HTMLDetailsElement).setAttribute('open', '');
                    (taskMatrix.querySelector('input[placeholder="New task title..."]') as HTMLInputElement)?.focus();
                }
            }, 100);
        }},
        { id: 'action-new-sop', type: 'action', title: 'Create New SOP', description: 'Define a new Standard Operating Procedure.', action: () => dispatch({ type: 'SET_VIEW', payload: 'create-sop' }) },
        { id: 'action-toggle-mod-mode', type: 'action', title: 'Toggle Mod Mode', description: 'Enable or disable customization mode.', action: () => dispatch({ type: 'TOGGLE_MOD_MODE' }) },
        { id: 'action-start-pomodoro', type: 'action', title: 'Start Pomodoro (Work)', description: 'Begin a 25-minute work session.', action: () => {
             dispatch({ type: 'POMODORO_SET_MODE', payload: 'work' });
             dispatch({ type: 'POMODORO_TOGGLE' });
             const pomodoro = document.getElementById('module-pomodoro-timer-module');
             if(pomodoro) pomodoro.scrollIntoView({behavior: 'smooth'});
        }},
    ], [dispatch]);

    const searchableViews = useMemo(() => [
        { type: 'view', title: 'Command Center', description: 'View the high-level OS overview.', action: () => dispatch({ type: 'SET_VIEW', payload: 'command-center' }) },
        { type: 'view', title: 'My Dashboard', description: 'Go to your main dashboard.', action: () => dispatch({ type: 'SET_VIEW', payload: 'operations-control' }) },
        { type: 'view', title: 'Flight Protocol Vault', description: 'View all protocols.', action: () => dispatch({ type: 'SET_VIEW', payload: 'sop-vault' }) },
        { type: 'view', title: 'System Diagnostics', description: 'Run the end-of-day shutdown and review protocol.', action: () => dispatch({ type: 'SET_VIEW', payload: 'daily-debrief' }) },
        { type: 'view', title: 'Weekly Review', description: 'Open the weekly review checklist.', action: () => { dispatch({ type: 'SET_WEEKLY_REVIEW_MODE', payload: 'checklist' }); dispatch({ type: 'SET_VIEW', payload: 'weekly-review' }); } },
        { type: 'view', title: 'Weekly Review (Wizard)', description: 'Open the Weekly Review wizard flow.', action: () => { dispatch({ type: 'SET_WEEKLY_REVIEW_MODE', payload: 'wizard' }); dispatch({ type: 'SET_VIEW', payload: 'weekly-review' }); } },
        { type: 'view', title: 'Quarterly Strategic Review', description: 'Plan and review long-term objectives.', action: () => dispatch({ type: 'SET_VIEW', payload: 'quarterly-review' }) },
        { type: 'view', title: 'Event Horizon Prep', description: 'Prepare for a major upcoming event.', action: () => dispatch({ type: 'SET_VIEW', payload: 'event-horizon-prep' }) },
        { type: 'view', title: 'Strategic Roadmap', description: 'View long-range project timelines.', action: () => dispatch({ type: 'SET_VIEW', payload: 'strategic-roadmap' }) },
        { type: 'view', title: 'Archive Log', description: 'View completed projects and archived notes.', action: () => dispatch({ type: 'SET_VIEW', payload: 'archive-log' }) },
        { type: 'view', title: 'Game Master Hub', description: 'Manage kids\' rewards and quests.', action: () => dispatch({ type: 'SET_VIEW', payload: 'game-master-dashboard' }) },
        { type: 'view', title: 'System Insights', description: 'View analytics and AI correlations.', action: () => dispatch({ type: 'SET_VIEW', payload: 'system-insights' }) },
        { type: 'view', title: 'All Checklists', description: 'View a master list of all checklists.', action: () => dispatch({ type: 'SET_VIEW', payload: 'all-checklists' }) },
        { type: 'view', title: 'Neuro Onboarding', description: 'Personalize experience via neurodivergent presets.', action: () => dispatch({ type: 'SET_VIEW', payload: 'neuro-onboarding' }) },
        { type: 'view', title: 'Print Daily Report', description: 'Generate a printable mission sheet for the day.', action: () => dispatch({ type: 'SET_VIEW', payload: 'daily-report' }) },
        { type: 'view', title: 'Wonky Toolkit', description: 'Open the Wonky Toolkit', action: () => dispatch({ type: 'SET_VIEW', payload: 'wonky-toolkit' }) },
    ], [dispatch]);

    // Search logic
    useEffect(() => {
        if (!isOpen || !appState) return;

        const lowerSearch = searchTerm.toLowerCase();

        if (!lowerSearch) {
            setResults([...staticActions, ...searchableViews.map((v, i) => ({ ...v, id: `view-${i}`}))]);
            setSelectedIndex(0);
            return;
        }

        const allSops = [...SOP_DATA, ...appState.userSops];

        const sopResults = allSops
            .filter(sop => sop.title.toLowerCase().includes(lowerSearch) || sop.description.toLowerCase().includes(lowerSearch))
            .map(sop => ({
                id: `sop-${sop.id}`,
                type: 'sop',
                title: sop.title,
                description: sop.description,
                action: () => {
                    if (sop.viewId) {
                        dispatch({ type: 'SET_VIEW', payload: sop.viewId });
                    } else if (sop.isPageView) {
                        dispatch({ type: 'SET_ACTIVE_USER_SOP_ID', payload: sop.id });
                        dispatch({ type: 'SET_VIEW', payload: 'user-sop-view' });
                    }
                },
            }));

        const taskResults = (appState.tasks || [])
            .filter((task) => task.status === 'todo' && task.title.toLowerCase().includes(lowerSearch))
            .map((task) => ({
                id: `task-${task.id}`,
                type: 'task',
                title: task.title,
                description: `Due: ${task.dueDate || 'Inbox'} | Priority: ${task.priority}`,
                action: () => {
                    dispatch({ type: 'SET_VIEW', payload: 'operations-control' });
                    setTimeout(() => {
                        document.getElementById('module-task-matrix-module')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                },
            }));
            
        const objectiveResults = (appState.objectives || [])
            .filter((obj) => !obj.isArchived && obj.title.toLowerCase().includes(lowerSearch))
            .map((obj) => ({
                id: `objective-${obj.id}`,
                type: 'objective',
                title: obj.title,
                description: 'Strategic Objective',
                action: () => {
                    dispatch({ type: 'SET_VIEW', payload: 'operations-control' });
                    setTimeout(() => document.getElementById('module-strategic-objectives-module')?.scrollIntoView({ behavior: 'smooth' }), 100);
                }
            }));

        const projectResults = (appState.projects || [])
            .filter((proj) => !proj.isArchived && proj.title.toLowerCase().includes(lowerSearch))
            .map((proj) => ({
                id: `project-${proj.id}`,
                type: 'project',
                title: proj.title,
                description: 'Project',
                action: () => {
                    dispatch({ type: 'SET_VIEW', payload: 'operations-control' });
                    setTimeout(() => document.getElementById('module-strategic-objectives-module')?.scrollIntoView({ behavior: 'smooth' }), 100);
                }
            }));

        const knowledgeResults = (appState.knowledgeVaultEntries || [])
            .filter((entry) => !entry.isArchived && entry.title.toLowerCase().includes(lowerSearch))
            .map((entry) => ({
                id: `knowledge-${entry.id}`,
                type: 'knowledge',
                title: entry.title,
                description: `Tags: ${entry.tags.join(', ')}`,
                action: () => {
                    dispatch({ type: 'SET_VIEW', payload: 'operations-control' });
                     setTimeout(() => {
                        document.getElementById('module-knowledge-capture-vault-module')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                },
            }));

        const actionResults = staticActions.filter(a => a.title.toLowerCase().includes(lowerSearch));
        const viewResults = searchableViews.map((v, i) => ({ ...v, id: `view-${i}`})).filter(v => v.title.toLowerCase().includes(lowerSearch));

        setResults([...actionResults, ...viewResults, ...sopResults, ...taskResults, ...objectiveResults, ...projectResults, ...knowledgeResults]);
        setSelectedIndex(0);

    }, [searchTerm, isOpen, appState, dispatch, staticActions, searchableViews]);

    // Keyboard navigation
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            setIsOpen(prev => !prev);
        }

        if (!isOpen) return;

        if (e.key === 'Escape') {
            closePalette();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const selectedResult = results[selectedIndex];
            if (selectedResult) {
                selectedResult.action();
                closePalette();
            }
        }
    }, [isOpen, results, selectedIndex]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const onSelect = (result: any) => {
        result.action();
        closePalette();
    };

    return {
        commandPaletteProps: {
            isOpen,
            searchTerm,
            setSearchTerm,
            results,
            selectedIndex,
            onClose: closePalette,
            onSelect,
        }
    };
}