import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ currentUser, children }) {
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default PrivateRoute;
