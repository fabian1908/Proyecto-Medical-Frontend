import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { EspecialidadResponseDto, EspecialidadInsertDto, EspecialidadUpdateDto } from '../../interfaces/especialidad';
import { 
  obtenerTodasLasEspecialidades, 
  crearEspecialidad, 
  actualizarEspecialidad, 
  eliminarEspecialidad 
} from '../../api/especialidad';

const EspecialidadesManagementPage: React.FC = () => {
  const [especialidades, setEspecialidades] = useState<EspecialidadResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEspecialidad, setEditingEspecialidad] = useState<EspecialidadResponseDto | null>(null);
  const [formData, setFormData] = useState<EspecialidadInsertDto>({
    nombre: '',
    descripcion: ''
  });

  useEffect(() => {
    cargarEspecialidades();
  }, []);

  const cargarEspecialidades = async () => {
    try {
      setLoading(true);
      const data = await obtenerTodasLasEspecialidades();
      setEspecialidades(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las especialidades');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEspecialidad) {
        const updateData: EspecialidadUpdateDto = {
          nombre: formData.nombre,
          descripcion: formData.descripcion
        };
        await actualizarEspecialidad(editingEspecialidad.idEspecialidad, updateData);
      } else {
        await crearEspecialidad(formData);
      }
      
      await cargarEspecialidades();
      setShowModal(false);
      resetForm();
    } catch (err) {
      setError('Error al guardar la especialidad');
      console.error('Error:', err);
    }
  };

  const handleEdit = (especialidad: EspecialidadResponseDto) => {
    setEditingEspecialidad(especialidad);
    setFormData({
      nombre: especialidad.nombre,
      descripcion: especialidad.descripcion || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta especialidad?')) {
      try {
        await eliminarEspecialidad(id);
        await cargarEspecialidades();
      } catch (err) {
        setError('Error al eliminar la especialidad');
        console.error('Error:', err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: ''
    });
    setEditingEspecialidad(null);
  };

  const filteredEspecialidades = especialidades.filter(especialidad =>
    especialidad.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (especialidad.descripcion && especialidad.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64">Cargando especialidades...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Especialidades</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          Nueva Especialidad
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
          placeholder="Buscar por nombre o descripción..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Tabla de especialidades */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky right-0 bg-gray-50">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEspecialidades.map((especialidad) => (
                <tr key={especialidad.idEspecialidad} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {especialidad.idEspecialidad}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {especialidad.nombre}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {especialidad.descripcion || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 sticky right-0 bg-white">
                    <button
                      onClick={() => handleEdit(especialidad)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(especialidad.idEspecialidad)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredEspecialidades.length === 0 && (
                <tbody>
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-500">
                      No se encontraron especialidades
                    </td>
                  </tr>
                </tbody>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para crear/editar especialidad */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingEspecialidad ? 'Editar Especialidad' : 'Nueva Especialidad'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre *</label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Descripción</label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
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
                    {editingEspecialidad ? 'Actualizar' : 'Crear'}
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

export default EspecialidadesManagementPage;
