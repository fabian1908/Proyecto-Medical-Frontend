# API Client para Habimed Web Service

Esta carpeta contiene todas las funciones para interactuar con la API del backend de Habimed. Cada entidad tiene su propio archivo con funciones CRUD completas.

## Estructura

```
Api/
├── api.ts                     # Clase principal de API con configuración Axios
├── index.ts                   # Exporta todas las funciones
├── persona.ts                 # Funciones para gestión de personas
├── cita.ts                    # Funciones para gestión de citas
├── diagnostico.ts             # Funciones para gestión de diagnósticos
├── consultorio.ts             # Funciones para gestión de consultorios
├── consultorioServicioU.ts    # Funciones para gestión de consultorio-servicio-usuario
├── detallePago.ts             # Funciones para gestión de detalles de pago
├── especialidad.ts            # Funciones para gestión de especialidades
├── horarioDoctor.ts           # Funciones para gestión de horarios de doctores
├── permisoHistorial.ts        # Funciones para gestión de permisos de historial
├── receta.ts                  # Funciones para gestión de recetas
├── recomendacion.ts           # Funciones para gestión de recomendaciones
├── resenia.ts                 # Funciones para gestión de reseñas
├── servicio.ts                # Funciones para gestión de servicios
└── usuario.ts                 # Funciones para gestión de usuarios
```

## Uso

### Importación

```typescript
// Importar funciones específicas
import { obtenerTodasLasPersonas, crearPersona } from './Api/persona';
import { obtenerTodasLasCitas, actualizarCita } from './Api/cita';

// O importar todo desde el índice
import { 
  obtenerTodasLasPersonas, 
  crearPersona,
  obtenerTodasLasCitas,
  actualizarCita 
} from './Api';
```

### Configuración

La API está configurada para conectarse a `http://localhost:8080` por defecto. Puedes cambiar la URL base configurando la variable de entorno `REACT_APP_API_BASE_URL`.

```bash
# .env
REACT_APP_API_BASE_URL=https://tu-api.com
```

### Funciones Disponibles

Cada entidad tiene las siguientes funciones estándar:

- `obtenerTodos[Entidad]()` - Obtiene todas las instancias
- `obtener[Entidad]Filtradas(filter)` - Obtiene instancias filtradas
- `obtener[Entidad]PorId(id)` - Obtiene una instancia por ID
- `crear[Entidad](data)` - Crea una nueva instancia
- `actualizar[Entidad](id, data)` - Actualiza una instancia existente
- `eliminar[Entidad](id)` - Elimina una instancia

### Ejemplos de Uso

```typescript
// Obtener todas las personas
const personas = await obtenerTodasLasPersonas();

// Crear una nueva persona
const nuevaPersona = await crearPersona({
  dni: "12345678",
  nombres: "Juan",
  apellidos: "Pérez",
  celular: "987654321",
  direccion: "Lima, Perú",
  fechaNacimiento: "1990-01-01"
});

// Filtrar citas por estado
const citasPendientes = await obtenerCitasFiltradas({
  estado: EstadoCitaEnum.SOLICITADA
});

// Actualizar un diagnóstico
const diagnosticoActualizado = await actualizarDiagnostico(1, {
  descripcion: "Nueva descripción del diagnóstico"
});
```

### Manejo de Errores

Todas las funciones manejan errores automáticamente:

- Retornan `null` para errores 404 (no encontrado)
- Propagan otros errores para manejo personalizado
- Incluyen interceptores para manejo global de autenticación

```typescript
try {
  const persona = await obtenerPersonaPorId(999);
  if (persona === null) {
    console.log("Persona no encontrada");
  } else {
    console.log("Persona encontrada:", persona);
  }
} catch (error) {
  console.error("Error al obtener persona:", error);
}
```

### Tipos TypeScript

Todas las funciones están tipadas usando las interfaces definidas en la carpeta `interfase/`. Esto proporciona:

- Autocompletado en el IDE
- Verificación de tipos en tiempo de compilación
- Documentación inline

## Notas Importantes

- La URL base se puede configurar mediante variables de entorno
- Todos los métodos son asíncronos y retornan Promises
- Las funciones incluyen documentación JSDoc completa
- El manejo de errores está estandarizado en todas las funciones
- Las interfaces TypeScript garantizan type safety
