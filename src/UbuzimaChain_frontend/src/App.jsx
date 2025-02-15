import React, { useState } from 'react';
import './index.scss';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
    const [token, setToken] = useState('');
    const [userId, setUserId] = useState('');
    const [error, setError] = useState(null);

    console.log('Current userId in App:', userId);

    const handleLogin = async (result) => {
        try {
            if ('Ok' in result) {
                setToken(result.Ok.token);
                setUserId(result.Ok.user_id);
                setError(null);
            } else {
                throw new Error(result.Err || 'Login failed');
            }
        } catch (err) {
            setError(err.message);
            console.error('Login error:', err);
        }
    };

    const handleLogout = () => {
        setToken('');
        setUserId('');
        setError(null);
    };

    const renderError = () => (
        <div className="max-w-6xl mx-auto p-4">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
                <button
                    className="absolute top-0 right-0 px-4 py-3"
                    onClick={() => setError(null)}
                >
                    <span className="text-red-500">&times;</span>
                </button>
            </div>
        </div>
    );

    const renderAuthSection = () => (
        <div className="auth-container grid grid-cols-1 md:grid-cols-2 gap-8 p-4 max-w-6xl mx-auto">
            <ErrorBoundary>
                <Register />
            </ErrorBoundary>
            <ErrorBoundary>
                <Login
                    setToken={setToken}
                    setUserId={setUserId}
                    onError={setError}
                />
            </ErrorBoundary>
        </div>
    );

    const renderDashboard = () => (
        <ErrorBoundary>
            <Dashboard
                userId={userId}
                token={token}
                onLogout={handleLogout}
            />
        </ErrorBoundary>
    );

    return (
        <ErrorBoundary>
            <div className="App">
                <h1 className="text-3xl font-bold text-center p-4">
                    UbuzimaChain - Hospital Management
                </h1>

                {error && renderError()}

                {!token ? renderAuthSection() : renderDashboard()}
            </div>
        </ErrorBoundary>
    );
}

export default App;