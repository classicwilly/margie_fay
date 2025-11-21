import React from 'react';
import ContentCard from '../ContentCard';
import { Button } from '../Button';
import { useAppState } from '@contexts/AppStateContext';

export const WorkspaceLaunchpadModule = () => {
    const { dispatch } = useAppState();

    const quickActions = [
        { label: 'Open Command Center', action: () => dispatch?.({ type: 'SET_VIEW', payload: 'cockpit' }) },
        { label: 'Open Bio Hacks (Apothecary)', action: () => dispatch?.({ type: 'SET_VIEW', payload: 'bio-hacks' }) },
        { label: 'Open Weekly Review', action: () => dispatch?.({ type: 'SET_VIEW', payload: 'weekly-review' }) },
    ];

    return (
        <ContentCard title="🚀 Workspace Launchpad">
            <div className="space-y-3">
                <p className="text-sm text-text-muted">Quick buttons to navigate your workspace and tools.</p>
                <div className="grid grid-cols-1 gap-2">
                    {quickActions.map((q, idx) => (
                        <Button key={idx} onClick={() => q.action()} variant="primary">{q.label}</Button>
                    ))}
                </div>
            </div>
        </ContentCard>
    );
};

export default WorkspaceLaunchpadModule;
