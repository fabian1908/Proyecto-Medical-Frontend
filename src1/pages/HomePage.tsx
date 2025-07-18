import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, UserPlus, CalendarSearch } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="text-center">
      {/* Hero Section */}
      <section className="py-20 bg-indigo-600 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Tu Salud, Nuestra Prioridad</h1>
          <p className="text-xl mb-8">Encuentra a los mejores especialistas y agenda tu cita en minutos.</p>
          <Link
            to="/servicios-medicos"
            className="bg-white text-indigo-600 font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition-colors"
          >
            Buscar Servicios Médicos
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12">¿Cómo funciona?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="feature-item">
              <CalendarSearch size={48} className="mx-auto text-indigo-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">1. Busca</h3>
              <p className="text-gray-600">Encuentra especialistas por nombre, especialidad o ubicación.</p>
            </div>
            <div className="feature-item">
              <UserPlus size={48} className="mx-auto text-indigo-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">2. Elige</h3>
              <p className="text-gray-600">Revisa perfiles, calificaciones y servicios de nuestros doctores.</p>
            </div>
            <div className="feature-item">
              <Stethoscope size={48} className="mx-auto text-indigo-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">3. Agenda</h3>
              <p className="text-gray-600">Selecciona un horario y agenda tu cita de forma segura.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action para Doctores */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">¿Eres un Profesional de la Salud?</h2>
          <p className="text-xl mb-8">Únete a nuestra red y llega a miles de pacientes.</p>
          <Link
            to="/doctor-signup" // Ruta para el registro de doctores
            className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-full hover:bg-indigo-700 transition-colors"
          >
            Regístrate como Doctor
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;