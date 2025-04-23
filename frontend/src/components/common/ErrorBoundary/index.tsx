// frontend/src/components/common/ErrorBoundary/index.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { t } from '@lingui/macro'; // Optional: for localization

interface Props {
  children: ReactNode;
  fallback?: ReactNode; // Optional: Provide a custom fallback UI
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  // Update state so the next render shows the fallback UI.
  public static getDerivedStateFromError(error: Error): State {
    // console.log("ErrorBoundary: getDerivedStateFromError triggered", error); // For debugging
    return { hasError: true, error: error };
  }

  // Log the error to an error reporting service or console
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    // Example: Log to a service like Sentry
    // Sentry.captureException(error, { extra: errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      // Render custom fallback UI if provided, otherwise a default message
      if (this.props.fallback !== undefined) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div style={{ padding: '10px', border: '1px dashed red', color: 'red', borderRadius: '4px', margin: '5px 0' }}>
          {t`Error loading this section.`}
          {/* Optionally display error message in development */}
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{ marginTop: '5px', whiteSpace: 'pre-wrap' }}>
              <summary style={{ cursor: 'pointer', fontSize: '0.9em' }}>{t`Error Details`}</summary>
              <pre style={{ fontSize: '0.8em', marginTop: '5px', background: '#f0f0f0', padding: '5px', borderRadius: '3px' }}>
                {this.state.error.toString()}\n{this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    // Normally, just render children
    return this.props.children;
  }
}

export default ErrorBoundary;