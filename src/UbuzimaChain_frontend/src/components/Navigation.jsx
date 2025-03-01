// File: src/components/Navigation.jsx
import React from "react";
import { Link } from "react-router-dom";

function Navigation({ currentUser, onLogout }) {
  return (
    <nav className="bg-white shadow p-4 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold">
        UbuzimaChain
      </Link>
      <ul className="flex items-center gap-4">
        {!currentUser && (
          <>
            <li>
              <Link to="/register" className="text-blue-600 hover:underline">
                Register
              </Link>
            </li>
            <li>
              <Link to="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
            </li>
          </>
        )}
        {currentUser && (
          <>
            <li>
              <Link to="/dashboard" className="text-blue-600 hover:underline">
                Dashboard
              </Link>
            </li>
            <li>
              <button
                onClick={onLogout}
                className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
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
