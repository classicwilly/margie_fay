import React from 'react';

type State = { hasError: boolean };

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    try {
      // Also set a global error marker as early as possible so tests can read it
      if (typeof window !== 'undefined' && (window as any).__WONKY_LAST_ERROR__ == null) {
        // We can't access the error value here, but set a flag to help tests
        (window as any).__WONKY_LAST_ERROR__ = (window as any).__WONKY_LAST_ERROR__ || { message: 'Unknown React render error' };
      }
    } catch (e) { /* ignore */ }
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Conservative logging; this is intentionally direct and actionable.
    console.error('[ErrorBoundary] Uncaught error:', error, info);
    try {
      if (typeof window !== 'undefined') {
        // Expose last error to Playwright/E2E so tests can inspect error details
        (window as any).__WONKY_LAST_ERROR__ = { message: error?.message, stack: error?.stack, info };
        try { window.localStorage.setItem('wonky-last-error', JSON.stringify({ message: error?.message, stack: error?.stack, info })); } catch (e) { /* ignore */ }
      }
    } catch (e) { /* ignore */ }
    // TODO: forward to telemetry or log store
  }

  render() {
    if (this.state.hasError) {
      return (
        <main role="alert" className="p-8 text-center">
          <h2 className="text-2xl font-bold">System Error</h2>
          <p className="mt-4">Something went wrong. Open Command Center to recover your session.</p>
          {/* Render last error details when available so Playwright/CIs can capture the stack trace */}
          {(typeof window !== 'undefined') && (window as any).__WONKY_LAST_ERROR__ ? (
            <pre data-testid="wonky-last-error" className="mt-4 text-left text-xs break-words">{JSON.stringify((window as any).__WONKY_LAST_ERROR__, null, 2)}</pre>
          ) : null}
        </main>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
