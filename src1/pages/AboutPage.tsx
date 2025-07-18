import aboutImage from '../assets/img/about.jpg';

const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Quiénes Somos</h1>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <img src={aboutImage} alt="Nuestra clínica" className="w-full h-auto rounded-lg mb-6" />
        <div className="prose max-w-none">
          <p>
            Bienvenido a Habimed, tu portal de salud de confianza. Nuestra misión es proporcionar acceso a una atención médica de calidad, conectando a pacientes con los mejores profesionales de la salud de una manera fácil y segura.
          </p>
          <p>
            Creemos en la importancia de la tecnología para mejorar la experiencia del paciente. Por eso, hemos desarrollado una plataforma intuitiva que te permite encontrar especialistas, agendar citas y recibir atención personalizada desde la comodidad de tu hogar.
          </p>
          <h2 className="mt-5 mb-3">Nuestro Equipo</h2>
          <p>
            Contamos con un equipo de médicos altamente calificados en diversas especialidades, comprometidos con tu bienestar. Nuestros profesionales son cuidadosamente seleccionados para garantizar que recibas la mejor atención posible.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
