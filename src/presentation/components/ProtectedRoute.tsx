import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const {user} = useAuth();

  if (user === null) {
    // Puedes mostrar un loader aquí si lo deseas
    return <div>Cargando...</div>;
  }

  return user ? <>{children}</> : <Navigate to="/" />;
};

export default ProtectedRoute;