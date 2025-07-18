import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, FileText } from 'lucide-react';
import { RecetaResponseDto, RecetaInsertDto, RecetaUpdateDto } from '../../interfaces/receta';
import { 
  obtenerTodasLasRecetas, 
  crearReceta, 
  actualizarReceta, 
  eliminarReceta 
} from '../../api/receta';

const RecetasManagementPage: React.FC = () => {
  const [recetas, setRecetas] = useState<RecetaResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingReceta, setEditingReceta] = useState<RecetaResponseDto | null>(null);
  const [formData, setFormData] = useState<RecetaInsertDto>({
    idCita: 0,
    descripcion: ''
  });

  useEffect(() => {
    cargarRecetas();
  }, []);

  const cargarRecetas = async () => {
    try {
      setLoading(true);
      const data = await obtenerTodasLasRecetas();
      setRecetas(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las recetas');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fechaString: string) => {
    return new Date(fechaString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingReceta) {
        const updateData: RecetaUpdateDto = {
          descripcion: formData.descripcion
        };
        await actualizarReceta(editingReceta.idReceta, updateData);
      } else {
        await crearReceta(formData);
      }
      
      await cargarRecetas();
      setShowModal(false);
      resetForm();
    } catch (err) {
      setError('Error al guardar la receta');
      console.error('Error:', err);
    }
  };

  const handleEdit = (receta: RecetaResponseDto) => {
    setEditingReceta(receta);
    setFormData({
      idCita: receta.idCita,
      descripcion: receta.descripcion
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta receta?')) {
      try {
        await eliminarReceta(id);
        await cargarRecetas();
      } catch (err) {
        setError('Error al eliminar la receta');
        console.error('Error:', err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      idCita: 0,
      descripcion: ''
    });
    setEditingReceta(null);
  };

  const filteredRecetas = recetas.filter(receta =>
    receta.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    receta.nombreDoctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    receta.nombrePaciente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    receta.motivoCita.toLowerCase().includes(searchTerm.toLowerCase()) ||
    receta.idCita.toString().includes(searchTerm)
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64">Cargando recetas...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Recetas</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          Nueva Receta
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
          placeholder="Buscar por descripción, doctor, paciente o motivo de cita..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Tabla de recetas */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Receta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Cita
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paciente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Motivo Cita
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción Receta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky right-0 bg-gray-50">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecetas.map((receta) => (
                <tr key={receta.idReceta} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {receta.idReceta}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {receta.idCita}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {receta.nombreDoctor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {receta.nombrePaciente}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {receta.motivoCita}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                    <div className="break-words">
                      {receta.descripcion}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatearFecha(receta.fechaReceta)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 sticky right-0 bg-white">
                    <button
                      onClick={() => handleEdit(receta)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(receta.idReceta)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredRecetas.length === 0 && (
                <tbody>
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-500">
                      No se encontraron recetas
                    </td>
                  </tr>
                </tbody>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para crear/editar receta */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-[500px] shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <FileText size={20} />
                {editingReceta ? 'Editar Receta' : 'Nueva Receta'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">ID Cita *</label>
                  <input
                    type="number"
                    required
                    value={formData.idCita}
                    onChange={(e) => setFormData({...formData, idCita: parseInt(e.target.value) || 0})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!!editingReceta} // No permitir cambiar cita al editar
                    placeholder="Ingrese el ID de la cita"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Solo se puede editar la descripción. El ID de cita no se puede modificar.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Descripción de la Receta *</label>
                  <textarea
                    required
                    value={formData.descripcion}
                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                    rows={8}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Detalle los medicamentos, dosis, frecuencia y instrucciones para el paciente..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Incluya información completa sobre medicamentos, dosis y instrucciones.
                  </p>
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
                    {editingReceta ? 'Actualizar' : 'Crear'}
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

export default RecetasManagementPage;
