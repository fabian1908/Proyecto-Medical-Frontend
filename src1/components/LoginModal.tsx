import React, { useState } from 'react';
import { X, User, Lock, Eye, EyeOff } from 'lucide-react';

// Componente de Login Modal
const LoginModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const handleLogin = () => {
    console.log('Login attempt:', loginForm);
    alert('Login successful!');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Iniciar Sesión</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm(prev => ({...prev, email: e.target.value}))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="tu@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                value={loginForm.password}
                onChange={(e) => setLoginForm(prev => ({...prev, password: e.target.value}))}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Tu contraseña"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors duration-200 font-medium"
          >
            Iniciar Sesión
          </button>

          <div className="text-center">
            <a href="#" className="text-sm text-green-600 hover:text-green-700">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
