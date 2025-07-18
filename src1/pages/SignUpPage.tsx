import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/axiosConfig';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    dni: '',
    nombre: '',
    apellido: '',
    fechaNacimiento: '',
    telefono: '',
    email: '',
    direccion: '',
    usuario: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Simple validation
    for (const key in formData) {
      if (formData[key as keyof typeof formData] === '') {
        setError('Todos los campos son obligatorios.');
        return;
      }
    }

    try {
      // 1. Create Persona
      await apiClient.post('/api/personas', {
        dni: formData.dni,
        nombre: formData.nombre,
        apellido: formData.apellido,
        fechaNacimiento: formData.fechaNacimiento,
        telefono: formData.telefono,
        email: formData.email,
        direccion: formData.direccion,
      });

      // 2. Create Usuario
      await apiClient.post('/api/usuarios', {
        dniPersona: formData.dni,
        tipoUsuarioId: 1, // Default to user role
        usuario: formData.usuario,
        contrasenia: formData.password, // Plain text, as per backend
        estado: 'ACTIVO',
      });

      // Redirect to login on successful sign-up
      navigate('/login');

    } catch (err) {
      setError('Ocurrió un error durante el registro. El DNI o usuario podría ya existir.');
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Registro de Usuario</h2>
        <form onSubmit={handleSignUp} className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
          {/* Form Fields */}
          {[
            { id: 'dni', label: 'DNI', type: 'text', placeholder: 'Tu DNI' },
            { id: 'nombre', label: 'Nombre', type: 'text', placeholder: 'Tu nombre' },
            { id: 'apellido', label: 'Apellido', type: 'text', placeholder: 'Tu apellido' },
            { id: 'fechaNacimiento', label: 'Fecha de Nacimiento', type: 'date' },
            { id: 'telefono', label: 'Teléfono', type: 'tel', placeholder: '987654321' },
            { id: 'email', label: 'Email', type: 'email', placeholder: 'correo@ejemplo.com' },
            { id: 'direccion', label: 'Dirección', type: 'text', placeholder: 'Tu dirección' },
            { id: 'usuario', label: 'Usuario', type: 'text', placeholder: 'nombre.apellido' },
            { id: 'password', label: 'Contraseña', type: 'password' },
          ].map((field) => (
            <div key={field.id} className={['fechaNacimiento', 'password'].includes(field.id) ? 'sm:col-span-2' : ''}>
              <label htmlFor={field.id} className="text-sm font-medium text-gray-700">
                {field.label}
              </label>
              <input
                id={field.id}
                type={field.type}
                value={formData[field.id as keyof typeof formData]}
                onChange={handleChange}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={field.placeholder}
                required
              />
            </div>
          ))}
          
          {error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Registrarse
            </button>
          </div>
          <p className="text-sm text-center text-gray-600 sm:col-span-2">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Inicia Sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
