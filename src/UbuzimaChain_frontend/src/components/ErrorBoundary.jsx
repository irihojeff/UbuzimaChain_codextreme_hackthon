// ErrorBoundary.jsx
import React from 'react';

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Component Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    <h3 className="font-bold mb-2">Something went wrong</h3>
                    <p>{this.state.error?.message || 'An unexpected error occurred'}</p>
                    <button
                        onClick={() => this.setState({ hasError: false, error: null })}
                        className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
