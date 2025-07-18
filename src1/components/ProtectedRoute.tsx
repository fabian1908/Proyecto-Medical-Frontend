import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ReactNode } from 'react';
import { TipoUsuarioEnum } from '../interfaces/usuario';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: TipoUsuarioEnum[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const isAllowed = allowedRoles ? allowedRoles.includes(user!.tipoUsuario) : true;

  if (!isAllowed) {
    // Redirigir basado en el rol del usuario
    switch (user?.tipoUsuario) {
      case TipoUsuarioEnum.ADMIN:
      case TipoUsuarioEnum.COORDINADOR:
        return <Navigate to="/admin/dashboard" replace />;
      case TipoUsuarioEnum.DOCTOR:
        return <Navigate to="/doctor/dashboard" replace />;
      case TipoUsuarioEnum.PACIENTE:
        return <Navigate to="/usuario/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;