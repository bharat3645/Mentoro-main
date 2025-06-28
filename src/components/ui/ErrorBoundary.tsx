import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-space-gradient flex items-center justify-center p-4">
          <div className="bg-black/40 backdrop-blur-md rounded-xl p-8 border border-neon-red/30 text-center max-w-md">
            <AlertTriangle className="w-16 h-16 text-neon-red mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4 font-game">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-400 mb-6 font-space">
              The application encountered an unexpected error. Don't worry, your progress is safe!
            </p>
            <button
              onClick={this.handleReload}
              className="flex items-center space-x-2 mx-auto px-6 py-3 bg-gradient-to-r from-neon-red to-neon-pink rounded-lg font-bold text-white hover:shadow-lg hover:shadow-neon-red/25 transition-all font-space"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Reload Application</span>
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="text-sm text-gray-400 cursor-pointer">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 text-xs text-red-400 bg-black/20 p-2 rounded overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;