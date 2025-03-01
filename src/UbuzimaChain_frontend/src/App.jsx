// File: src/App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import { getUserByPrincipal } from "./services/api.service";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const user = await getUserByPrincipal();
        setCurrentUser(user);
      } catch {
        // Not logged in or user not found
      }
    })();
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
    navigate("/login");
  };

  return (
    <ErrorBoundary>
      <Navigation currentUser={currentUser} onLogout={handleLogout} />
      <div className="min-h-screen bg-gray-100 p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={<Login setCurrentUser={setCurrentUser} />}
          />
          <Route
            path="/register"
            element={<Register />}
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute currentUser={currentUser}>
                <Dashboard currentUser={currentUser} />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </ErrorBoundary>
  );
}

export default App;
