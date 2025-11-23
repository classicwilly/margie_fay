import React from 'react';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { useAppState } from '../src/contexts/AppStateContext';

const OnboardingGoogleConnect: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const { signIn, signOut, isAuthenticated, user } = useGoogleAuth();
  const { appState } = useAppState();

  return (
    <div>
      <h3 className="text-lg font-semibold">Connect Google Workspace</h3>
      <p className="text-sm text-text-muted">Connect Calendar, Drive, and Mail for shared automations. We’ll ask write permissions only when needed.</p>
      <div className="mt-4">
        {isAuthenticated ? (
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">{user?.name}</div>
              <div className="text-sm text-text-muted">{user?.email}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => signOut()} className="btn-primary">Disconnect</button>
              <button onClick={() => onNext()} className="btn-primary">Next</button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <button onClick={() => signIn()} className="btn-primary">Sign in with Google</button>
            <button onClick={() => onNext()} className="text-sm text-text-muted">Skip</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingGoogleConnect;
