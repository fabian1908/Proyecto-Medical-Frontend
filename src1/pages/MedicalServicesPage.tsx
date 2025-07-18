import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Star, 
  ChevronDown, 
  Filter, 
  Shield, 
  Stethoscope, 
  Bot 
} from 'lucide-react';
import AISearchInterface from '../components/AISearchInterface';

// Interfaces locales
interface Especialidad {
  idEspecialidad: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
  fechaCreacion: Date;
  fechaModificacion: Date;
}

interface Servicio {
  idServicio: number;
  nombre: string;
  descripcion: string;
  precio: number;
  duracion: number;
  tipo: string;
  ubicacion: string;
  disponibilidad?: string;
  calificacion: number;
  numeroResenias: number;
  consultaOnline: boolean;
  activo: boolean;
  fechaCreacion: Date;
  fechaModificacion: Date;
}

const MedicalServicesPage: React.FC = () => {
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [showAISearch, setShowAISearch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [filteredServices, setFilteredServices] = useState<Servicio[]>([]);
  
  const [filters, setFilters] = useState({
    especialidad: '',
    ubicacion: '',
    calificacion: '',
    consultaOnline: false
  });

  // Datos mock para testing
  const mockServicios: Servicio[] = [
    {
      idServicio: 1,
      nombre: "Consulta Cardiológica",
      descripcion: "Evaluación completa del sistema cardiovascular",
      precio: 150,
      duracion: 30,
      tipo: "Presencial",
      ubicacion: "San Isidro",
      disponibilidad: "Mañana, 9:00 AM",
      calificacion: 4.8,
      numeroResenias: 124,
      consultaOnline: true,
      activo: true,
      fechaCreacion: new Date(),
      fechaModificacion: new Date()
    },
    {
      idServicio: 2,
      nombre: "Análisis Clínicos",
      descripcion: "Exámenes de laboratorio completos",
      precio: 80,
      duracion: 15,
      tipo: "Presencial",
      ubicacion: "Miraflores",
      disponibilidad: "Hoy, 2:00 PM",
      calificacion: 4.9,
      numeroResenias: 89,
      consultaOnline: false,
      activo: true,
      fechaCreacion: new Date(),
      fechaModificacion: new Date()
    },
    {
      idServicio: 3,
      nombre: "Teleconsulta Psicológica",
      descripcion: "Sesión de terapia psicológica online",
      precio: 120,
      duracion: 45,
      tipo: "Virtual",
      ubicacion: "Online",
      disponibilidad: "Mañana, 10:30 AM",
      calificacion: 4.7,
      numeroResenias: 67,
      consultaOnline: true,
      activo: true,
      fechaCreacion: new Date(),
      fechaModificacion: new Date()
    }
  ];

  const mockEspecialidades: Especialidad[] = [
    { idEspecialidad: 1, nombre: "Cardiología", descripcion: "Especialidad del corazón", activo: true, fechaCreacion: new Date(), fechaModificacion: new Date() },
    { idEspecialidad: 2, nombre: "Dermatología", descripcion: "Especialidad de la piel", activo: true, fechaCreacion: new Date(), fechaModificacion: new Date() },
    { idEspecialidad: 3, nombre: "Neurología", descripcion: "Especialidad del sistema nervioso", activo: true, fechaCreacion: new Date(), fechaModificacion: new Date() },
    { idEspecialidad: 4, nombre: "Psicología", descripcion: "Salud mental", activo: true, fechaCreacion: new Date(), fechaModificacion: new Date() },
    { idEspecialidad: 5, nombre: "Pediatría", descripcion: "Especialidad infantil", activo: true, fechaCreacion: new Date(), fechaModificacion: new Date() }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Usar datos mock por ahora
      setEspecialidades(mockEspecialidades);
      setServicios(mockServicios);
      setFilteredServices(mockServicios);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    // Apply filters
    let filtered = servicios;
    
    if (filters.especialidad) {
      filtered = filtered.filter(service => 
        service.nombre.toLowerCase().includes(filters.especialidad.toLowerCase())
      );
    }
    
    if (filters.ubicacion) {
      filtered = filtered.filter(service => 
        service.ubicacion.toLowerCase().includes(filters.ubicacion.toLowerCase())
      );
    }
    
    if (filters.consultaOnline) {
      filtered = filtered.filter(service => service.consultaOnline);
    }
    
    if (filters.calificacion) {
      filtered = filtered.filter(service => 
        service.calificacion >= parseFloat(filters.calificacion)
      );
    }
    
    setFilteredServices(filtered);
  }, [filters, servicios]);

  return (
    <>
      {/* Header con filtros - SIEMPRE VISIBLE */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Filtros principales */}
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="relative">
              <button
                onClick={() => updateFilter('consultaOnline', !filters.consultaOnline)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  filters.consultaOnline 
                    ? 'bg-blue-50 border-blue-200 text-blue-700' 
                    : 'bg-white border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Consulta online
                <ChevronDown size={16} />
              </button>
            </div>

            <div className="relative">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 bg-white">
                <Calendar size={16} />
                Fechas disponibles
                <ChevronDown size={16} />
              </button>
            </div>

            <div className="relative">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 bg-white">
                <Shield size={16} />
                Seguros de salud
                <ChevronDown size={16} />
              </button>
            </div>

            <button
              onClick={() => setShowMoreFilters(!showMoreFilters)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 bg-white"
            >
              <Filter size={16} />
              Más filtros
              <ChevronDown size={16} />
            </button>

            <button
              onClick={() => setShowAISearch(!showAISearch)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                showAISearch 
                  ? 'bg-blue-600 border-blue-600 text-white' 
                  : 'border-blue-300 hover:border-blue-400 bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              <Bot size={16} />
              Buscar con IA
            </button>
          </div>

          {/* Filtros adicionales */}
          {showMoreFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Especialidad
                </label>
                <select
                  value={filters.especialidad}
                  onChange={(e) => updateFilter('especialidad', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Todas las especialidades</option>
                  {especialidades.map(esp => (
                    <option key={esp.idEspecialidad} value={esp.nombre}>
                      {esp.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ubicación
                </label>
                <input
                  type="text"
                  value={filters.ubicacion}
                  onChange={(e) => updateFilter('ubicacion', e.target.value)}
                  placeholder="Distrito o zona"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calificación mínima
                </label>
                <select
                  value={filters.calificacion}
                  onChange={(e) => updateFilter('calificacion', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Cualquier calificación</option>
                  <option value="5">5 estrellas</option>
                  <option value="4">4+ estrellas</option>
                  <option value="3">3+ estrellas</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contenido principal */}
      {showAISearch ? (
        <AISearchInterface onBackToServices={() => setShowAISearch(false)} />
      ) : (
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Título de resultados */}
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              {filters.especialidad ? `${filters.especialidad} en ${filters.ubicacion || 'Lima'}` : 'Servicios médicos disponibles'}
            </h1>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Buscando servicios...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((service) => (
                  <div key={service.idServicio} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Stethoscope className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{service.nombre}</h3>
                            <p className="text-sm text-gray-500">{service.tipo}</p>
                          </div>
                        </div>
                        <span className="text-lg font-bold text-gray-900">
                          S/{service.precio}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4">{service.descripcion}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          <span>{service.duracion} min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={16} />
                          <span>{service.ubicacion}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={16} fill="currentColor" />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600 ml-1">
                            {service.calificacion} ({service.numeroResenias} reseñas)
                          </span>
                        </div>
                        
                        {service.consultaOnline && (
                          <div className="flex items-center gap-1 text-green-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm">Online</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                          Agendar cita
                        </button>
                        
                        {service.consultaOnline && (
                          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            Consulta online
                          </button>
                        )}
                      </div>
                      
                      {service.disponibilidad && (
                        <div className="mt-4 p-3 bg-green-50 rounded-lg">
                          <p className="text-sm text-green-800">
                            <strong>Próxima disponibilidad:</strong> {service.disponibilidad}
                          </p>
                          <button className="mt-2 text-sm text-blue-600 hover:text-blue-700">
                            Solicitar calendario
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Paginación */}
            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-2">
                <button className="px-3 py-2 bg-blue-600 text-white rounded">1</button>
                <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded">2</button>
                <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded">3</button>
                <span className="px-2">...</span>
                <button className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded">22</button>
                <button className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded">Siguiente</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MedicalServicesPage;
