// File: src/components/Navigation.jsx
import React from "react";
import { Link } from "react-router-dom";

function Navigation({ currentUser, onLogout }) {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-3xl font-extrabold text-blue-600">
        UbuzimaChain
      </Link>
      <ul className="flex items-center gap-6">
        {!currentUser && (
          <>
            <li>
              <Link to="/register" className="text-lg text-blue-500 hover:underline">
                Register
              </Link>
            </li>
            <li>
              <Link to="/login" className="text-lg text-blue-500 hover:underline">
                Login
              </Link>
            </li>
          </>
        )}
        {currentUser && (
          <>
            <li>
              <Link to="/dashboard" className="text-lg text-blue-500 hover:underline">
                Dashboard
              </Link>
            </li>
            <li>
              <button
                onClick={onLogout}
                className="text-lg bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
              >
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;
