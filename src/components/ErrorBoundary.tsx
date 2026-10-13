import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('Kitty App caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('kitty_messages');
    } catch {
      // ignore
    }
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full min-h-screen bg-slate-900 text-white flex items-center justify-center p-6 font-sans select-none">
          <div className="max-w-md w-full bg-slate-800/90 backdrop-blur-md rounded-3xl p-8 border border-slate-700 shadow-2xl text-center space-y-5">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-sky-500/20 text-sky-400 flex items-center justify-center text-4xl shadow-inner">
              🐾
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-bold text-white">Kitty is reconnecting...</h1>
              <p className="text-sm text-slate-300 leading-relaxed">
                A browser glitch was caught safely without crashing. Tap below to reload Kitty smoothly!
              </p>
            </div>
            <button
              onClick={this.handleReset}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-sky-500/25 transition-all transform active:scale-95 cursor-pointer"
            >
              Restart Kitty Assistant
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
