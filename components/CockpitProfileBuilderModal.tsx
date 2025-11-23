import React, { useState } from 'react';
import { useAppState } from '@contexts/AppStateContext';

interface Props {
  onClose: () => void;
  existing?: any;
}

const CockpitProfileBuilderModal: React.FC<Props> = ({ onClose, existing }) => {
  const { appState, dispatch } = useAppState();
  const [name, setName] = useState(existing?.name || '');
  const [persona, setPersona] = useState(existing?.persona || appState?.dashboardType || 'william');
  const [audio, setAudio] = useState(existing?.audio || 'brown_noise');
  const [oral, setOral] = useState(existing?.oral || 'chew');
  const [visual, setVisual] = useState(existing?.visual || 'sunglasses');

  const handleSave = () => {
    const payload = {
      id: existing?.id || `ps-${Date.now()}`,
      name,
      persona,
      audio,
      oral,
      visual,
      createdAt: existing?.createdAt || new Date().toISOString(),
    };
    if (existing?.id) dispatch({ type: 'UPDATE_PROFILE_STACK', payload } as any);
    else dispatch({ type: 'ADD_PROFILE_STACK', payload } as any);
    // Apply automatically
    dispatch({ type: 'APPLY_PROFILE_STACK', payload: payload.id });
    onClose();
  };

  return (
    <div role="dialog" aria-modal="true" data-testid="cockpit-modal" className="fixed inset-0 flex items-center justify-center z-30">
      <div className="bg-black/40 absolute inset-0" onClick={onClose}></div>
      <div className="bg-sanctuary-card p-4 rounded shadow z-40 w-[min(800px,95%)]">
        <h2 className="text-xl font-bold mb-2">Profile Builder</h2>
        <div className="grid grid-cols-2 gap-4">
          <label className="space-y-1">
            <div className="text-sm text-slate-400">Name</div>
            <input data-testid="cockpit-name-input" className="w-full p-2 border rounded" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="space-y-1">
            <div className="text-sm text-slate-400">Persona</div>
            <select data-testid="cockpit-persona-select" className="w-full p-2 border rounded" value={persona} onChange={(e) => setPersona(e.target.value)}>
              <option value="william">William (Admin)</option>
              <option value="willow">Willow</option>
              <option value="sebastian">Sebastian</option>
            </select>
          </label>
          <label className="space-y-1">
            <div className="text-sm text-slate-400">Audio</div>
            <select data-testid="cockpit-audio-select" className="w-full p-2 border rounded" value={audio} onChange={(e) => setAudio(e.target.value)}>
              <option value="brown_noise">Brown Noise</option>
              <option value="edm">EDM</option>
              <option value="silence">Silence</option>
            </select>
          </label>
          <label className="space-y-1">
            <div className="text-sm text-slate-400">Oral</div>
            <select data-testid="cockpit-oral-select" className="w-full p-2 border rounded" value={oral} onChange={(e) => setOral(e.target.value)}>
              <option value="chew">Chew</option>
              <option value="crunch">Crunch</option>
              <option value="suck">Suck</option>
            </select>
          </label>
          <label className="col-span-2 space-y-1">
            <div className="text-sm text-slate-400">Visual</div>
            <select data-testid="cockpit-visual-select" className="w-full p-2 border rounded" value={visual} onChange={(e) => setVisual(e.target.value)}>
              <option value="sunglasses">Sunglasses</option>
              <option value="dim_lights">Dim Lights</option>
              <option value="blackout">Blackout</option>
            </select>
          </label>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button data-testid="cockpit-cancel" onClick={onClose} className="px-3 py-1 border rounded">Cancel</button>
          <button data-testid="cockpit-save-apply" onClick={handleSave} className="px-3 py-1 bg-sanctuary-accent text-white rounded">Save & Apply</button>
        </div>
      </div>
    </div>
  );
};

export default CockpitProfileBuilderModal;
