import React, { useEffect, useRef } from 'react';
import { API_KEYS, MAP_CONFIG } from '../config/apiConfig';

interface MapLocation {
  id: number;
  name: string;
  lat: number;
  lng: number;
  address: string;
  specialty: string;
  rating: number;
}

interface GoogleMapProps {
  locations: MapLocation[];
  onLocationSelect?: (location: MapLocation) => void;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ locations, onLocationSelect }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    // Verificar si la API key está configurada
    if (API_KEYS.GOOGLE_MAPS_API_KEY === "YOUR_GOOGLE_MAPS_API_KEY_HERE") {
      console.warn("Google Maps API key no configurada. Ver GOOGLE_MAPS_SETUP.md");
      return;
    }

    if (!mapRef.current) return;

    // Inicializar el mapa
    const map = new google.maps.Map(mapRef.current, {
      center: MAP_CONFIG.defaultCenter,
      zoom: MAP_CONFIG.defaultZoom,
      styles: [
        {
          featureType: 'poi.medical',
          stylers: [{ visibility: 'simplified' }]
        }
      ]
    });

    mapInstanceRef.current = map;

    // Limpiar marcadores existentes
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Añadir marcadores para cada ubicación
    locations.forEach(location => {
      const marker = new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: map,
        title: location.name,
        icon: {
          url: 'data:image/svg+xml;base64,' + btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(30, 30)
        }
      });

      // Crear info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-3 max-w-xs">
            <h3 class="font-semibold text-gray-900">${location.name}</h3>
            <p class="text-sm text-blue-600 mb-1">${location.specialty}</p>
            <p class="text-xs text-gray-600 mb-2">${location.address}</p>
            <div class="flex items-center gap-2">
              <div class="flex items-center">
                <span class="text-yellow-400">★</span>
                <span class="text-sm ml-1">${location.rating}</span>
              </div>
              <button 
                onclick="window.selectLocation(${location.id})"
                class="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
              >
                Seleccionar
              </button>
            </div>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      markersRef.current.push(marker);
    });

    // Ajustar el mapa para mostrar todos los marcadores
    if (locations.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      locations.forEach(location => {
        bounds.extend({ lat: location.lat, lng: location.lng });
      });
      map.fitBounds(bounds);
    }

    // Función global para seleccionar ubicación desde el info window
    (window as any).selectLocation = (locationId: number) => {
      const location = locations.find(loc => loc.id === locationId);
      if (location && onLocationSelect) {
        onLocationSelect(location);
      }
    };

    // Cleanup
    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, [locations, onLocationSelect]);

  // Si no hay API key, mostrar mensaje de configuración
  if (API_KEYS.GOOGLE_MAPS_API_KEY === "YOUR_GOOGLE_MAPS_API_KEY_HERE") {
    return (
      <div className="h-full bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-600 p-4">
          <div className="text-4xl mb-2">🗺️</div>
          <h3 className="font-semibold mb-2">Mapa de Google</h3>
          <p className="text-sm mb-2">Para activar el mapa:</p>
          <ol className="text-xs text-left space-y-1">
            <li>1. Obtén una API key de Google Maps</li>
            <li>2. Configúrala en src/config/apiConfig.ts</li>
            <li>3. Ver GOOGLE_MAPS_SETUP.md para detalles</li>
          </ol>
          <div className="mt-3 p-2 bg-blue-50 rounded text-xs">
            <p className="font-medium">Coordenadas listas:</p>
            <p>Lima: -12.0464, -77.0428</p>
            <p>Miraflores: -12.1196, -77.0365</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <div ref={mapRef} className="h-full w-full rounded-lg border border-gray-200" style={{ minHeight: '400px' }} />
    </div>
  );
};

export default GoogleMap;
