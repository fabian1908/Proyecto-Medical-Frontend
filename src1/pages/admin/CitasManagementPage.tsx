import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Calendar } from 'lucide-react';
import { CitaResponseDto, CitaInsertDto, CitaUpdateDto, EstadoCitaEnum } from '../../interfaces/cita';
import { PersonaResponseDto } from '../../interfaces/persona';
import { ConsultorioServicioUResponseDto } from '../../interfaces/consultorioServicioU';
import { 
  obtenerTodasLasCitas, 
  crearCita, 
  actualizarCita, 
  eliminarCita 
} from '../../api/cita';
import { obtenerTodasLasPersonas } from '../../api/persona';
import { obtenerTodosLosConsultorioServicioU } from '../../api/consultorioServicioU';

const CitasManagementPage: React.FC = () => {
  const [citas, setCitas] = useState<CitaResponseDto[]>([]);
  const [personas, setPersonas] = useState<PersonaResponseDto[]>([]);
  const [consultoriosServicios, setConsultoriosServicios] = useState<ConsultorioServicioUResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCita, setEditingCita] = useState<CitaResponseDto | null>(null);
  const [formData, setFormData] = useState<CitaInsertDto>({
    idPaciente: 0,
    idConsultorioServicioU: 0,
    motivo: '',
    fechaHoraInicio: '',
    fechaHoraFin: '',
    estado: EstadoCitaEnum.SOLICITADA,
    descripcion: ''
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [citasData, personasData, consultoriosServiciosData] = await Promise.all([
        obtenerTodasLasCitas(),
        obtenerTodasLasPersonas(),
        obtenerTodosLosConsultorioServicioU()
      ]);
      setCitas(citasData);
      setPersonas(personasData);
      setConsultoriosServicios(consultoriosServiciosData);
      setError(null);
    } catch (err) {
      setError('Error al cargar los datos');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const obtenerNombrePaciente = (idPaciente: number) => {
    const persona = personas.find(p => p.id === idPaciente);
    return persona ? `${persona.nombres} ${persona.apellidos}` : 'Paciente no encontrado';
  };

  const formatearFecha = (fechaString: string) => {
    return new Date(fechaString).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatearFechaParaInput = (fechaString: string) => {
    const fecha = new Date(fechaString);
    return fecha.toISOString().slice(0, 16);
  };

  const getEstadoColor = (estado: EstadoCitaEnum) => {
    const colors = {
      [EstadoCitaEnum.SOLICITADA]: 'bg-yellow-100 text-yellow-800',
      [EstadoCitaEnum.ACEPTADA]: 'bg-blue-100 text-blue-800',
      [EstadoCitaEnum.PAGADA]: 'bg-green-100 text-green-800',
      [EstadoCitaEnum.MODIFICADA]: 'bg-purple-100 text-purple-800',
      [EstadoCitaEnum.REALIZADA]: 'bg-gray-100 text-gray-800',
      [EstadoCitaEnum.CANCELADA]: 'bg-red-100 text-red-800'
    };
    return colors[estado] || 'bg-gray-100 text-gray-800';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCita) {
        const updateData: CitaUpdateDto = {
          motivo: formData.motivo,
          fechaHoraInicio: formData.fechaHoraInicio,
          fechaHoraFin: formData.fechaHoraFin,
          estado: formData.estado,
          descripcion: formData.descripcion
        };
        await actualizarCita(editingCita.idCita, updateData);
      } else {
        await crearCita(formData);
      }
      
      await cargarDatos();
      setShowModal(false);
      resetForm();
    } catch (err) {
      setError('Error al guardar la cita');
      console.error('Error:', err);
    }
  };

  const handleEdit = (cita: CitaResponseDto) => {
    setEditingCita(cita);
    setFormData({
      idPaciente: cita.idPaciente,
      idConsultorioServicioU: cita.idConsultorioServicioU,
      motivo: cita.motivo,
      fechaHoraInicio: formatearFechaParaInput(cita.fechaHoraInicio),
      fechaHoraFin: formatearFechaParaInput(cita.fechaHoraFin),
      estado: cita.estado,
      descripcion: cita.descripcion
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta cita?')) {
      try {
        await eliminarCita(id);
        await cargarDatos();
      } catch (err) {
        setError('Error al eliminar la cita');
        console.error('Error:', err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      idPaciente: 0,
      idConsultorioServicioU: 0,
      motivo: '',
      fechaHoraInicio: '',
      fechaHoraFin: '',
      estado: EstadoCitaEnum.SOLICITADA,
      descripcion: ''
    });
    setEditingCita(null);
  };

  const filteredCitas = citas.filter(cita =>
    cita.motivo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    obtenerNombrePaciente(cita.idPaciente).toLowerCase().includes(searchTerm.toLowerCase()) ||
    cita.estado.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64">Cargando citas...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Citas</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          Nueva Cita
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
          placeholder="Buscar por motivo, paciente o estado..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Tabla de citas */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paciente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Motivo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Inicio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
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
              {filteredCitas.map((cita) => (
                <tr key={cita.idCita} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cita.idCita}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {obtenerNombrePaciente(cita.idPaciente)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {cita.motivo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatearFecha(cita.fechaHoraInicio)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(cita.estado)}`}>
                      {cita.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {cita.descripcion || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 sticky right-0 bg-white">
                    <button
                      onClick={() => handleEdit(cita)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(cita.idCita)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredCitas.length === 0 && (
                <tbody>
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      No se encontraron citas
                    </td>
                  </tr>
                </tbody>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para crear/editar cita */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-[500px] shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Calendar size={20} />
                {editingCita ? 'Editar Cita' : 'Nueva Cita'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Paciente *</label>
                  <select
                    required
                    value={formData.idPaciente}
                    onChange={(e) => setFormData({...formData, idPaciente: parseInt(e.target.value)})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={0}>Seleccionar paciente...</option>
                    {personas.map((persona) => (
                      <option key={persona.id} value={persona.id}>
                        {persona.nombres} {persona.apellidos} - {persona.dni}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Consultorio-Servicio *</label>
                  <select
                    required
                    value={formData.idConsultorioServicioU}
                    onChange={(e) => setFormData({...formData, idConsultorioServicioU: parseInt(e.target.value)})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={0}>Seleccionar consultorio-servicio...</option>
                    {consultoriosServicios.map((cs) => (
                      <option key={cs.idConsultorioServicioU} value={cs.idConsultorioServicioU}>
                        ID: {cs.idConsultorioServicioU} (Usuario: {cs.idUsuario}, Consultorio: {cs.idConsultorio}, Servicio: {cs.idServicio})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Motivo *</label>
                  <input
                    type="text"
                    required
                    value={formData.motivo}
                    onChange={(e) => setFormData({...formData, motivo: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha y Hora Inicio *</label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.fechaHoraInicio}
                      onChange={(e) => setFormData({...formData, fechaHoraInicio: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha y Hora Fin *</label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.fechaHoraFin}
                      onChange={(e) => setFormData({...formData, fechaHoraFin: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Estado *</label>
                  <select
                    required
                    value={formData.estado}
                    onChange={(e) => setFormData({...formData, estado: e.target.value as EstadoCitaEnum})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.values(EstadoCitaEnum).map((estado) => (
                      <option key={estado} value={estado}>
                        {estado}
                      </option>
                    ))}
                  </select>
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
                    {editingCita ? 'Actualizar' : 'Crear'}
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

export default CitasManagementPage;
