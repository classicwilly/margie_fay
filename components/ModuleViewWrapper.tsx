import React from 'react';
import { useAppState } from '@contexts/AppStateContext';
import Button from './Button';

const ModuleViewWrapper = ({ title, children }) => {
    const { dispatch } = useAppState();

    const handleBack = () => {
        dispatch({ type: 'SET_VIEW', payload: 'operations-control' });
    };

    return (
        <div>
            <header className="mb-8 flex items-center gap-4">
                <Button onClick={handleBack} variant="secondary" size="sm">&larr; Back to Ops Control</Button>
                <h1 className="text-3xl font-bold text-accent-teal">{title}</h1>
            </header>
            <div className="max-w-5xl mx-auto">
                {children}
            </div>
        </div>
    );
};

export default ModuleViewWrapper;