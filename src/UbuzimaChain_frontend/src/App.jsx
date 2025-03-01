// File: src/App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navigation from "./components/Navigation";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ErrorBoundary from "./components/ErrorBoundary";
import { getUserByPrincipal } from "./services/api.service";

/**
 * Main App that sets up routing and manages global user state.
 */
function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // Attempt to auto-fetch user by principal on mount (if they're already logged in).
  useEffect(() => {
    (async () => {
      try {
        const user = await getUserByPrincipal();
        setCurrentUser(user);
      } catch (err) {
        // Not logged in or user not found
      }
    })();
  }, []);

  const handleLogout = () => {
    // Clear user state, in a real app you'd also handle token/internet identity
    setCurrentUser(null);
    navigate("/login");
  };

  return (
    <ErrorBoundary>
      <Navigation currentUser={currentUser} onLogout={handleLogout} />
      <div className="app-container">
        <Routes>
          <Route
            path="/"
            element={
              currentUser ? (
                <Dashboard currentUser={currentUser} />
              ) : (
                <Login setCurrentUser={setCurrentUser} />
              )
            }
          />
          <Route
            path="/login"
            element={<Login setCurrentUser={setCurrentUser} />}
          />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={<Dashboard currentUser={currentUser} />}
          />
        </Routes>
      </div>
    </ErrorBoundary>
  );
}

export default App;
