// File: src/components/Navigation.jsx
import React from "react";
import { Link } from "react-router-dom";

function Navigation({ currentUser, onLogout }) {
  return (
    <nav className="nav-bar">
      <h2>UbuzimaChain</h2>
      <ul>
        {currentUser ? (
          <>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <button onClick={onLogout} className="logout-btn">
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/register">Register</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;
