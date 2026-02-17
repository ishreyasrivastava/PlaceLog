import { Component } from 'react';
import { AlertCircle } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) { console.error('Error boundary:', error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center page-bg">
          <div className="text-center px-4">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Please refresh the page.</p>
            <button onClick={() => window.location.reload()} className="btn-primary">Refresh</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
