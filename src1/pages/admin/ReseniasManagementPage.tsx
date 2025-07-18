import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Star } from 'lucide-react';
import { ReseniaResponseDto, ReseniaInsertDto, ReseniaUpdateDto } from '../../interfaces/resenia';
import { 
  obtenerTodasLasResenias, 
  crearResenia, 
  actualizarResenia, 
  eliminarResenia 
} from '../../api/resenia';

const ReseniasManagementPage: React.FC = () => {
  const [resenias, setResenias] = useState<ReseniaResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingResenia, setEditingResenia] = useState<ReseniaResponseDto | null>(null);
  const [formData, setFormData] = useState<ReseniaInsertDto>({
    idDoctor: 0,
    calificacion: 5,
    comentario: ''
  });

  useEffect(() => {
    cargarResenias();
  }, []);

  const cargarResenias = async () => {
    try {
      setLoading(true);
      const data = await obtenerTodasLasResenias();
      setResenias(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las reseñas');
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

  const renderEstrellas = (calificacion: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        className={index < calificacion ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingResenia) {
        const updateData: ReseniaUpdateDto = {
          calificacion: formData.calificacion,
          comentario: formData.comentario
        };
        await actualizarResenia(editingResenia.idResenia, updateData);
      } else {
        await crearResenia(formData);
      }
      
      await cargarResenias();
      setShowModal(false);
      resetForm();
    } catch (err) {
      setError('Error al guardar la reseña');
      console.error('Error:', err);
    }
  };

  const handleEdit = (resenia: ReseniaResponseDto) => {
    setEditingResenia(resenia);
    setFormData({
      idDoctor: resenia.idDoctor,
      calificacion: resenia.calificacion,
      comentario: resenia.comentario || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta reseña?')) {
      try {
        await eliminarResenia(id);
        await cargarResenias();
      } catch (err) {
        setError('Error al eliminar la reseña');
        console.error('Error:', err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      idDoctor: 0,
      calificacion: 5,
      comentario: ''
    });
    setEditingResenia(null);
  };

  const filteredResenias = resenias.filter(resenia =>
    resenia.comentario.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resenia.idDoctor.toString().includes(searchTerm) ||
    resenia.calificacion.toString().includes(searchTerm)
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64">Cargando reseñas...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Reseñas</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          Nueva Reseña
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
          placeholder="Buscar por comentario, doctor o calificación..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Tabla de reseñas */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Calificación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comentario
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
              {filteredResenias.map((resenia) => (
                <tr key={resenia.idResenia} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {resenia.idResenia}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Doctor ID: {resenia.idDoctor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="flex">{renderEstrellas(resenia.calificacion)}</div>
                      <span className="text-sm text-gray-600">({resenia.calificacion}/5)</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {resenia.comentario || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatearFecha(resenia.fechaResenia)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 sticky right-0 bg-white">
                    <button
                      onClick={() => handleEdit(resenia)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(resenia.idResenia)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredResenias.length === 0 && (
                <tbody>
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      No se encontraron reseñas
                    </td>
                  </tr>
                </tbody>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para crear/editar reseña */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Star size={20} />
                {editingResenia ? 'Editar Reseña' : 'Nueva Reseña'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">ID Doctor *</label>
                  <input
                    type="number"
                    required
                    value={formData.idDoctor}
                    onChange={(e) => setFormData({...formData, idDoctor: parseInt(e.target.value) || 0})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!!editingResenia} // No permitir cambiar doctor al editar
                    placeholder="Ingrese el ID del doctor"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Calificación *</label>
                  <select
                    required
                    value={formData.calificacion}
                    onChange={(e) => setFormData({...formData, calificacion: parseInt(e.target.value)})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num} estrella{num > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Comentario</label>
                  <textarea
                    value={formData.comentario}
                    onChange={(e) => setFormData({...formData, comentario: e.target.value})}
                    rows={4}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Escriba su comentario aquí..."
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
                    {editingResenia ? 'Actualizar' : 'Crear'}
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

export default ReseniasManagementPage;