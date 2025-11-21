import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from '@components/ErrorBoundary';
import { AIProtectionProvider } from '@contexts/AIProtectionContext';
import telemetryBackend from './utils/telemetryBackend';

if (typeof document !== 'undefined') {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    // If the root element cannot be found in the current environment, do not mount.
    // This avoids runtime errors in SSR or non-browser environments.
    console.warn('No root element found; skipping client render.');
  } else {
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
  }
}

// Initialize telemetry backend. Use environment var TELEMETRY_BACKEND='sentry' to try to enable sentry.
telemetryBackend.initTelemetry();
// Initialize web vitals to send core user-experience metrics
import('./utils/webVitals').then(({ initWebVitals }) => initWebVitals()).catch(() => {});