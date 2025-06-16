import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const {user} = useAuth();

  if (user === null) {
    return <div>Cargando...</div>;
  }

  // Si hay roles permitidos y el usuario no tiene el rol, muestra 404
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <NotFoundPage />;
  }

  return user ? <>{children}</> : <Navigate to="/" />;
};

export default ProtectedRoute;