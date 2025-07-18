import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Activity } from 'lucide-react';
import { DiagnosticoResponseDto, DiagnosticoInsertDto, DiagnosticoUpdateDto } from '../../interfaces/diagnostico';
import { 
  obtenerTodosLosDiagnosticos, 
  crearDiagnostico, 
  actualizarDiagnostico, 
  eliminarDiagnostico 
} from '../../api/diagnostico';

const DiagnosticosManagementPage: React.FC = () => {
  const [diagnosticos, setDiagnosticos] = useState<DiagnosticoResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDiagnostico, setEditingDiagnostico] = useState<DiagnosticoResponseDto | null>(null);
  const [formData, setFormData] = useState<DiagnosticoInsertDto>({
    idCita: 0,
    descripcion: ''
  });

  useEffect(() => {
    cargarDiagnosticos();
  }, []);

  const cargarDiagnosticos = async () => {
    try {
      setLoading(true);
      const data = await obtenerTodosLosDiagnosticos();
      setDiagnosticos(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los diagnósticos');
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
      if (editingDiagnostico) {
        const updateData: DiagnosticoUpdateDto = {
          descripcion: formData.descripcion
        };
        await actualizarDiagnostico(editingDiagnostico.idDiagnostico, updateData);
      } else {
        await crearDiagnostico(formData);
      }
      
      await cargarDiagnosticos();
      setShowModal(false);
      resetForm();
    } catch (err) {
      setError('Error al guardar el diagnóstico');
      console.error('Error:', err);
    }
  };

  const handleEdit = (diagnostico: DiagnosticoResponseDto) => {
    setEditingDiagnostico(diagnostico);
    setFormData({
      idCita: diagnostico.idCita,
      descripcion: diagnostico.descripcion
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este diagnóstico?')) {
      try {
        await eliminarDiagnostico(id);
        await cargarDiagnosticos();
      } catch (err) {
        setError('Error al eliminar el diagnóstico');
        console.error('Error:', err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      idCita: 0,
      descripcion: ''
    });
    setEditingDiagnostico(null);
  };

  const filteredDiagnosticos = diagnosticos.filter(diagnostico =>
    diagnostico.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    diagnostico.idCita.toString().includes(searchTerm) ||
    diagnostico.idDiagnostico.toString().includes(searchTerm)
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64">Cargando diagnósticos...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Diagnósticos</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          Nuevo Diagnóstico
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
          placeholder="Buscar por descripción, ID diagnóstico o ID cita..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Tabla de diagnósticos */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Diagnóstico
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Cita
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción del Diagnóstico
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
              {filteredDiagnosticos.map((diagnostico) => (
                <tr key={diagnostico.idDiagnostico} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {diagnostico.idDiagnostico}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {diagnostico.idCita}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-md">
                    <div className="break-words">
                      {diagnostico.descripcion}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatearFecha(diagnostico.fechaDiagnostico)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 sticky right-0 bg-white">
                    <button
                      onClick={() => handleEdit(diagnostico)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(diagnostico.idDiagnostico)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredDiagnosticos.length === 0 && (
                <tbody>
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      No se encontraron diagnósticos
                    </td>
                  </tr>
                </tbody>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para crear/editar diagnóstico */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-[500px] shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Activity size={20} />
                {editingDiagnostico ? 'Editar Diagnóstico' : 'Nuevo Diagnóstico'}
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
                    disabled={!!editingDiagnostico} // No permitir cambiar cita al editar
                    placeholder="Ingrese el ID de la cita"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Solo se puede editar la descripción. El ID de cita no se puede modificar.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Descripción del Diagnóstico *</label>
                  <textarea
                    required
                    value={formData.descripcion}
                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                    rows={8}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describa el diagnóstico médico detallado, síntomas observados, conclusiones y recomendaciones..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Incluya información médica completa, síntomas, evaluación y plan de tratamiento.
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
                    {editingDiagnostico ? 'Actualizar' : 'Crear'}
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

export default DiagnosticosManagementPage;
