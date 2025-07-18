import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { PersonaResponseDto, PersonaInsertDto, PersonaUpdateDto } from '../../interfaces/persona';
import { 
  obtenerTodasLasPersonas, 
  crearPersona, 
  actualizarPersona, 
  eliminarPersona 
} from '../../api/persona';

const PersonasManagementPage: React.FC = () => {
  const [personas, setPersonas] = useState<PersonaResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPersona, setEditingPersona] = useState<PersonaResponseDto | null>(null);
  const [formData, setFormData] = useState<PersonaInsertDto>({
    dni: '',
    nombres: '',
    apellidos: '',
    celular: '',
    direccion: '',
    fechaNacimiento: ''
  });

  useEffect(() => {
    cargarPersonas();
  }, []);

  const cargarPersonas = async () => {
    try {
      setLoading(true);
      const data = await obtenerTodasLasPersonas();
      setPersonas(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las personas');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPersona) {
        const updateData: PersonaUpdateDto = {
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          celular: formData.celular || '',
          direccion: formData.direccion || '',
          fechaNacimiento: formData.fechaNacimiento || ''
        };
        await actualizarPersona(editingPersona.id, updateData);
      } else {
        await crearPersona(formData);
      }
      
      await cargarPersonas();
      setShowModal(false);
      resetForm();
    } catch (err) {
      setError('Error al guardar la persona');
      console.error('Error:', err);
    }
  };

  const handleEdit = (persona: PersonaResponseDto) => {
    setEditingPersona(persona);
    setFormData({
      dni: persona.dni,
      nombres: persona.nombres,
      apellidos: persona.apellidos,
      celular: persona.celular || '',
      direccion: persona.direccion || '',
      fechaNacimiento: persona.fechaNacimiento || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta persona?')) {
      try {
        await eliminarPersona(id);
        await cargarPersonas();
      } catch (err) {
        setError('Error al eliminar la persona');
        console.error('Error:', err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      dni: '',
      nombres: '',
      apellidos: '',
      celular: '',
      direccion: '',
      fechaNacimiento: ''
    });
    setEditingPersona(null);
  };

  const filteredPersonas = personas.filter(persona =>
    persona.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
    persona.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
    persona.dni.includes(searchTerm)
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64">Cargando personas...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Personas</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          Nueva Persona
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
          placeholder="Buscar por nombres, apellidos o DNI..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Tabla de personas */}
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
                  Nombres
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Apellidos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Celular
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dirección
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Nacimiento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky right-0 bg-gray-50">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPersonas.map((persona) => (
                <tr key={persona.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {persona.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {persona.dni}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {persona.nombres}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {persona.apellidos}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {persona.celular || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {persona.direccion || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {persona.fechaNacimiento ? new Date(persona.fechaNacimiento).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 sticky right-0 bg-white">
                    <button
                      onClick={() => handleEdit(persona)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(persona.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredPersonas.length === 0 && (
                <tbody>
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-500">
                      No se encontraron personas
                    </td>
                  </tr>
                </tbody>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para crear/editar persona */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingPersona ? 'Editar Persona' : 'Nueva Persona'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">DNI *</label>
                  <input
                    type="text"
                    required
                    value={formData.dni}
                    onChange={(e) => setFormData({...formData, dni: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!!editingPersona}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombres *</label>
                  <input
                    type="text"
                    required
                    value={formData.nombres}
                    onChange={(e) => setFormData({...formData, nombres: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Apellidos *</label>
                  <input
                    type="text"
                    required
                    value={formData.apellidos}
                    onChange={(e) => setFormData({...formData, apellidos: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Celular</label>
                  <input
                    type="text"
                    value={formData.celular}
                    onChange={(e) => setFormData({...formData, celular: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
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
                  <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
                  <input
                    type="date"
                    value={formData.fechaNacimiento}
                    onChange={(e) => setFormData({...formData, fechaNacimiento: e.target.value})}
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
                    {editingPersona ? 'Actualizar' : 'Crear'}
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

export default PersonasManagementPage;