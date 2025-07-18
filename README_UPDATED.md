# 🏥 Habimed - Plataforma de Servicios Médicos

## 🚀 Funcionalidades Implementadas

### ✅ **Chatbot con Gemini AI**
- **API Key configurada**: `AIzaSyBdoljmePzbjevt7cnc5XA7RKNNrreJyZQ`
- **Modelo**: Gemini Pro
- **Funcionalidades**:
  - Consultas médicas inteligentes
  - Recomendaciones de especialistas
  - Respuestas contextualizadas para salud
  - Búsqueda automática de doctores
  - Fallback en caso de error de API

### ✅ **Google Maps Integrado**
- **API Key configurada**: `AIzaSyAqBeFYbKxcWqBlDBbosaZ7w6xRChxcuZY`
- **Funcionalidades**:
  - Mapa interactivo de Lima
  - Marcadores de consultorios médicos
  - Info windows con información de doctores
  - Integración con resultados de búsqueda
  - Coordenadas preconfiguradas

### 🗺️ **Ubicaciones Incluidas**
- **Lima Centro**: -12.0464, -77.0428
- **Miraflores**: -12.1196, -77.0365
- **San Isidro**: -12.0954, -77.0364
- **Surquillo**: -12.0464, -77.0428
- **San Borja**: -12.0954, -77.0364

## 🛠️ **Instalación y Uso**

### 1. Instalar dependencias
```bash
npm install
```

### 2. Ejecutar el servidor
```bash
npm run dev
```

### 3. Abrir la aplicación
- **URL**: http://localhost:5174/
- **Servicios médicos**: http://localhost:5174/servicios-medicos

## 📋 **Cómo usar la funcionalidad de IA**

### 1. Navegar a Servicios Médicos
- Ir a la página principal
- Clic en "Servicios Médicos" en el navbar

### 2. Activar la búsqueda con IA
- Clic en el botón "Buscar con IA" (azul)
- Se abrirá la interfaz de 3 columnas

### 3. Usar el chatbot
- Escribir consultas como:
  - "Necesito un cardiólogo en Lima"
  - "Tengo dolor de cabeza, ¿qué especialista necesito?"
  - "Busco dermatólogo en Miraflores"
  - "¿Cuándo debo ir al médico por fiebre?"

### 4. Ver resultados
- **Mapa** (izquierda): Muestra ubicaciones de doctores
- **Chat** (centro): Conversación con Gemini AI
- **Resultados** (derecha): Lista de especialistas encontrados

## 🔧 **Archivos de Configuración**

### `src/config/apiConfig.ts`
```typescript
export const API_KEYS = {
  GEMINI_API_KEY: "AIzaSyBdoljmePzbjevt7cnc5XA7RKNNrreJyZQ",
  GOOGLE_MAPS_API_KEY: "AIzaSyAqBeFYbKxcWqBlDBbosaZ7w6xRChxcuZY"
};
```

### APIs requeridas en Google Cloud Console
1. **Maps JavaScript API** ✅
2. **Places API** (opcional)
3. **Geocoding API** (opcional)

## 🧪 **Testing**

### Test del mapa
- Abrir: http://localhost:5174/test-maps.html
- Verifica que el mapa cargue correctamente

### Test del chatbot
- Ejecutar: `node test-gemini.js`
- Verifica que Gemini responda correctamente

## 📁 **Estructura del Proyecto**

```
src/
├── components/
│   ├── AISearchInterface.tsx    # Interfaz principal de IA
│   ├── GoogleMap.tsx           # Componente del mapa
│   └── ...
├── config/
│   └── apiConfig.ts            # Configuración de APIs
├── pages/
│   └── MedicalServicesPage.tsx # Página de servicios médicos
└── types/
    └── google-maps.d.ts        # Tipos para Google Maps
```

## 🎯 **Próximas Mejoras**

- [ ] Integración con base de datos real
- [ ] Autenticación de usuarios
- [ ] Sistema de citas online
- [ ] Notificaciones push
- [ ] Pagos integrados
- [ ] Historial médico
- [ ] Recetas digitales

## 📱 **Tecnologías Utilizadas**

- **Frontend**: React + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **AI**: Google Gemini Pro
- **Maps**: Google Maps JavaScript API
- **HTTP Client**: Fetch API

## ⚠️ **Notas Importantes**

1. **API Keys**: Están configuradas y funcionando
2. **Seguridad**: En producción, usar variables de entorno
3. **Límites**: Gemini y Maps tienen límites de uso gratuito
4. **Navegadores**: Probado en Chrome, Firefox, Safari

## 🆘 **Soporte**

Si tienes problemas:
1. Verifica que las APIs estén habilitadas en Google Cloud
2. Revisa la consola del navegador por errores
3. Comprueba que las API keys sean correctas
4. Asegúrate de que el servidor esté ejecutándose

---

**Estado del proyecto**: ✅ **Funcional y listo para usar**
