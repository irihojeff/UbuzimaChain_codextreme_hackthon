import React, { useState } from 'react';
import './index.scss';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import MyProfile from './components/MyProfile';
import AdminDashboard from './components/AdminDashboard';
import { ErrorBoundary } from './components/ErrorBoundary';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

function AppContent() {
    const [token, setToken] = useState('');
    const [userId, setUserId] = useState('');
    const [userRole, setUserRole] = useState(null); // Add user role state
    const [error, setError] = useState(null);
    const [showRegister, setShowRegister] = useState(true); // State to toggle between Register and Login forms
    const navigate = useNavigate(); // Initialize the navigate function

    const handleLogin = async (result) => {
        try {
            if ('Ok' in result) {
                setToken(result.Ok.token);
                setUserId(result.Ok.user_id);
                setUserRole(result.Ok.role); // Set user role from login response
                setError(null);

                // Redirect to the dashboard after successful login
                navigate('/dashboard');
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
        setUserRole(null);
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
                {showRegister ? (
                    <Register />
                ) : (
                    <Login
                        onLogin={handleLogin}
                        setToken={setToken}
                        setUserId={setUserId}
                        onError={setError}
                    />
                )}
            </ErrorBoundary>
            <button
                onClick={() => setShowRegister(!showRegister)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
            >
                {showRegister ? "Already have an account? Log In" : "Don't have an account? Sign Up"}
            </button>
        </div>
    );

    return (
        <ErrorBoundary>
            <div className="App">
                <h1 className="text-3xl font-bold text-center p-4">
                    UbuzimaChain - Hospital Management
                </h1>

                {error && renderError()}

                <Routes>
                    <Route
                        path="/"
                        element={!token ? <Navigate to="/login" /> : <Navigate to="/dashboard" />}
                    />
                    <Route
                        path="/register"
                        element={renderAuthSection()}
                    />
                    <Route
                        path="/login"
                        element={renderAuthSection()}
                    />
                    <Route
                        path="/dashboard"
                        element={
                            token ? (
                                <Dashboard
                                    userId={userId}
                                    token={token}
                                    onLogout={handleLogout}
                                />
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />
                    <Route
                        path="/my-profile"
                        element={
                            token && userRole === 'Patient' ? (
                                <MyProfile userId={userId} token={token} />
                            ) : (
                                <Navigate to="/dashboard" />
                            )
                        }
                    />
                    <Route
                        path="/admin-dashboard"
                        element={
                            token && userRole === 'Admin' ? (
                                <AdminDashboard token={token} />
                            ) : (
                                <Navigate to="/dashboard" />
                            )
                        }
                    />
                </Routes>
            </div>
        </ErrorBoundary>
    );
}

export default App;