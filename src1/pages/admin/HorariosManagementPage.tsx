import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Clock } from 'lucide-react';
import { HorarioDoctorResponseDto, HorarioDoctorInsertDto, HorarioDoctorUpdateDto } from '../../interfaces/horarioDoctor';
import { 
  obtenerTodosLosHorariosDoctores, 
  crearHorarioDoctor, 
  actualizarHorarioDoctor, 
  eliminarHorarioDoctor 
} from '../../api/horarioDoctor';

const HorariosManagementPage: React.FC = () => {
  const [horarios, setHorarios] = useState<HorarioDoctorResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingHorario, setEditingHorario] = useState<HorarioDoctorResponseDto | null>(null);
  const [formData, setFormData] = useState<HorarioDoctorInsertDto>({
    idDoctor: 0,
    diaSemana: '',
    horaInicio: '',
    horaFin: ''
  });

  const diasSemana = [
    'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'
  ];

  useEffect(() => {
    cargarHorarios();
  }, []);

  const cargarHorarios = async () => {
    try {
      setLoading(true);
      const data = await obtenerTodosLosHorariosDoctores();
      setHorarios(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los horarios');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const obtenerNombreDoctor = (idDoctor: number) => {
    // Usamos el nombre que viene en la respuesta o mostramos el ID
    return `Doctor ID: ${idDoctor}`;
  };

  const formatearHora = (hora: string) => {
    return hora.substring(0, 5); // HH:MM
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingHorario) {
        const updateData: HorarioDoctorUpdateDto = {
          diaSemana: formData.diaSemana,
          horaInicio: formData.horaInicio,
          horaFin: formData.horaFin
        };
        await actualizarHorarioDoctor(editingHorario.idHorarioDoctor, updateData);
      } else {
        await crearHorarioDoctor(formData);
      }
      
      await cargarHorarios();
      setShowModal(false);
      resetForm();
    } catch (err) {
      setError('Error al guardar el horario');
      console.error('Error:', err);
    }
  };

  const handleEdit = (horario: HorarioDoctorResponseDto) => {
    setEditingHorario(horario);
    setFormData({
      idDoctor: horario.idDoctor,
      diaSemana: horario.diaSemana,
      horaInicio: horario.horaInicio,
      horaFin: horario.horaFin
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este horario?')) {
      try {
        await eliminarHorarioDoctor(id);
        await cargarHorarios();
      } catch (err) {
        setError('Error al eliminar el horario');
        console.error('Error:', err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      idDoctor: 0,
      diaSemana: '',
      horaInicio: '',
      horaFin: ''
    });
    setEditingHorario(null);
  };

  const filteredHorarios = horarios.filter(horario =>
    horario.nombreDoctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    horario.diaSemana.toLowerCase().includes(searchTerm.toLowerCase()) ||
    horario.idDoctor.toString().includes(searchTerm)
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64">Cargando horarios...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Horarios de Doctores</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          Nuevo Horario
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
          placeholder="Buscar por doctor o día de la semana..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Tabla de horarios */}
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
                  Día de la Semana
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hora Inicio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hora Fin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duración (min)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky right-0 bg-gray-50">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredHorarios.map((horario) => (
                <tr key={horario.idHorarioDoctor} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {horario.idHorarioDoctor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {horario.nombreDoctor || obtenerNombreDoctor(horario.idDoctor)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {horario.diaSemana}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatearHora(horario.horaInicio)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatearHora(horario.horaFin)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {horario.duracionMinutos}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 sticky right-0 bg-white">
                    <button
                      onClick={() => handleEdit(horario)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(horario.idHorarioDoctor)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredHorarios.length === 0 && (
                <tbody>
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      No se encontraron horarios
                    </td>
                  </tr>
                </tbody>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para crear/editar horario */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Clock size={20} />
                {editingHorario ? 'Editar Horario' : 'Nuevo Horario'}
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
                    disabled={!!editingHorario} // No permitir cambiar doctor al editar
                    placeholder="Ingrese el ID del doctor"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Día de la Semana</label>
                  <select
                    value={formData.diaSemana}
                    onChange={(e) => setFormData({...formData, diaSemana: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar día...</option>
                    {diasSemana.map((dia) => (
                      <option key={dia} value={dia}>
                        {dia}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Hora Inicio *</label>
                    <input
                      type="time"
                      required
                      value={formData.horaInicio}
                      onChange={(e) => setFormData({...formData, horaInicio: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Hora Fin *</label>
                    <input
                      type="time"
                      required
                      value={formData.horaFin}
                      onChange={(e) => setFormData({...formData, horaFin: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
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
                    {editingHorario ? 'Actualizar' : 'Crear'}
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

export default HorariosManagementPage;
