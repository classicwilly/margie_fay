import React, { useState, useEffect, useRef } from 'react';
import GoogleEmoji from '@components/GoogleEmoji';
import { useAppState } from '@contexts/AppStateContext';
import { ViewType } from '../types';

interface HeaderProps {
  openResetModal: () => void;
}

const NavItem: React.FC<{ label: string; view: ViewType; icon?: string; dataTestId?: string }>
  = ({ label, view, icon, dataTestId }) => {
    const { appState, dispatch } = useAppState();
    const isActive = appState.view === view;

    return (
        <button
            onClick={() => dispatch({ type: 'SET_VIEW', payload: view })}
            className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors duration-200 flex items-center gap-2 ${
                isActive ? 'bg-accent-blue text-background-dark' : 'text-text-light hover:bg-gray-700'
            }`}
              {...(dataTestId ? { 'data-testid': dataTestId } : {})}
            aria-current={isActive ? 'page' : undefined}
        >
            {icon && <span className="text-lg"><GoogleEmoji symbol={icon} size={18} /></span>}
            <span className="truncate">{label}</span>
        </button>
    );
};

interface DropdownMenuProps {
    openResetModal: () => void;
    onItemClick: (view: ViewType) => void;
}


const DropdownMenu: React.FC<DropdownMenuProps> = ({ openResetModal, onItemClick }) => {
    const dropdownItems = [
      { label: 'Flight Protocol Vault', view: 'sop-vault' as ViewType, dataTestId: 'nav-sop-vault' },
        { label: 'Weekly Review', view: 'weekly-review' as ViewType },
        { label: 'System Integration', view: 'system-integration' as ViewType },
        { label: 'Manifesto', view: 'manifesto' as ViewType },
    ];

    return (
        <div className="absolute right-0 mt-2 w-56 origin-top-right bg-card-dark rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-700 z-20">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                {dropdownItems.map(item => (
                    <button
                        key={item.view}
                        onClick={() => onItemClick(item.view)}
                        className="block w-full text-left px-4 py-2 text-sm text-text-light hover:bg-gray-700"
                        role="menuitem"
                      {...(item.dataTestId ? { 'data-testid': item.dataTestId } : {})}
                    >
                        {item.label}
                    </button>
                ))}
                <div className="border-t border-gray-700 my-1"></div>
                <button
                    onClick={openResetModal}
                    className="block w-full text-left px-4 py-2 text-sm text-accent-blue hover:bg-gray-700"
                    role="menuitem"
                >
                    System Reset
                </button>
                <button
                  onClick={() => onItemClick('neuro-onboarding' as any)}
                  className="block w-full text-left px-4 py-2 text-sm text-accent-blue hover:bg-gray-700"
                  role="menuitem"
                >
                  Re-run Onboarding
                </button>
            </div>
        </div>
    );
};

const Header: React.FC<HeaderProps> = ({ openResetModal }) => {
  const { appState, dispatch } = useAppState();
  const { isModMode } = appState;
  const modSwitchRef = useRef<HTMLButtonElement | null>(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  const handleToggleModMode = () => {
    dispatch({ type: 'TOGGLE_MOD_MODE' });
  };
  
  const handleDropdownToggle = () => setDropdownOpen(prev => !prev);

  const handleDropdownItemClick = (view: ViewType) => {
    dispatch({ type: 'SET_VIEW', payload: view });
    setDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // The original code had two separate `if` statements. If a click was inside
      // the desktop dropdown but outside the mobile one, the second `if` would
      // incorrectly close the menu before the click event could be processed.
      // Combining them with `&&` ensures the menu only closes if the click is
      // outside of BOTH dropdown containers.
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
        mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target as Node)
        ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={`py-3 px-4 md:px-6 bg-sanctuary-card shadow-md sticky top-0 z-20 border-b border-sanctuary-border transition-shadow no-print ${isModMode ? 'shadow-lg shadow-sanctuary-focus/20' : ''}`}>
      <div className="container mx-auto flex items-center justify-between gap-4">
        <button onClick={() => dispatch({ type: 'SET_VIEW', payload: 'command-center' })} className="text-xl md:text-2xl font-bold text-accent-teal flex-shrink-0">
          <GoogleEmoji symbol={'🌱'} size={24} className="inline-block mr-2" />Wonky Sprout OS
        </button>

        <nav className="hidden md:flex items-center gap-2 flex-wrap">
              <NavItem label="The Cockpit" view="command-center" dataTestId="nav-command-center" />
            <NavItem label="Daily Tracker" view="all-checklists" />
            <NavItem label="Little Sprouts" view="kids-corner" />
            <NavItem label="Parenting" view="co-parenting-protocol" />

            <div className="relative" ref={dropdownRef}>
                 <button
                    onClick={handleDropdownToggle}
                  id="options-menu"
                  data-testid="nav-system"
                  className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors duration-200 flex items-center gap-1 ${
                        isDropdownOpen ? 'bg-gray-700' : 'text-text-light hover:bg-gray-700'
                    }`}
                >
                    System
                    <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                {isDropdownOpen && <DropdownMenu onItemClick={handleDropdownItemClick} openResetModal={() => { setDropdownOpen(false); openResetModal(); }} />}
            </div>
        </nav>
        
        <div className="flex items-center space-x-2 flex-shrink-0">
            <span className={`text-sm font-semibold hidden sm:inline ${isModMode ? 'text-accent-blue' : 'text-text-light'}`}>Mod Mode</span>
            <button
              role="switch"
              ref={modSwitchRef}
              aria-checked="false"
              aria-label={isModMode ? 'Disable Mod Mode' : 'Enable Mod Mode'}
              onClick={handleToggleModMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card-dark focus:ring-accent-blue ${
                isModMode ? 'bg-accent-blue' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isModMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
        </div>
      </div>
       {/* Mobile Navigation */}
      <nav className="md:hidden flex items-center gap-2 flex-wrap mt-3 pt-3 border-t border-gray-700">
             <NavItem label="Cockpit" view="command-center" dataTestId="nav-command-center" />
            <NavItem label="Tracker" view="all-checklists" />
            <NavItem label="Sprouts" view="kids-corner" />
            <NavItem label="Parenting" view="co-parenting-protocol" />
            <div className="relative" ref={mobileDropdownRef}>
                <button
                    onClick={handleDropdownToggle}
                    className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors duration-200 flex items-center gap-1 ${
                        isDropdownOpen ? 'bg-gray-700' : 'text-text-light hover:bg-gray-700'
                    }`}
                >
                    System
                    <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                {isDropdownOpen && <DropdownMenu onItemClick={handleDropdownItemClick} openResetModal={() => { setDropdownOpen(false); openResetModal(); }} />}
            </div>
        </nav>
    </header>
  );
};

export { Header };