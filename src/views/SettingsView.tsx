import React, { useState } from 'react';
import { useAppState } from '@contexts/AppStateContext';

const DEFAULT_PERSONAS = ['Grandma', 'Grandpa', 'Bob', 'Marge'];

const SettingsView: React.FC = () => {
  const { appState, dispatch, getPersonaDisplayName } = useAppState();
  const initialOverrides = (appState?.personaOverrides) || {};
  const [overrides, setOverrides] = useState<Record<string, string>>({ ...initialOverrides });

  const handleChange = (key: string, value: string) => {
    setOverrides(prev => ({ ...prev, [key]: value }));
  };

  const saveOverrides = () => {
    // Dispatch each override as a separate action for simplicity
    DEFAULT_PERSONAS.forEach(p => {
      const v = (overrides[p] || '').trim();
      dispatch({ type: 'SET_PERSONA_OVERRIDE', payload: { key: p, value: v } });
    });
    // Ideally persist to remote store here (e.g., Firestore) — TODO
    alert('Persona display names saved');
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Settings</h2>
      <p className="text-sm text-text-muted">Customize persona display names for privacy and personalization.</p>
      <div className="mt-4 grid grid-cols-1 gap-4">
        {DEFAULT_PERSONAS.map(p => (
          <div key={p} className="flex items-center gap-3 bg-surface-800 px-4 py-3 rounded-md">
            <label className="min-w-[130px] text-sm text-text-muted">{p}</label>
            <input
              data-testid={`persona-override-${p}`}
              className="flex-1 px-3 py-2 rounded bg-background-dark text-text-light"
              value={overrides[p] || ''}
              placeholder={`Override name for ${p} (leave empty to use default)`}
              onChange={(e) => handleChange(p, e.target.value)}
            />
            <div className="text-xs text-text-muted font-mono">{getPersonaDisplayName?.(p) || p}</div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <button data-testid="save-persona-overrides" onClick={saveOverrides} className="px-4 py-2 bg-accent-teal rounded text-white font-bold">Save</button>
      </div>
    </div>
  );
};

export default SettingsView;
