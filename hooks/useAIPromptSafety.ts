import { useCallback, useState, useContext } from 'react';
import { AIProtectionContext } from '@contexts/AIProtectionContext';
import { useAIEnabled } from '../src/contexts/FeatureFlagsContext';
import { useAIConsent } from './useAIConsent';

function looksLikePII(input: string) {
  // Return detected PII chunks with a type and value
  const patterns: { type: string; regex: RegExp }[] = [
    { type: 'email', regex: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi },
    { type: 'ssn', regex: /\b\d{3}-\d{2}-\d{4}\b/g },
    { type: 'credit_card', regex: /\b(?:\d[ -]*){13,19}\b/g },
  ];

  const found: Array<{ type: string; value: string }> = [];
  patterns.forEach(p => {
    const m = input.match(p.regex) || [];
    m.forEach(v => found.push({ type: p.type, value: v }));
  });
  return found;
}

export function useAIPromptSafety() {
  const ctx = useContext(AIProtectionContext);
  if (ctx) return ctx;
  const aiEnabled = useAIEnabled();
  const { checkConsentAndExecute, isConsentModalOpen, dontShowAgain, setDontShowAgain, handleConfirm, handleCancel } = useAIConsent();
  const [isPiiModalOpen, setPiiModalOpen] = useState(false);
  const [piiMatches, setPiiMatches] = useState<Array<{ type: string; value: string }>>([]);
  const pendingActionRef: { current?: () => void } = { current: undefined };

  const handlePiiConfirm = () => {
    if (pendingActionRef.current) pendingActionRef.current();
    setPiiModalOpen(false);
    pendingActionRef.current = undefined;
  };

  const handlePiiCancel = () => {
    setPiiModalOpen(false);
    pendingActionRef.current = undefined;
  };

  const checkAndExecute = useCallback(async (input: string, fn: (safeInput: string) => Promise<any>) => {
    // use the top-level hook value - hooks cannot be called inside callbacks
    // If AI is disabled we simply bypass all prompt safety modals and execute the action.
    if (!aiEnabled) {
      return fn(input.trim());
    }
    if (typeof input !== 'string' || input.trim().length === 0) {
      throw new Error('No input provided for AI prompt.');
    }

    const pii = looksLikePII(input);
    if (pii.length > 0) {
      // expose modal state from this hook to UI so user can confirm sending. The pending
      // action will only be executed if user confirms the PII modal and then consents via the consent modal.
      setPiiMatches(pii);
      pendingActionRef.current = () => checkConsentAndExecute(() => fn(input.trim()));
      setPiiModalOpen(true);
      return;
    }

    // Normalized input - conservatively trim whitespace.
    const safeInput = input.trim();
    return fn(safeInput);
  }, [aiEnabled]);

  return { checkAndExecute, isPiiModalOpen, piiMatches, handlePiiConfirm, handlePiiCancel, isConsentModalOpen, handleConfirm, handleCancel, dontShowAgain, setDontShowAgain };
}

export default useAIPromptSafety;
