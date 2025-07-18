// API Keys configuration
export const API_KEYS = {
  // Gemini API Key para el chatbot
  GEMINI_API_KEY: "AIzaSyBdoljmePzbjevt7cnc5XA7RKNNrreJyZQ",
  
  // Google Maps API Key
  GOOGLE_MAPS_API_KEY: "AIzaSyAqBeFYbKxcWqBlDBbosaZ7w6xRChxcuZY",
  
  // URLs de la API
  GEMINI_API_URL: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
};

// Configuración del mapa
export const MAP_CONFIG = {
  defaultCenter: {
    lat: -12.0464, // Lima, Perú
    lng: -77.0428
  },
  defaultZoom: 12,
  // Ubicaciones de consultorios médicos por especialidad
  medicalLocationsBySpecialty: {
    cardiologia: [
      {
        id: 1,
        name: "Dr. Carlos Mendoza - Cardiólogo",
        lat: -12.0954,
        lng: -77.0364,
        address: "Av. Petit Thouars 4993, San Isidro",
        specialty: "Cardiología",
        rating: 4.8,
        phone: "+51 1 234-5678",
        price: "S/ 150"
      },
      {
        id: 2,
        name: "Dra. Ana López - Cardiología",
        lat: -12.1196,
        lng: -77.0365,
        address: "Av. Larco 1301, Miraflores",
        specialty: "Cardiología",
        rating: 4.9,
        phone: "+51 1 234-5679",
        price: "S/ 180"
      }
    ],
    radiologia: [
      {
        id: 3,
        name: "Centro de Radiología San Isidro",
        lat: -12.0954,
        lng: -77.0364,
        address: "Av. Arequipa 2845, San Isidro",
        specialty: "Radiología",
        rating: 4.7,
        phone: "+51 1 234-5680",
        price: "S/ 120"
      },
      {
        id: 4,
        name: "Dr. Luis Ramírez - Radiología",
        lat: -12.0464,
        lng: -77.0428,
        address: "Av. Grau 13, Cercado de Lima",
        specialty: "Radiología",
        rating: 4.6,
        phone: "+51 1 234-5681",
        price: "S/ 100"
      }
    ],
    dermatologia: [
      {
        id: 5,
        name: "Dra. María García - Dermatóloga",
        lat: -12.1196,
        lng: -77.0365,
        address: "Malecón Balta 956, Miraflores",
        specialty: "Dermatología",
        rating: 4.8,
        phone: "+51 1 234-5682",
        price: "S/ 140"
      }
    ],
    oftalmologia: [
      {
        id: 6,
        name: "Dr. José Pérez - Oftalmólogo",
        lat: -12.0892,
        lng: -77.0508,
        address: "Av. Angamos Este 2520, Surquillo",
        specialty: "Oftalmología",
        rating: 4.9,
        phone: "+51 1 234-5683",
        price: "S/ 130"
      }
    ],
    neurologia: [
      {
        id: 7,
        name: "Dr. Roberto Silva - Neurólogo",
        lat: -12.0954,
        lng: -77.0364,
        address: "Av. Conquistadores 145, San Isidro",
        specialty: "Neurología",
        rating: 4.8,
        phone: "+51 1 234-5684",
        price: "S/ 200"
      }
    ],
    traumatologia: [
      {
        id: 8,
        name: "Dr. Fernando Torres - Traumatólogo",
        lat: -12.0464,
        lng: -77.0428,
        address: "Av. Brasil 600, Breña",
        specialty: "Traumatología",
        rating: 4.7,
        phone: "+51 1 234-5685",
        price: "S/ 160"
      }
    ],
    general: [
      {
        id: 9,
        name: "Dr. Patricia Morales - Medicina General",
        lat: -12.1196,
        lng: -77.0365,
        address: "Av. Pardo 495, Miraflores",
        specialty: "Medicina General",
        rating: 4.6,
        phone: "+51 1 234-5686",
        price: "S/ 80"
      }
    ]
  }
};
