import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { UsuarioResponseDto, UsuarioInsertDto, UsuarioUpdateDto, TipoUsuarioEnum } from '../../interfaces/usuario';
import { PersonaResponseDto } from '../../interfaces/persona';
import { 
  obtenerTodosLosUsuarios, 
  crearUsuario, 
  actualizarUsuario, 
  eliminarUsuario 
} from '../../api/usuario';
import { obtenerTodasLasPersonas } from '../../api/persona';

// Tipo combinado para mostrar usuario con datos de persona
interface UsuarioConPersona extends UsuarioResponseDto {
  persona?: PersonaResponseDto;
}

const UsersManagementPage: React.FC = () => {
  const [usuarios, setUsuarios] = useState<UsuarioConPersona[]>([]);
  const [personas, setPersonas] = useState<PersonaResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UsuarioResponseDto | null>(null);
  const [formData, setFormData] = useState<UsuarioInsertDto>({
    idPersona: 0,
    correo: '',
    tipoUsuario: TipoUsuarioEnum.PACIENTE,
    contrasenia: '',
    estado: true,
    codigoCMP: ''
  });

  // Cargar usuarios al montar el componente
  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      
      // Cargar usuarios y personas en paralelo
      const [usuariosData, personasData] = await Promise.all([
        obtenerTodosLosUsuarios(),
        obtenerTodasLasPersonas()
      ]);
      
      // Combinar datos de usuarios con sus personas correspondientes
      const usuariosConPersonas: UsuarioConPersona[] = usuariosData.map(usuario => {
        const persona = personasData.find(p => p.id === usuario.idPersona);
        return {
          ...usuario,
          persona
        };
      });
      
      setUsuarios(usuariosConPersonas);
      setPersonas(personasData);
      setError(null);
    } catch (err) {
      setError('Error al cargar los usuarios');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // Actualizar usuario existente
        const updateData: UsuarioUpdateDto = {
          codigoCMP: formData.codigoCMP,
          contrasenia: formData.contrasenia,
          estado: formData.estado
        };
        await actualizarUsuario(editingUser.idUsuario, updateData);
      } else {
        // Crear nuevo usuario
        await crearUsuario(formData);
      }
      
      await cargarUsuarios();
      setShowModal(false);
      resetForm();
    } catch (err) {
      setError('Error al guardar el usuario');
      console.error('Error:', err);
    }
  };

  const handleEdit = (usuario: UsuarioResponseDto) => {
    setEditingUser(usuario);
    setFormData({
      idPersona: usuario.idPersona,
      correo: usuario.correo,
      tipoUsuario: usuario.tipoUsuario,
      contrasenia: '',
      estado: usuario.estado,
      codigoCMP: usuario.codigoCMP || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        await eliminarUsuario(id);
        await cargarUsuarios();
      } catch (err) {
        setError('Error al eliminar el usuario');
        console.error('Error:', err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      idPersona: 0,
      correo: '',
      tipoUsuario: TipoUsuarioEnum.PACIENTE,
      contrasenia: '',
      estado: true,
      codigoCMP: ''
    });
    setEditingUser(null);
  };

  const filteredUsuarios = usuarios.filter(usuario =>
    usuario.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.tipoUsuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (usuario.persona?.nombres.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (usuario.persona?.apellidos.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (usuario.persona?.dni.includes(searchTerm))
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64">Cargando usuarios...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          Nuevo Usuario
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Barra de búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Buscar por correo, tipo, nombres, apellidos o DNI..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                DNI
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombres y Apellidos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Correo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Celular
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo de Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Código CMP
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky right-0 bg-gray-50">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsuarios.map((usuario) => (
              <tr key={usuario.idUsuario} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {usuario.idUsuario}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {usuario.persona?.dni || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {usuario.persona ? 
                    `${usuario.persona.nombres} ${usuario.persona.apellidos}` : 
                    'Sin datos de persona'
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {usuario.correo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {usuario.persona?.celular || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    usuario.tipoUsuario === TipoUsuarioEnum.ADMIN 
                      ? 'bg-red-100 text-red-800'
                      : usuario.tipoUsuario === TipoUsuarioEnum.DOCTOR
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {usuario.tipoUsuario}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    usuario.estado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {usuario.estado ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {usuario.codigoCMP || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 sticky right-0 bg-white">
                  <button
                    onClick={() => handleEdit(usuario)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(usuario.idUsuario)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

          {filteredUsuarios.length === 0 && (
            <tbody>
              <tr>
                <td colSpan={9} className="text-center py-8 text-gray-500">
                  No se encontraron usuarios
                </td>
              </tr>
            </tbody>
          )}
        </table>
        </div>
      </div>

      {/* Modal para crear/editar usuario */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Correo</label>
                  <input
                    type="email"
                    required
                    value={formData.correo}
                    onChange={(e) => setFormData({...formData, correo: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!!editingUser}
                  />
                </div>

                {!editingUser && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Persona</label>
                      <select
                        required
                        value={formData.idPersona}
                        onChange={(e) => setFormData({...formData, idPersona: parseInt(e.target.value)})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={0}>Seleccionar persona...</option>
                        {personas.map(persona => (
                          <option key={persona.id} value={persona.id}>
                            {persona.nombres} {persona.apellidos} - {persona.dni}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tipo de Usuario</label>
                      <select
                        value={formData.tipoUsuario}
                        onChange={(e) => setFormData({...formData, tipoUsuario: e.target.value as TipoUsuarioEnum})}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={TipoUsuarioEnum.PACIENTE}>Paciente</option>
                        <option value={TipoUsuarioEnum.DOCTOR}>Doctor</option>
                        <option value={TipoUsuarioEnum.ADMIN}>Admin</option>
                        <option value={TipoUsuarioEnum.COORDINADOR}>Coordinador</option>
                      </select>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                  <input
                    type="password"
                    required={!editingUser}
                    value={formData.contrasenia}
                    onChange={(e) => setFormData({...formData, contrasenia: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={editingUser ? "Dejar en blanco para mantener" : ""}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Código CMP (opcional)</label>
                  <input
                    type="text"
                    value={formData.codigoCMP}
                    onChange={(e) => setFormData({...formData, codigoCMP: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="estado"
                    checked={formData.estado}
                    onChange={(e) => setFormData({...formData, estado: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="estado" className="ml-2 block text-sm text-gray-900">
                    Usuario activo
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                  >
                    {editingUser ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagementPage;