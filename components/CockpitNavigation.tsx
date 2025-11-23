import React from 'react';
import { LayoutDashboard, BookOpen, FlaskConical, Settings, Wind } from 'lucide-react';
import { useAppState } from '@contexts/AppStateContext';

export const CockpitNavigation: React.FC = () => {
  const { appState, dispatch } = useAppState();

  const navItems = [
    { id: 'cockpit', label: 'Ops Deck', icon: LayoutDashboard, view: 'cockpit' },
    { id: 'archive', label: 'Legacy', icon: BookOpen, view: 'sop-vault' },
    { id: 'apothecary', label: 'Bio-Hacks', icon: FlaskConical, view: 'bio-hacks' },
  ];

  const handleNavClick = (viewId: string) => {
    if (appState.isDeepFocusEnabled) {
      dispatch({ type: 'SET_PENDING_VIEW', payload: viewId });
      dispatch({ type: 'SET_CONTEXT_RESTORE_MODAL_OPEN', payload: true });
    } else {
      dispatch({ type: 'SET_VIEW', payload: viewId });
    }
  };

  const handleManualDecompress = () => {
    dispatch({ type: 'SET_CONTEXT_RESTORE_MODAL_OPEN', payload: true });
  };

  return (
    <nav className="flex flex-col items-center space-y-6 w-full">
      <div className="flex flex-col gap-2 w-full items-center">
        {navItems.map((item) => {
          const isActive = appState.view === item.view;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.view)}
              className={`p-3 rounded-xl transition-all duration-200 ease-out shadow-neon-sm ${isActive ? 'bg-accent-teal text-background-dark font-bold' : 'bg-surface-800 text-text-muted hover:text-accent-teal hover:bg-accent-teal/10'}`}
              aria-label={item.label}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="sr-only">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2 mt-auto items-center w-full">
        <button onClick={handleManualDecompress} className="p-3 rounded-xl bg-surface-800 text-accent-teal hover:bg-accent-teal/10 transition-all shadow-neon-sm" aria-label="Decompress">
          <Wind size={20} />
        </button>
        <button className="p-3 rounded-xl bg-surface-800 text-accent-pink hover:bg-accent-pink/10 transition-all shadow-neon-sm" aria-label="Settings">
          <Settings size={20} />
        </button>
      </div>
    </nav>
  );
};

export default CockpitNavigation;
