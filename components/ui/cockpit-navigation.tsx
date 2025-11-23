import React from 'react';
import { LayoutDashboard, BookOpen, FlaskConical, Settings, Wind, ShieldAlert } from 'lucide-react';
import { useAppState } from '../../contexts/AppStateContext'; // Adjust path as needed

export const CockpitNavigation = () => {
  const { appState, dispatch } = useAppState();

  // Navigation Items Configuration
  const navItems = [
    { id: 'cockpit', label: 'Ops Deck', icon: LayoutDashboard, view: 'command-center' },
    { id: 'archive', label: 'Legacy', icon: BookOpen, view: 'legacy-archive' },
    { id: 'apothecary', label: 'Bio-Hacks', icon: FlaskConical, view: 'bio-hacks' },
  ];

  // Handler for switching views (Bypasses Airlock by default)
  const handleNavClick = (viewId: string) => {
    // Only trigger airlock if we are in DEEP FOCUS mode and switching context
    if (appState.isDeepFocusMode) {
       dispatch({ type: 'SET_PENDING_VIEW', payload: viewId });
       dispatch({ type: 'SET_CONTEXT_RESTORE_MODAL_OPEN', payload: true });
    } else {
       dispatch({ type: 'SET_VIEW', payload: viewId });
    }
  };

  // Manual Eject Handler (The "Panic" Button)
  const handleManualDecompress = () => {
    dispatch({ type: 'SET_CONTEXT_RESTORE_MODAL_OPEN', payload: true });
  };

  return (
    <nav className="fixed z-50 flex items-center justify-between w-full p-2 bg-surface-900 border-t border-surface-700 md:w-20 md:h-screen md:flex-col md:border-t-0 md:border-r md:py-6 bottom-0 left-0 shadow-2xl">
      
      {/* --- Top Section: Main Nav --- */}
      <div className="flex gap-2 md:flex-col md:gap-6 w-full justify-center md:justify-start">
        {navItems.map((item) => {
          const isActive = appState.view === item.view;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.view)}
              className={`
                relative group p-3 rounded-xl transition-all duration-200 ease-out
                ${isActive 
                  ? 'bg-accent-teal/10 text-accent-teal shadow-neon-sm' 
                  : 'text-text-muted hover:text-text-light hover:bg-surface-800'}
              `}
              aria-label={item.label}
            >
              <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              
              {/* Tooltip (Desktop Only) */}
              <span className="absolute left-14 bg-surface-800 text-text-light text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap hidden md:block border border-surface-700">
                {item.label}
              </span>
              
              {/* Mobile Active Indicator */}
              {isActive && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent-teal rounded-full md:hidden" />
              )}
            </button>
          );
        })}
      </div>

      {/* --- Bottom Section: Emergency Controls --- */}
      <div className="flex md:flex-col gap-2 md:mt-auto">
        
        {/* The Manual Airlock (Eject Handle) */}
        <button
            onClick={handleManualDecompress}
            className="p-3 rounded-xl text-accent-orange hover:bg-accent-orange/10 hover:shadow-[0_0_15px_rgba(251,146,60,0.3)] transition-all active:scale-95 group relative"
            aria-label="Manual Decompression"
        >
            <Wind size={24} />
            <span className="absolute left-14 bg-surface-800 text-accent-orange text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hidden md:block border border-accent-orange/20">
                Decompress
            </span>
        </button>

        {/* Settings / System Status */}
        <button
            className="p-3 rounded-xl text-text-muted hover:text-accent-pink hover:bg-surface-800 transition-all"
            aria-label="System Settings"
        >
            <Settings size={24} />
        </button>
      </div>
    </nav>
  );
};

export default CockpitNavigation;
