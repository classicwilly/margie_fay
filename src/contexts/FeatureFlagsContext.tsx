import React, { createContext, useContext, useState, useEffect } from 'react';
import { logWarn } from '../utils/logger';
import safeJsonParse from '@utils/safeJsonParse';

type Flags = {
  aiEnabled: boolean;
};

const DEFAULTS: Flags = {
  aiEnabled: true,
};

const FeatureFlagsContext = createContext<{
  flags: Flags;
  setFlag: <K extends keyof Flags>(k: K, v: Flags[K]) => void;
}>({ flags: DEFAULTS, setFlag: () => {} });

export const FeatureFlagsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Read persisted user-level overrides from localStorage for now
  const [flags, setFlags] = useState<Flags>(() => {
    try {
      if (typeof window !== 'undefined') {
        const raw = window.localStorage.getItem('wonky_flags');
        if (raw) {
          // Use safeJsonParse to gracefully handle invalid stored values.
          const parsed = safeJsonParse<Record<string, unknown>>(raw, null);
          if (parsed) return { ...DEFAULTS, ...parsed };
        }
      }
    } catch {
      logWarn('Error reading wonky_flags');
    }
    return DEFAULTS;
  });

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('wonky_flags', JSON.stringify(flags));
      }
    } catch {
      // ignore
    }
  }, [flags]);

  const setFlag = <K extends keyof Flags>(k: K, v: Flags[K]) => {
    setFlags(prev => ({ ...prev, [k]: v }));
  };

  return <FeatureFlagsContext.Provider value={{ flags, setFlag }}>{children}</FeatureFlagsContext.Provider>;
};

export const useFeatureFlags = () => useContext(FeatureFlagsContext);
export const useAIEnabled = () => useFeatureFlags().flags.aiEnabled;

export default FeatureFlagsContext;
