import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from '@components/ErrorBoundary';
import { AIProtectionProvider } from '@contexts/AIProtectionContext';
import telemetryBackend from './utils/telemetryBackend';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount React application to.");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
      <ErrorBoundary>
        <AIProtectionProvider>
          <App />
        </AIProtectionProvider>
      </ErrorBoundary>
  </React.StrictMode>
);

// Initialize telemetry backend. Use environment var TELEMETRY_BACKEND='sentry' to try to enable sentry.
telemetryBackend.initTelemetry();
// Initialize web vitals to send core user-experience metrics
import('./utils/webVitals').then(({ initWebVitals }) => initWebVitals()).catch(() => {});