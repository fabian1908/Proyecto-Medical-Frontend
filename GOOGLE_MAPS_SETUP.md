# Configuración de Google Maps API

## Pasos para obtener la API Key de Google Maps:

### 1. Crear/Configurar proyecto en Google Cloud Console
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto nuevo o selecciona uno existente
3. Asegúrate de que la facturación esté habilitada (Google Maps requiere una cuenta de facturación)

### 2. Habilitar las APIs necesarias
En la sección "APIs & Services" > "Library", busca y habilita:
- **Maps JavaScript API** (Obligatoria)
- **Places API** (Opcional - para búsquedas de lugares)
- **Geocoding API** (Opcional - para convertir direcciones a coordenadas)

### 3. Crear API Key
1. Ve a "APIs & Services" > "Credentials"
2. Clic en "Create Credentials" > "API Key"
3. Copia la API Key generada
4. (Recomendado) Restringe la API Key por dominio/IP para seguridad

### 4. Configurar en el proyecto
1. Abre `src/config/apiConfig.ts`
2. Reemplaza `YOUR_GOOGLE_MAPS_API_KEY_HERE` con tu API Key real

```typescript
export const API_KEYS = {
  GEMINI_API_KEY: "AIzaSyBdoljmePzbjevt7cnc5XA7RKNNrreJyZQ",
  GOOGLE_MAPS_API_KEY: "TU_API_KEY_AQUI", // ← Reemplaza esto
};
```

### 5. Instalar dependencias adicionales para Google Maps
```bash
npm install @googlemaps/react-wrapper
```

## Ubicaciones de ejemplo incluidas:

El sistema ya incluye coordenadas de ejemplo para Lima:

- **Lima Centro**: -12.0464, -77.0428
- **Miraflores**: -12.1196, -77.0365  
- **San Isidro**: -12.0954, -77.0364
- **Surquillo**: -12.0464, -77.0428
- **San Borja**: -12.0954, -77.0364

## Funcionalidades del mapa:

Una vez configurado, el mapa mostrará:
- ✅ Ubicaciones de consultorios médicos
- ✅ Marcadores interactivos
- ✅ Información de especialistas al hacer clic
- ✅ Zoom automático a resultados de búsqueda
- ✅ Integración con el chatbot de IA

## Estado actual:

- ✅ **Gemini AI Chatbot**: Funcionando con la API key proporcionada
- ⚠️ **Google Maps**: Esperando API key para activar
- ✅ **Coordenadas**: Preparadas para mostrar en el mapa
- ✅ **Resultados de búsqueda**: Integrados con ubicaciones

## Costos aproximados:

- **Maps JavaScript API**: Gratis hasta 28,000 cargas de mapa por mes
- **Places API**: Gratis hasta 17,000 solicitudes por mes
- **Geocoding API**: Gratis hasta 40,000 solicitudes por mes

Para más información: https://cloud.google.com/maps-platform/pricing
