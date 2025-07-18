import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

// Definir una interfaz para las props del doctor
interface Doctor {
  id: number;
  nombres: string;
  apellidos: string;
  especialidades: string[];
  calificacionMedia: number;
}

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900">{doctor.nombres} {doctor.apellidos}</h3>
        <p className="text-md text-indigo-600 mt-1">{doctor.especialidades.join(', ') || 'Medicina General'}</p>
        <div className="flex items-center mt-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${i < doctor.calificacionMedia ? 'text-yellow-400' : 'text-gray-300'}`}
              fill="currentColor"
            />
          ))}
          <span className="text-gray-600 text-sm ml-2">({doctor.calificacionMedia.toFixed(1)} estrellas)</span>
        </div>
        <div className="mt-6">
          <Link
            to={`/doctors/${doctor.id}`} // La ruta del perfil público del doctor
            className="w-full text-center block px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Ver Perfil y Agendar
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
