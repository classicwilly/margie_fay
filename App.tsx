import React from 'react';
import { AppStateProvider, useAppState } from './src/contexts/AppStateContext';
import { OscilloscopeProvider } from './src/contexts/OscilloscopeContext';
import { Header } from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Garden from './components/Garden';
import OnboardingStepper from './components/OnboardingStepper';
import { useGoogleAuth } from './hooks/useGoogleAuth';
import { googleWorkspaceService } from './src/services/googleWorkspaceService';

const AppContent: React.FC = () => {
  const { appState } = useAppState();
  const { view } = appState;
  const { isAuthenticated, accessToken } = useGoogleAuth();

  // Load calendar events when authenticated
  const [events, setEvents] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isAuthenticated && accessToken) {
      loadCalendarEvents();
    }
  }, [isAuthenticated, accessToken]);

  const loadCalendarEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const calendarEvents = await googleWorkspaceService.getCalendarEvents(10);
      setEvents(calendarEvents);
    } catch (err) {
      setError('Failed to load calendar events');
      console.error('Error loading calendar events:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard events={events} loading={loading} error={error} />;
      case 'garden':
        return <Garden />;
      default:
        return <Dashboard events={events} loading={loading} error={error} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <Header openResetModal={() => {}} />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          {renderView()}
          {!appState.initialSetupComplete && <OnboardingStepper />}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppStateProvider>
      <OscilloscopeProvider>
        <AppContent />
      </OscilloscopeProvider>
    </AppStateProvider>
  );
};

export default App;