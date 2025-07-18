import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { UsuarioResponseDto, TipoUsuarioEnum } from '../interfaces/usuario';
import { verifyToken, logoutUser } from '../api/auth';

interface AuthContextType {
  user: UsuarioResponseDto | null;
  login: (user: UsuarioResponseDto) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isDoctor: boolean;
  isPaciente: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UsuarioResponseDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar token al iniciar la aplicación
    const initAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (token && storedUser) {
          try {
            // Verificar si el token sigue siendo válido
            const verifiedUser = await verifyToken();
            if (verifiedUser) {
              setUser(verifiedUser);
            } else {
              // Token inválido, limpiar localStorage
              localStorage.removeItem('user');
              localStorage.removeItem('token');
            }
          } catch (tokenError) {
            console.log('Token expirado o inválido, usando datos locales');
            // Si falla la verificación del token, usar datos locales
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
          }
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (userData: UsuarioResponseDto) => {
    localStorage.setItem('user', JSON.stringify(userData));
    // Si viene un token en la respuesta, guardarlo también
    if (userData.token) {
      localStorage.setItem('token', userData.token);
    }
    setUser(userData);
  };

  const logout = async () => {
    try {
      // Intentar logout con la API
      await logoutUser();
    } catch (error) {
      console.error('Error durante logout en API:', error);
    }
    
    // Siempre limpiar localStorage y estado local
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.tipoUsuario === TipoUsuarioEnum.ADMIN || user?.tipoUsuario === TipoUsuarioEnum.COORDINADOR;
  const isDoctor = user?.tipoUsuario === TipoUsuarioEnum.DOCTOR;
  const isPaciente = user?.tipoUsuario === TipoUsuarioEnum.PACIENTE;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isAdmin, isDoctor, isPaciente, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};