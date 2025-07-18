import React from 'react';
import { useAuth } from '../context/AuthContext';
import { TipoUsuarioEnum } from '../interfaces/usuario';
import DoctorProfileFields from '../components/DoctorProfileFields';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
      
      {user ? (
        <div className="p-6 bg-white rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Información de la Cuenta</h2>
              <p className="mt-2"><strong>ID Usuario:</strong> {user.idUsuario}</p>
              <p><strong>Correo:</strong> {user.correo}</p>
              <p><strong>Rol:</strong> {user.tipoUsuario}</p>
              <p><strong>Estado:</strong> {user.estado ? 'Activo' : 'Inactivo'}</p>
              {user.codigoCMP && <p><strong>Código CMP:</strong> {user.codigoCMP}</p>}
            </div>
            {/* Aquí se podría añadir más información de la persona */}
          </div>

          {user.tipoUsuario === TipoUsuarioEnum.DOCTOR && (
            <div className="mt-6 border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-800">Perfil Profesional de Doctor</h2>
              <DoctorProfileFields />
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-600">No has iniciado sesión.</p>
      )}
    </div>
  );
};

export default ProfilePage;
