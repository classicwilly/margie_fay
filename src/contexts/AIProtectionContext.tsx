import React, { createContext, useState, useCallback } from 'react';
import { useAIConsent } from '../../hooks/useAIConsent';

// Provide a centralized AI protection context so all components and hooks share the same consent/PII state.
export const AIProtectionContext = createContext<any>(null);

export const AIProtectionProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { checkConsentAndExecute, isConsentModalOpen, dontShowAgain, setDontShowAgain, handleConfirm, handleCancel } = useAIConsent();
  const [isPiiModalOpen, setPiiModalOpen] = useState(false);
  const [piiMatches, setPiiMatches] = useState<Array<{ type: string; value: string }>>([]);
  const pendingActionRef: { current?: () => void } = { current: undefined };

  const handlePiiConfirm = useCallback(() => {
    if (pendingActionRef.current) pendingActionRef.current();
    setPiiModalOpen(false);
    pendingActionRef.current = undefined;
  }, []);

  const handlePiiCancel = useCallback(() => {
    setPiiModalOpen(false);
    pendingActionRef.current = undefined;
  }, []);

  const checkAndExecute = useCallback(async (input: string, fn: (safeInput: string) => Promise<any>) => {
    if (typeof input !== 'string' || input.trim().length === 0) {
      throw new Error('No input provided for AI prompt.');
    }
    // Simple PII pattern detection
    const email = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
    const ssn = /\b\d{3}-\d{2}-\d{4}\b/;
    const card = /\b(?:\d[ -]*){13,19}\b/;
    const matches: Array<{ type: string; value: string }> = [];
    const mEmail = input.match(email) || [];
    const mSsn = input.match(ssn) || [];
    const mCard = input.match(card) || [];
    mEmail.forEach(v => matches.push({ type: 'email', value: v }));
    mSsn.forEach(v => matches.push({ type: 'ssn', value: v }));
    mCard.forEach(v => matches.push({ type: 'credit_card', value: v }));

    if (matches.length > 0) {
      setPiiMatches(matches);
      pendingActionRef.current = () => checkConsentAndExecute(() => fn(input.trim()));
      setPiiModalOpen(true);
      return;
    }

    return checkConsentAndExecute(() => fn(input.trim()));
  }, [checkConsentAndExecute]);

  const value = { checkAndExecute, isPiiModalOpen, piiMatches, handlePiiConfirm, handlePiiCancel, isConsentModalOpen, handleConfirm, handleCancel, dontShowAgain, setDontShowAgain };
  return <AIProtectionContext.Provider value={value}>{children}</AIProtectionContext.Provider>;
};

export default AIProtectionProvider;