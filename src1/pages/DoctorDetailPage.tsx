import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../api/axiosConfig';

// Interfaces (pueden ser movidas a un archivo de tipos más adelante)
interface Persona {
  id: number;
  dni: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
}

// Placeholder para la página
const DoctorDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<Persona | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchDoctorDetails = async () => {
      try {
        setLoading(true);
        // El ID en la ruta corresponde al ID de la persona
        const response = await apiClient.get<Persona>(`/api/personas/${id}`);
        setDoctor(response.data);
      } catch (err) {
        setError('No se pudo cargar la información del doctor.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDetails();
  }, [id]);

  if (loading) return <p className="text-center">Cargando perfil...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!doctor) return <p className="text-center">No se encontró al doctor.</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          {/* Placeholder para la imagen del doctor */}
          <div className="w-32 h-32 bg-gray-300 rounded-full mb-6 md:mb-0 md:mr-8 flex-shrink-0"></div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold">{doctor.nombre} {doctor.apellido}</h1>
            <p className="text-xl text-indigo-600 mt-2">Especialidad (ej. Cardiología)</p>
          </div>
        </div>

        <div className="mt-8 border-t pt-8">
          <h2 className="text-2xl font-bold mb-4">Sobre el Doctor</h2>
          <p className="text-gray-700">
            Aquí va una descripción detallada sobre la experiencia, estudios y filosofía del doctor.
            Este texto es un placeholder.
          </p>
        </div>

        <div className="mt-8 border-t pt-8">
          <h2 className="text-2xl font-bold mb-4">Servicios y Precios</h2>
          {/* Aquí se mapearían los servicios */}
          <ul className="list-disc list-inside">
            <li>Consulta General - $50</li>
            <li>Electrocardiograma - $100</li>
          </ul>
        </div>

        <div className="mt-8 border-t pt-8">
          <h2 className="text-2xl font-bold mb-4">Agendar Cita</h2>
          {/* Aquí iría el componente de calendario/agenda */}
          <p className="text-gray-700">El componente de agenda estará disponible aquí.</p>
          <button className="mt-4 px-6 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
            Agendar Cita
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailPage;