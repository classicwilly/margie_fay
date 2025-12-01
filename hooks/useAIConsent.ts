

import { useState, useCallback } from 'react';

const AI_CONSENT_KEY = 'wonky-sprout-ai-consent-dont-show-again';

export function useAIConsent() {
    const [isConsentModalOpen, setConsentModalOpen] = useState(false);
    const [dontShowAgain, setDontShowAgain] = useState(() => {
        return typeof window !== 'undefined' && localStorage.getItem(AI_CONSENT_KEY) === 'true';
    });
    
    const [onConfirmCallback, setOnConfirmCallback] = useState<(() => void) | null>(null);

    const checkConsentAndExecute = useCallback((action: () => void) => {
        const hasConsented = typeof window !== 'undefined' && localStorage.getItem(AI_CONSENT_KEY) === 'true';
        if (hasConsented) {
            action();
        } else {
            setOnConfirmCallback(() => action);
            setConsentModalOpen(true);
        }
    }, []);

    const handleConfirm = () => {
        if (dontShowAgain) {
            localStorage.setItem(AI_CONSENT_KEY, 'true');
        }
        if (onConfirmCallback) {
            onConfirmCallback();
        }
        setConsentModalOpen(false);
        setOnConfirmCallback(null);
    };

    const handleCancel = () => {
        setConsentModalOpen(false);
        setOnConfirmCallback(null);
    };

    return {
        isConsentModalOpen,
        dontShowAgain,
        setDontShowAgain,
        checkConsentAndExecute,
        handleConfirm,
        handleCancel,
    };
}