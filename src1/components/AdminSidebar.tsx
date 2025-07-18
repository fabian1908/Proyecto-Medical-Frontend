import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Users, 
  UserCircle,
  Stethoscope, 
  Calendar, 
  Building2,
  CreditCard,
  Clock,
  Star,
  Heart,
  FileText,
  Activity
} from 'lucide-react';

const AdminSidebar: React.FC = () => {
  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-2 rounded-lg transition-colors ${
      isActive
        ? 'bg-indigo-600 text-white'
        : 'text-gray-700 hover:bg-gray-200'
    }`;

  return (
    <aside className="w-64 bg-white shadow-md h-full flex-shrink-0">
      <div className="p-4">
        <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
      </div>
      <nav className="p-4 space-y-2">
        {/* Gestión de Usuarios y Personas */}
        <NavLink to="/admin/dashboard/users" className={navLinkClasses}>
          <Users className="mr-3" size={20} />
          <span>Usuarios</span>
        </NavLink>
        <NavLink to="/admin/dashboard/personas" className={navLinkClasses}>
          <UserCircle className="mr-3" size={20} />
          <span>Personas</span>
        </NavLink>
        
        {/* Gestión Médica */}
        <NavLink to="/admin/dashboard/especialidades" className={navLinkClasses}>
          <Stethoscope className="mr-3" size={20} />
          <span>Especialidades</span>
        </NavLink>
        <NavLink to="/admin/dashboard/servicios" className={navLinkClasses}>
          <Heart className="mr-3" size={20} />
          <span>Servicios</span>
        </NavLink>
        <NavLink to="/admin/dashboard/consultorios" className={navLinkClasses}>
          <Building2 className="mr-3" size={20} />
          <span>Consultorios</span>
        </NavLink>
        
        {/* Gestión de Citas y Horarios */}
        <NavLink to="/admin/dashboard/citas" className={navLinkClasses}>
          <Calendar className="mr-3" size={20} />
          <span>Citas</span>
        </NavLink>
        <NavLink to="/admin/dashboard/horarios" className={navLinkClasses}>
          <Clock className="mr-3" size={20} />
          <span>Horarios</span>
        </NavLink>
        
        {/* Gestión Médica - Recetas y Diagnósticos */}
        <NavLink to="/admin/dashboard/recetas" className={navLinkClasses}>
          <FileText className="mr-3" size={20} />
          <span>Recetas</span>
        </NavLink>
        <NavLink to="/admin/dashboard/diagnosticos" className={navLinkClasses}>
          <Activity className="mr-3" size={20} />
          <span>Diagnósticos</span>
        </NavLink>
        
        {/* Gestión Financiera */}
        <NavLink to="/admin/dashboard/pagos" className={navLinkClasses}>
          <CreditCard className="mr-3" size={20} />
          <span>Pagos</span>
        </NavLink>
        
        {/* Gestión de Reseñas */}
        <NavLink to="/admin/dashboard/resenias" className={navLinkClasses}>
          <Star className="mr-3" size={20} />
          <span>Reseñas</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default AdminSidebar;