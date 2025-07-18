import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  allowedRoles: number[]; // e.g., [1] for User, [2] for Doctor, [3] for Admin
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    // Si no está autenticado, redirigir al login
    return <Navigate to="/login" replace />;
  }

  if (user && !allowedRoles.includes(user.tipoUsuarioId)) {
    // Si está autenticado pero no tiene el rol permitido, redirigir
    // Podríamos tener una página específica de "No Autorizado" en el futuro
    return <Navigate to="/" replace />;
  }

  // Si está autenticado y tiene el rol correcto, renderizar el contenido
  return <Outlet />;
};

export default ProtectedRoute;