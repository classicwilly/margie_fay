
import React, { useState, useEffect } from 'react';
import { useAppState } from '@contexts/AppStateContext';
import { ALL_WILLOW_MODULES_CONFIG } from '../constants';

// FIX: Explicitly typed component with React.FC and a props interface to handle the `key` prop correctly.
interface TabButtonProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
}
const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm transition-colors
            ${isActive
                ? 'border-accent-blue text-accent-blue'
                : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
            }`}
    >
        {label}
    </button>
);

const WillowsDashboardBuilder = () => {
  const { appState, dispatch } = useAppState();
  const { willowDashboardModules } = appState;

  const [tempEnabledModules, setTempEnabledModules] = useState(willowDashboardModules);
  const [activeTab, setActiveTab] = useState('core');
  
  useEffect(() => {
    setTempEnabledModules(willowDashboardModules);
  }, [willowDashboardModules]);

  const handleToggleModule = (moduleId, enable) => {
    setTempEnabledModules(prev => {
      if (enable && !prev.includes(moduleId)) {
        return [...prev, moduleId];
      }
      if (!enable && prev.includes(moduleId)) {
        return prev.filter(id => id !== moduleId);
      }
      return prev;
    });
  };

  const handleSave = () => {
    dispatch({ type: 'SET_WILLOW_DASHBOARD_MODULES', payload: tempEnabledModules });
    dispatch({ type: 'SET_VIEW', payload: 'willows-dashboard' });
  };

  const handleCancel = () => {
    setTempEnabledModules(willowDashboardModules);
    dispatch({ type: 'SET_VIEW', payload: 'willows-dashboard' });
  };
  
  const moduleCategories = {
    core: 'Core',
    quests: 'Quests',
    checklists: 'Checklists',
    rewards: 'Rewards',
    communication: 'Communication',
  };

  const modulesForTab = ALL_WILLOW_MODULES_CONFIG.filter(m => m.category === activeTab);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-accent-teal mb-4">Customize Willow's Dashboard</h1>
        <p className="text-lg text-text-light text-opacity-80">
          Select the modules you want active on Willow's dashboard. Core modules cannot be disabled.
        </p>
      </header>

      <div className="bg-card-dark rounded-lg border border-gray-700">
        <div className="border-b border-gray-700">
            <nav className="-mb-px flex space-x-2 px-4 overflow-x-auto" aria-label="Tabs">
                {Object.entries(moduleCategories).map(([key, label]) => (
                    <TabButton key={key} label={label} isActive={activeTab === key} onClick={() => setActiveTab(key)} />
                ))}
            </nav>
        </div>
        <div className="p-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {modulesForTab.map(module => (
                  <div key={module.id} className={`flex items-center justify-between p-3 bg-gray-800 rounded-md border border-gray-700 ${!module.isRemovable ? 'opacity-70' : ''}`}>
                    <div>
                      <h3 className="font-semibold text-accent-blue">
                        {module.name} {!module.isRemovable && <span className="text-xs text-gray-400">(Core)</span>}
                      </h3>
                      <p className="text-sm text-text-light text-opacity-70">{module.description}</p>
                    </div>
                    <label className={`relative inline-flex items-center ml-4 ${!module.isRemovable ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                      <input
                        type="checkbox"
                        value=""
                        className="sr-only peer"
                        aria-label={`Toggle ${module.name} module`}
                        checked={tempEnabledModules.includes(module.id)}
                        onChange={(e) => handleToggleModule(module.id, e.target.checked)}
                        disabled={!module.isRemovable}
                      />
                      <div className={`w-11 h-6 rounded-full peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-blue/50 ${
                        tempEnabledModules.includes(module.id) ? 'bg-accent-blue' : 'bg-gray-600'
                      } peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                    </label>
                  </div>
                ))}
              </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-8">
          <Button onClick={handleCancel} variant="secondary">Cancel</Button>
          <Button onClick={handleSave} variant="primary">Save Changes</Button>
      </div>
    </div>
  );
};

export default WillowsDashboardBuilder;