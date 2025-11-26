
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ element, roles = [] }) => {
  const {token, loading } = useAuth();

  const isPublic = roles.includes("PUBLIC");


  if (isPublic) {
  
    if (token) {
      return <Navigate to="/subjects/base" replace />;
    }
    return element;
  }


  if (loading) {
    return <p>Yüklənir...</p>;
  }


  if (!token) {
    return <Navigate to="/login" replace />;
  }

 

  return element;
};

export default ProtectedRoute;
