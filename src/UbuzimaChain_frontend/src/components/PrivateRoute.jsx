// File: src/components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ currentUser, children }) {
  // If there's no user, redirect to /login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  // Otherwise, render the child component
  return children;
}

export default PrivateRoute;
