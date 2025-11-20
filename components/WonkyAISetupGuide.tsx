

import React, { useState } from 'react';
import { useAppState } from '@contexts/AppStateContext';
import ContentCard from './ContentCard.js';
import { useFeatureFlags } from '@contexts/FeatureFlagsContext';
import { ALL_WILLIAM_MODULES_CONFIG } from '../constants.js';


// NOTE: Filename is legacy. This component is now the full OnboardingGuide.
const WonkyAISetupGuide = () => {
  const { appState, dispatch } = useAppState();
  const [step, setStep] = useState('apiKey');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for dashboard setup step
  const [selectedModules, setSelectedModules] = useState(
    appState.williamDashboardModules
  );

  const handleToggleModule = (moduleId, enable) => {
    setSelectedModules(prev => {
      if (enable && !prev.includes(moduleId)) {
        return [...prev, moduleId];
      }
      if (!enable && prev.includes(moduleId)) {
        return prev.filter(id => id !== moduleId);
      }
      return prev;
    });
  };

  const handleApiKeySuccess = () => {
    setLoading(false);
    setError(null);
    setStep('walkthrough');
  };

  const handleSelectKey = async () => {
    setLoading(true);
    setError(null);
    try {
      if (typeof window.aistudio?.openSelectKey === 'function') {
        await window.aistudio.openSelectKey();
        handleApiKeySuccess();
      } else {
        setError("`window.aistudio.openSelectKey` is not available. Cannot select API key.");
        setLoading(false);
      }
    } catch (e) {
      if (e.message && e.message.includes("Requested entity was not found.")) {
          setError("Selected API key is invalid or not found. Please select a valid key.");
      } else {
          setError(`Error opening API Key selector: ${e.message || 'Unknown error'}`);
      }
      console.error('Error opening API key selector:', e);
      setLoading(false);
    }
  };

  const handleFinishSetup = () => {
    dispatch({ type: 'SET_WILL_DASHBOARD_MODULES', payload: selectedModules });
    dispatch({ type: 'SET_INITIAL_SETUP_COMPLETE', payload: true });
  };

  const { setFlag } = useFeatureFlags();

  const handleSkipAI = () => {
    // Persist the flag to disable AI features
    setFlag('aiEnabled', false);
    handleFinishSetup();
  }

  if (step === 'apiKey') {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <ContentCard title="Welcome to Wonky Sprout OS" titleClassName="text-accent-teal text-4xl">
          <h2 className="text-2xl font-bold text-accent-blue mb-4">Step 1: Enable AI Features</h2>
          <p className="text-lg text-text-light text-opacity-80 mb-6">
            To begin, you must select an API key to enable powerful AI features within the OS. This is a mandatory step.
            Without a valid key, AI functionalities will be unavailable.
          </p>
          {error && (
            <div role="alert" className="bg-red-900/30 border border-red-700 text-red-400 p-4 rounded-md mb-6">
              <p className="font-bold mb-2">System Error:</p>
              <p>{error}</p>
            </div>
          )}
          <button
            onClick={handleSelectKey}
            disabled={loading}
            className="w-full px-8 py-4 bg-accent-blue text-background-dark text-xl font-bold rounded-md hover:bg-blue-400 transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
            aria-label="Get Started and Select API Key"
          >
            {loading ? 'Opening...' : 'Select API Key'}
          </button>
          <div className="mt-4 text-center">
            <button onClick={handleSkipAI} className="text-sm text-gray-300 underline">Skip AI & Continue in Manual Mode</button>
          </div>
          <p className="text-sm text-text-light text-opacity-70 mt-6 text-center">
            For more information on billing and API keys, please visit:{" "}
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline">
              ai.google.dev/gemini-api/docs/billing
            </a>
          </p>
        </ContentCard>
      </div>
    );
  }

  if (step === 'walkthrough') {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <ContentCard title="System Online: Wonky Sprout OS Initialized" titleClassName="text-accent-teal text-4xl">
          <div className="space-y-6 text-lg text-text-light text-opacity-90">
            <div>
              <h2 className="text-2xl font-bold text-accent-blue mb-2">Step 2: Core System Briefing</h2>
              <p>Acknowledged. API Key validated. This is a mandatory briefing on core system architecture.</p>
            </div>

            <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
              <h3 className="font-bold text-accent-green">IDENTITY: Dashboards</h3>
              <p className="text-sm mt-1">Your Mission Control is persona-driven. Select an identity (William, Co-Parent) to load a pre-configured dashboard. William's dashboard is initialized in "Survival Mode"—only critical modules are active. Expand capabilities via Mod Mode.</p>
            </div>

            <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
              <h3 className="font-bold text-accent-green">EXECUTABLES: Flight Protocols</h3>
              <p className="text-sm mt-1">Flight Protocols (SOPs) are not suggestions. They are the compiled code for your life's routines and emergencies, stored in the Flight Protocol Vault. Their purpose is to externalize executive function and reduce cognitive load. Execute them without deviation.</p>
            </div>

            <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
              <h3 className="font-bold text-accent-green">TOOLCHAIN: Modules</h3>
              <p className="text-sm mt-1">Dashboards are constructed from a modular toolchain (trackers, AI assistants, calendars). Enable, disable, and reconfigure your toolchain to build the precise interface required to diagnose and fix chaos.</p>
            </div>
            
            <button
              onClick={() => setStep('dashboardSetup')}
              className="w-full px-8 py-4 bg-accent-green text-background-dark text-xl font-bold rounded-md hover:bg-green-500 transition-colors duration-200"
              aria-label="Finish Briefing and Proceed to Dashboard Setup"
            >
              Briefing Complete: Proceed to Dashboard Setup
            </button>
          </div>
        </ContentCard>
      </div>
    );
  }

  if (step === 'dashboardSetup') {
    // FIX: Specified the exact string literals for the category to satisfy TypeScript.
    const renderModuleCategory = (category, title) => {
        const modules = ALL_WILLIAM_MODULES_CONFIG.filter(m => m.category === category);
        if (modules.length === 0) return null;

        return (
           <ContentCard title={title} titleClassName="text-accent-blue text-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {modules.map(module => (
                  <div key={module.id} className={`flex flex-col justify-between p-3 bg-gray-800 rounded-md border border-gray-700 h-full ${!module.isRemovable ? 'opacity-70' : ''}`}>
                    <div>
                      <h3 className="font-semibold text-accent-teal">
                        {module.name} {!module.isRemovable && <span className="text-xs text-gray-400">(Core)</span>}
                      </h3>
                      <p className="text-sm text-text-light text-opacity-70 mt-1">{module.description}</p>
                    </div>
                    <div className="flex justify-end mt-3">
                      <label className={`relative inline-flex items-center ${!module.isRemovable ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                        <input
                          type="checkbox"
                          value=""
                          className="sr-only peer"
                            aria-label={`Toggle ${module.name} module`}
                          checked={selectedModules.includes(module.id)}
                          onChange={(e) => handleToggleModule(module.id, e.target.checked)}
                          disabled={!module.isRemovable}
                        />
                        <div className={`w-11 h-6 rounded-full peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-blue/50 ${
                          selectedModules.includes(module.id) ? 'bg-accent-blue' : 'bg-gray-600'
                        } peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </ContentCard>
        );
    }
    return (
      <div className="max-w-4xl mx-auto py-8">
          <ContentCard title="Initial Dashboard Setup" titleClassName="text-accent-teal text-4xl">
              <div className="space-y-6 text-lg text-text-light text-opacity-90">
                <div>
                  <h2 className="text-2xl font-bold text-accent-blue mb-2">Step 3: Configure Your Dashboard</h2>
                  <p>Select the initial modules for your personal dashboard. You can change this later in "Mod Mode". Core modules are mandatory for system stability.</p>
                </div>

                <div className="space-y-6">
                    {renderModuleCategory('core', 'Core Modules')}
                    {renderModuleCategory('trackers', 'Tracker Modules')}
                    {renderModuleCategory('utilities', 'Utility Modules')}
                    {renderModuleCategory('content', 'Content Modules')}
                    {renderModuleCategory('selection', 'Selector Modules')}
                </div>

                <button
                    onClick={handleFinishSetup}
                    className="w-full mt-8 px-8 py-4 bg-accent-green text-background-dark text-xl font-bold rounded-md hover:bg-green-500 transition-colors duration-200"
                    aria-label="Finish Setup and Launch Dashboard"
                >
                    Save Configuration & Launch Dashboard
                </button>
              </div>
          </ContentCard>
      </div>
    );
  }

  return null;
};

export default WonkyAISetupGuide;