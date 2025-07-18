import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Stethoscope, X, Menu } from 'lucide-react';
import { TipoUsuarioEnum } from '../interfaces/usuario';

const Navbar = () => {
  const { isAuthenticated, isAdmin, isDoctor, isPaciente, logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      isActive
        ? 'bg-gray-900 text-white'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;

  return (
    <nav className="bg-gray-800 shadow-md relative z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 text-white flex items-center space-x-2">
              <Stethoscope size={28} />
              <span className="font-bold text-xl">Habimed</span>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <NavLink to="/" className={navLinkClasses}>Home</NavLink>
                <NavLink to="/about" className={navLinkClasses}>Quiénes Somos</NavLink>
                <NavLink to="/servicios-medicos" className={navLinkClasses}>Servicios Médicos</NavLink>
                {/* Add more general links here */}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {!isAuthenticated ? (
                <button
                  onClick={() => navigate('/login')}
                  className="px-3 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Login
                </button>
              ) : (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-300 text-sm">Hola, {user?.correo}</span>
                  {isPaciente && <NavLink to="/usuario/dashboard" className={navLinkClasses}>Mi Panel</NavLink>}
                  {isDoctor && <NavLink to="/doctor/dashboard" className={navLinkClasses}>Mi Panel</NavLink>}
                  {isAdmin && <NavLink to="/admin/dashboard" className={navLinkClasses}>Admin Panel</NavLink>}
                  <NavLink to="/profile" className={navLinkClasses}>Mi Perfil</NavLink>
                  <button
                    onClick={logout}
                    className="px-3 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink to="/" className={navLinkClasses} onClick={() => setIsOpen(false)}>Home</NavLink>
            <NavLink to="/about" className={navLinkClasses} onClick={() => setIsOpen(false)}>Quiénes Somos</NavLink>
            <NavLink to="/servicios-medicos" className={navLinkClasses} onClick={() => setIsOpen(false)}>Servicios Médicos</NavLink>
            {!isAuthenticated ? (
              <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700" onClick={() => setIsOpen(false)}>
                Login
              </Link>
            ) : (
              <>
                <NavLink to="/profile" className={navLinkClasses} onClick={() => setIsOpen(false)}>Mi Perfil</NavLink>
                {isDoctor && <NavLink to="/doctor/dashboard" className={navLinkClasses} onClick={() => setIsOpen(false)}>Mi Panel</NavLink>}
                {isAdmin && <NavLink to="/admin/dashboard" className={navLinkClasses} onClick={() => setIsOpen(false)}>Admin Panel</NavLink>}
                <button
                  onClick={() => { logout(); setIsOpen(false); }}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
