import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "#080808",
          color: "#e5b800",
          fontFamily: "var(--font-display, sans-serif)",
          fontSize: "1.2rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        Authenticating...
      </div>
    );
  }

  if (adminOnly) {
    if (!isAuthenticated || !isAdmin) {
      return <Navigate to="/admin/login" replace />;
    }
  } else {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
}
