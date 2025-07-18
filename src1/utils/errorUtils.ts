// Función utilitaria para obtener mensajes de error más amigables
export interface ErrorInfo {
  title: string;
  message: string;
  suggestion: string;
}

export const getErrorMessage = (error: Error): ErrorInfo => {
  const errorMessage = error.message.toLowerCase();
  
  if (errorMessage.includes('overloaded') || errorMessage.includes('503')) {
    return {
      title: "🚦 Servidor Ocupado",
      message: "El servicio de IA está temporalmente sobrecargado. Esto es normal y se resolverá en unos minutos.",
      suggestion: "Puedes intentar nuevamente en unos segundos o buscar por especialidad mientras tanto."
    };
  }
  
  if (errorMessage.includes('api key') || errorMessage.includes('401')) {
    return {
      title: "🔑 Problema de Autenticación",
      message: "Hay un problema con la configuración de la API.",
      suggestion: "Contacta al administrador del sistema."
    };
  }
  
  if (errorMessage.includes('quota') || errorMessage.includes('429')) {
    return {
      title: "📊 Límite Alcanzado",
      message: "Se ha excedido el límite de uso de la API por hoy.",
      suggestion: "Intenta mañana o busca por especialidad."
    };
  }
  
  if (errorMessage.includes('network') || errorMessage.includes('timeout')) {
    return {
      title: "🌐 Problema de Conexión",
      message: "Hay problemas de conectividad con el servidor.",
      suggestion: "Verifica tu conexión a internet e intenta nuevamente."
    };
  }
  
  return {
    title: "⚠️ Error Técnico",
    message: "Ocurrió un problema técnico inesperado.",
    suggestion: "Puedes intentar nuevamente o buscar por especialidad."
  };
};
