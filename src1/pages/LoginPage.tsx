import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TipoUsuarioEnum } from '../interfaces/usuario';
import { LoginRequest } from "../interfaces/auth";
import { loginUser } from "../api/auth";

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Por favor, ingresa tu usuario y contraseña.');
      return;
    }

    try {
      // USAR API REAL PARA LOGIN
      const credenciales: LoginRequest = {
        usuario: username,
        contrasenia: password
      };
      
      const usuario = await loginUser(credenciales);

      // Guardar el usuario en el contexto y localStorage
      login(usuario);
      
      // Redirección basada en rol
      switch (usuario.tipoUsuario) {
        case TipoUsuarioEnum.PACIENTE:
          navigate('/user/dashboard');
          break;
        case TipoUsuarioEnum.DOCTOR:
          navigate('/doctor/dashboard');
          break;
        case TipoUsuarioEnum.ADMIN:
        case TipoUsuarioEnum.COORDINADOR:
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      console.error('Error durante login:', err);
      setError('Usuario o contraseña incorrectos.');
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">Iniciar Sesión</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="text-sm font-medium text-gray-700">
              Usuario
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Iniciar Sesión
            </button>
          </div>
          <p className="text-sm text-center text-gray-600">
            ¿No tienes una cuenta?{' '}
            <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
              Regístrate
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
