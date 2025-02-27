import React, { useState } from 'react';
import './styles/index.scss';
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
  const [userRole, setUserRole] = useState(null);
  const [error, setError] = useState(null);
  const [showRegister, setShowRegister] = useState(false); // Start with login
  const navigate = useNavigate();

  const handleLogin = async (result) => {
    try {
      if ('Ok' in result) {
        setToken(result.Ok.token);
        setUserId(result.Ok.user_id);
        // Role will be fetched later from user details
        setError(null);
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
    <div className="min-h-screen flex">
      <div className="flex-1 flex flex-col justify-center items-center bg-gray-50 p-8">
        {showRegister ? (
          <>
            <h2 className="text-2xl font-bold mb-4">Create Your Account</h2>
            <Register />
            <p className="mt-4">
              Already have an account?{' '}
              <button
                onClick={() => setShowRegister(false)}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Sign In
              </button>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">Sign In to Your Account</h2>
            <Login onLogin={handleLogin} onError={setError} />
            <p className="mt-4">
              Don’t have an account?{' '}
              <button
                onClick={() => setShowRegister(true)}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Sign Up
              </button>
            </p>
          </>
        )}
      </div>
      <div className="hidden md:flex flex-1 bg-indigo-500 items-center justify-center">
        <h1 className="text-white text-3xl font-bold">
          UbuzimaChain <br /> Hospital Management
        </h1>
      </div>
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
          <Route path="/" element={!token ? <Navigate to="/login" /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={renderAuthSection()} />
          <Route path="/login" element={renderAuthSection()} />
          <Route
            path="/dashboard"
            element={
              token ? (
                <Dashboard
                  userId={userId}
                  token={token}
                  onLogout={handleLogout}
                  setUserRole={setUserRole}
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
