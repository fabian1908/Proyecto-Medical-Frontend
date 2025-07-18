import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { ConsultorioResponseDto, ConsultorioInsertDto, ConsultorioUpdateDto } from '../../interfaces/consultorio';
import { 
  obtenerTodosLosConsultorios, 
  crearConsultorio, 
  actualizarConsultorio, 
  eliminarConsultorio 
} from '../../api/consultorio';

const ConsultoriosManagementPage: React.FC = () => {
  const [consultorios, setConsultorios] = useState<ConsultorioResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingConsultorio, setEditingConsultorio] = useState<ConsultorioResponseDto | null>(null);
  const [formData, setFormData] = useState<ConsultorioInsertDto>({
    ruc: '',
    nombre: '',
    latitud: 0,
    longitud: 0,
    direccion: '',
    telefono: ''
  });

  useEffect(() => {
    cargarConsultorios();
  }, []);

  const cargarConsultorios = async () => {
    try {
      setLoading(true);
      const data = await obtenerTodosLosConsultorios();
      setConsultorios(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los consultorios');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingConsultorio) {
        const updateData: ConsultorioUpdateDto = {
          ruc: formData.ruc,
          nombre: formData.nombre,
          latitud: formData.latitud,
          longitud: formData.longitud,
          direccion: formData.direccion,
          telefono: formData.telefono
        };
        await actualizarConsultorio(editingConsultorio.idConsultorio, updateData);
      } else {
        await crearConsultorio(formData);
      }
      
      await cargarConsultorios();
      setShowModal(false);
      resetForm();
    } catch (err) {
      setError('Error al guardar el consultorio');
      console.error('Error:', err);
    }
  };

  const handleEdit = (consultorio: ConsultorioResponseDto) => {
    setEditingConsultorio(consultorio);
    setFormData({
      ruc: consultorio.ruc,
      nombre: consultorio.nombre,
      latitud: consultorio.latitud,
      longitud: consultorio.longitud,
      direccion: consultorio.direccion || '',
      telefono: consultorio.telefono || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este consultorio?')) {
      try {
        await eliminarConsultorio(id);
        await cargarConsultorios();
      } catch (err) {
        setError('Error al eliminar el consultorio');
        console.error('Error:', err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      ruc: '',
      nombre: '',
      latitud: 0,
      longitud: 0,
      direccion: '',
      telefono: ''
    });
    setEditingConsultorio(null);
  };

  const filteredConsultorios = consultorios.filter(consultorio =>
    consultorio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    consultorio.ruc.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (consultorio.direccion && consultorio.direccion.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64">Cargando consultorios...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Consultorios</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          Nuevo Consultorio
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
          placeholder="Buscar por nombre, RUC o dirección..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Tabla de consultorios */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  RUC
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dirección
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teléfono
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coordenadas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky right-0 bg-gray-50">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredConsultorios.map((consultorio) => (
                <tr key={consultorio.idConsultorio} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {consultorio.idConsultorio}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {consultorio.ruc}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {consultorio.nombre}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {consultorio.direccion || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {consultorio.telefono || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {consultorio.latitud.toFixed(6)}, {consultorio.longitud.toFixed(6)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 sticky right-0 bg-white">
                    <button
                      onClick={() => handleEdit(consultorio)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(consultorio.idConsultorio)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredConsultorios.length === 0 && (
                <tbody>
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      No se encontraron consultorios
                    </td>
                  </tr>
                </tbody>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para crear/editar consultorio */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingConsultorio ? 'Editar Consultorio' : 'Nuevo Consultorio'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">RUC *</label>
                  <input
                    type="text"
                    required
                    value={formData.ruc}
                    onChange={(e) => setFormData({...formData, ruc: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Latitud *</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={formData.latitud}
                      onChange={(e) => setFormData({...formData, latitud: parseFloat(e.target.value) || 0})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Longitud *</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={formData.longitud}
                      onChange={(e) => setFormData({...formData, longitud: parseFloat(e.target.value) || 0})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Dirección</label>
                  <input
                    type="text"
                    value={formData.direccion}
                    onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                  <input
                    type="text"
                    value={formData.telefono}
                    onChange={(e) => setFormData({...formData, telefono: e.target.value})}
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
                    {editingConsultorio ? 'Actualizar' : 'Crear'}
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

export default ConsultoriosManagementPage;
