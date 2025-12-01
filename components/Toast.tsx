
import React, { useEffect, useState } from 'react';
import GoogleEmoji from '@components/GoogleEmoji';

// FIX: Explicitly typed component with React.FC and a props interface to handle the `key` prop correctly.
interface ToastProps {
    id: string;
    emoji: string;
    message: string;
    onDismiss: (id: string) => void;
}
const Toast: React.FC<ToastProps> = ({ id, emoji, message, onDismiss }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Fade in
        const entryTimer = setTimeout(() => setIsVisible(true), 10);

        // Schedule fade out and dismissal
        const exitTimer = setTimeout(() => {
            setIsVisible(false);
            const dismissTimer = setTimeout(() => onDismiss(id), 300); // Wait for fade out
            return () => clearTimeout(dismissTimer);
        }, 4000);

        return () => {
            clearTimeout(entryTimer);
            clearTimeout(exitTimer);
        };
    }, [id, onDismiss]);

    return (
        <div
            className={`flex items-center gap-4 bg-card-dark border-2 border-accent-green shadow-lg rounded-lg p-4 transition-all duration-300 ease-in-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            role="alert"
            aria-live="assertive"
        >
            <GoogleEmoji symbol={emoji} size={36} alt="toast emoji" className="mr-2" />
            <p className="font-semibold text-accent-green">{message}</p>
        </div>
    );
};

export default Toast;