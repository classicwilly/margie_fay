
import React from 'react';
import { useAppState } from '@contexts/AppStateContext';
import Toast from './Toast.js';

const ToastContainer = () => {
    const { appState, dispatch } = useAppState();
    const { toastNotifications } = appState;

    const handleDismiss = (id) => {
        dispatch({ type: 'REMOVE_TOAST', payload: id });
    };

    if (toastNotifications.length === 0) {
        return null;
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 space-y-3 no-print">
            {toastNotifications.map(toast => (
                <Toast
                    key={toast.id}
                    id={toast.id}
                    emoji={toast.emoji}
                    message={toast.message}
                    onDismiss={handleDismiss}
                />
            ))}
        </div>
    );
};

export default ToastContainer;