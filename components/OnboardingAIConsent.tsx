import React from 'react';
import AIConsentModal from './AIConsentModal';
import { useAppState } from '../src/contexts/AppStateContext';

const OnboardingAIConsent: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const { appState, dispatch } = useAppState();
  const [open, setOpen] = React.useState(true);

  const handleConfirm = () => {
    setOpen(false);
    dispatch({ type: 'SET_INITIAL_SETUP_COMPLETE', payload: true });
    onNext();
  };
  const handleCancel = () => {
    setOpen(false);
    dispatch({ type: 'SET_INITIAL_SETUP_COMPLETE', payload: false });
    onNext();
  };

  return (
    <div>
      <h3 className="text-lg font-semibold">AI Consent & Privacy</h3>
      <p className="text-sm text-text-muted">Provide consent for AI to analyze your inputs and suggest automations. You can change this later.</p>
      <div className="mt-4 flex gap-2">
        <button onClick={() => handleConfirm()} className="btn-primary">Enable AI</button>
        <button onClick={() => handleCancel()} className="text-sm text-text-muted">Disable</button>
      </div>
      {open && <AIConsentModal onConfirm={handleConfirm} onCancel={handleCancel} dontShowAgain={false} setDontShowAgain={() => {}} />}
    </div>
  );
};

export default OnboardingAIConsent;
