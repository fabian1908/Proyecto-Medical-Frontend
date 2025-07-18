import React, { useState, useRef, useEffect } from 'react';
import { Send, MapPin, Bot, User, ArrowLeft, Loader2, Upload, Image, X } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { API_KEYS, MAP_CONFIG } from '../config/apiConfig';
import GoogleMap from './GoogleMap';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface AISearchInterfaceProps {
  onBackToServices: () => void;
}

const AISearchInterface: React.FC<AISearchInterfaceProps> = ({ onBackToServices }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "¡Hola! Soy tu asistente de IA para búsquedas médicas. ¿Cómo puedo ayudarte a encontrar el especialista perfecto para ti? También puedes subir una imagen de un examen médico para que te ayude a identificar la especialidad necesaria.",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [lastFailedMessage, setLastFailedMessage] = useState<string>('');
  const [showRetryButton, setShowRetryButton] = useState(false);
  const [aiStatus, setAiStatus] = useState<'connected' | 'disconnected' | 'testing'>('connected');
  const [retryCount, setRetryCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Probar conectividad de IA al cargar
  useEffect(() => {
    testAIConnectivity();
  }, []);

  // Función para manejar subida de imágenes
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  // Función para convertir archivo a base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String.split(',')[1]);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Función para analizar imagen con Gemini
  const analyzeImage = async (imageBase64: string, userPrompt: string): Promise<string> => {
    try {
      const genAI = new GoogleGenerativeAI(API_KEYS.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const imagePart = {
        inlineData: {
          data: imageBase64,
          mimeType: "image/jpeg"
        }
      };

      const result = await model.generateContent([userPrompt, imagePart]);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error analyzing image:', error);
      return "No pude analizar la imagen. Por favor, describe tus síntomas por texto.";
    }
  };

  // Función para generar resultados basados en especialidad
  const generateSearchResultsBySpecialty = (specialty: string) => {
    const specialtyData = MAP_CONFIG.medicalLocationsBySpecialty[specialty as keyof typeof MAP_CONFIG.medicalLocationsBySpecialty] || MAP_CONFIG.medicalLocationsBySpecialty.general;
    
    const results = specialtyData.map(location => ({
      id: location.id,
      name: location.name,
      specialty: location.specialty,
      rating: location.rating,
      location: location.address,
      price: location.price,
      availability: "Disponible hoy",
      phone: location.phone,
      coordinates: { lat: location.lat, lng: location.lng }
    }));

    setSearchResults(results);
  };

  // Función para detectar especialidad específica en el texto
  const detectSpecialtyFromText = (text: string): string => {
    const lowerText = text.toLowerCase();
    
    // Buscar indicadores específicos de especialidad con mayor precisión
    if (lowerText.includes('especialidad_recomendada:')) {
      const specialtyMatch = lowerText.match(/especialidad_recomendada:\s*([a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+)/);
      if (specialtyMatch) {
        const specialty = specialtyMatch[1].trim().toLowerCase();
        // Mapeo más preciso de especialidades
        if (specialty.includes('cardio')) return 'cardiologia';
        if (specialty.includes('dermato') || specialty.includes('piel')) return 'dermatologia';
        if (specialty.includes('radio') || specialty.includes('rayos')) return 'radiologia';
        if (specialty.includes('oftalmo') || specialty.includes('ojos') || specialty.includes('vista')) return 'oftalmologia';
        if (specialty.includes('neuro') || specialty.includes('cerebro')) return 'neurologia';
        if (specialty.includes('traumato') || specialty.includes('huesos') || specialty.includes('fractura')) return 'traumatologia';
        if (specialty.includes('general') || specialty.includes('medicina general')) return 'general';
        return specialty; // Retornar la especialidad tal como viene
      }
    }
    
    // Buscar menciones directas de especialidades y síntomas
    if (lowerText.includes('cardiólogo') || lowerText.includes('cardiología') || 
        lowerText.includes('corazón') || lowerText.includes('pecho') || 
        lowerText.includes('presión') || lowerText.includes('arritmia')) return 'cardiologia';
    
    if (lowerText.includes('dermatólogo') || lowerText.includes('dermatología') || 
        lowerText.includes('piel') || lowerText.includes('acné') || 
        lowerText.includes('manchas') || lowerText.includes('lunares')) return 'dermatologia';
    
    if (lowerText.includes('radiólogo') || lowerText.includes('radiología') || 
        lowerText.includes('radiografía') || lowerText.includes('rayos x') || 
        lowerText.includes('resonancia') || lowerText.includes('tomografía')) return 'radiologia';
    
    if (lowerText.includes('oftalmólogo') || lowerText.includes('oftalmología') || 
        lowerText.includes('ojos') || lowerText.includes('vista') || 
        lowerText.includes('visión') || lowerText.includes('lentes')) return 'oftalmologia';
    
    if (lowerText.includes('neurólogo') || lowerText.includes('neurología') || 
        lowerText.includes('cerebro') || lowerText.includes('migraña') || 
        lowerText.includes('dolor de cabeza') || lowerText.includes('mareos')) return 'neurologia';
    
    if (lowerText.includes('traumatólogo') || lowerText.includes('traumatología') || 
        lowerText.includes('huesos') || lowerText.includes('fractura') || 
        lowerText.includes('articulaciones') || lowerText.includes('rodilla') || 
        lowerText.includes('espalda') || lowerText.includes('columna')) return 'traumatologia';
    
    return ''; // No se detectó especialidad específica
  };

  // Función para reintentar el último mensaje fallido
  const handleRetryMessage = async () => {
    if (!lastFailedMessage.trim()) return;
    
    setShowRetryButton(false);
    setRetryCount(prev => prev + 1);
    
    // Delay incremental para evitar sobrecargar la API
    const delay = Math.min(1000 * retryCount, 5000); // Máximo 5 segundos
    
    setTimeout(() => {
      setInputMessage(lastFailedMessage);
      handleSendMessage();
    }, delay);
  };

  // Función para probar conectividad de IA
  const testAIConnectivity = async () => {
    setAiStatus('testing');
    
    try {
      const genAI = new GoogleGenerativeAI(API_KEYS.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      await model.generateContent("Test connection");
      setAiStatus('connected');
    } catch (error) {
      setAiStatus('disconnected');
    }
  };

  const handleSendMessage = async () => {
    if ((!inputMessage.trim() && !imageFile) || isLoading) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputMessage || "📎 Imagen médica subida",
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setShowRetryButton(false);
    setAiStatus('testing');

    try {
      let aiResponseText = "";
      let detectedSpecialty = "";

      // Si hay una imagen, usar Gemini Vision
      if (imageFile) {
        const imageBase64 = await fileToBase64(imageFile);
        
        // Crear historial de conversación
        const conversationHistory = messages.map(msg => 
          `${msg.isUser ? 'Usuario' : 'Asistente'}: ${msg.text}`
        ).join('\n');
        
        const prompt = `Analiza esta imagen médica. RESPONDE MUY CORTO Y DIRECTO.

HISTORIAL:
${conversationHistory}

PREGUNTA: ${inputMessage || "Analizar imagen médica"}

REGLAS:
1. Máximo 2-3 oraciones
2. Si puedes identificar la especialidad, hazlo INMEDIATAMENTE
3. Si no es claro, haz UNA pregunta específica
4. No repitas información

Si recomiendas especialidad, termina con: "ESPECIALIDAD_RECOMENDADA: [especialidad]"`;

        aiResponseText = await analyzeImage(imageBase64, prompt);
        detectedSpecialty = detectSpecialtyFromText(aiResponseText);
        
        // Limpiar imagen después del análisis
        setImageFile(null);
      } else {
        // Si no hay imagen, usar Gemini Pro normal con historial
        const genAI = new GoogleGenerativeAI(API_KEYS.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Crear historial de conversación
        const conversationHistory = messages.map(msg => 
          `${msg.isUser ? 'Usuario' : 'Asistente'}: ${msg.text}`
        ).join('\n');

        const medicalContext = `Eres un asistente médico especializado. RESPONDE MUY CORTO Y DIRECTO.

HISTORIAL:
${conversationHistory}

PREGUNTA: ${inputMessage}

REGLAS:
1. Máximo 2-3 oraciones
2. Si hay suficiente información, recomienda especialidad INMEDIATAMENTE
3. Si falta información, haz UNA pregunta específica
4. No repitas información ya dada

ESPECIALIDADES: cardiología, dermatología, radiología, oftalmología, neurología, traumatología, medicina general

Si recomiendas especialidad, termina con: "ESPECIALIDAD_RECOMENDADA: [especialidad]"`;

        const result = await model.generateContent(medicalContext);
        const response = await result.response;
        aiResponseText = response.text();

        // Detectar especialidad solo si se recomienda específicamente
        detectedSpecialty = detectSpecialtyFromText(aiResponseText);
      }

      const aiResponse: Message = {
        id: messages.length + 2,
        text: aiResponseText,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      
      // IA funcionando correctamente
      setAiStatus('connected');
      setRetryCount(0);
      
      // Solo generar resultados de búsqueda si se detectó una especialidad específica
      if (detectedSpecialty && detectedSpecialty !== '') {
        generateSearchResultsBySpecialty(detectedSpecialty);
      } else {
        // Si no hay especialidad detectada, limpiar resultados previos
        setSearchResults([]);
      }
      
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      
      // IA desconectada
      setAiStatus('disconnected');
      
      // Activar botón de reintentar
      setShowRetryButton(true);
      setLastFailedMessage(inputMessage);
      
      // Mensaje de error más específico
      let errorMessage = "Lo siento, tengo problemas técnicos en este momento. ";
      
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          errorMessage += "Hay un problema con la configuración de la API. ";
        } else if (error.message.includes('quota')) {
          errorMessage += "Se ha excedido el límite de uso de la API. ";
        } else if (error.message.includes('overloaded') || error.message.includes('503')) {
          errorMessage += "El servicio de IA está temporalmente sobrecargado. ";
        } else if (error.message.includes('network')) {
          errorMessage += "Hay problemas de conexión. ";
        } else {
          errorMessage += "Error técnico: " + error.message + ". ";
        }
      }
      
      errorMessage += "Puedes usar el botón 'Reintentar' o te ayudo con una búsqueda básica de especialistas.";
      
      const fallbackResponse: Message = {
        id: messages.length + 2,
        text: errorMessage,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, fallbackResponse]);
      generateSearchResultsBySpecialty('general');
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToServices}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
              Volver a Servicios
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-xl font-bold text-gray-900">Búsqueda Inteligente con IA</h1>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="p-4 h-[calc(100vh-100px)] overflow-hidden">
        <div className="grid grid-cols-3 gap-4 h-full">
          {/* Mapa (izquierda) */}
          <div className="bg-white rounded-lg shadow-sm border p-3 h-full overflow-hidden">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <MapPin size={20} />
              Mapa de Especialistas
            </h3>
            <div className="h-[calc(100%-50px)] w-full overflow-hidden">
              <Wrapper apiKey={API_KEYS.GOOGLE_MAPS_API_KEY} render={(status: Status) => {
                if (status === Status.LOADING) {
                  return (
                    <div className="h-full bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-600">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                        <p className="text-sm">Cargando mapa...</p>
                      </div>
                    </div>
                  );
                }
                if (status === Status.FAILURE) {
                  return (
                    <div className="h-full bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-600">
                        <MapPin size={32} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Error al cargar el mapa</p>
                        <p className="text-xs">Verifica la API key</p>
                      </div>
                    </div>
                  );
                }
                return (
                  <GoogleMap
                    locations={searchResults.map(result => ({
                      id: result.id,
                      name: result.name,
                      lat: result.coordinates?.lat || MAP_CONFIG.defaultCenter.lat,
                      lng: result.coordinates?.lng || MAP_CONFIG.defaultCenter.lng,
                      address: result.location,
                      specialty: result.specialty,
                      rating: result.rating
                    }))}
                    onLocationSelect={(location) => {
                      console.log('Ubicación seleccionada:', location);
                    }}
                  />
                );
              }} />
            </div>
          </div>

          {/* Chat (centro) */}
          <div className="bg-white rounded-lg shadow-sm border flex flex-col h-full overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex-shrink-0 h-[80px]">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Bot size={20} className="text-blue-600" />
                  Asistente de IA Médica
                </h3>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    aiStatus === 'connected' ? 'bg-green-500' : 
                    aiStatus === 'testing' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-xs text-gray-500">
                    {aiStatus === 'connected' ? 'IA Conectada' : 
                     aiStatus === 'testing' ? 'Probando...' : 'IA Desconectada'}
                  </span>
                  {aiStatus === 'disconnected' && (
                    <button
                      onClick={testAIConnectivity}
                      className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                    >
                      Probar
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Messages - Con altura fija y scroll */}
            <div className="overflow-y-auto p-4 space-y-4 h-[calc(100%-120px)]">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.isUser
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {!message.isUser && (
                        <Bot size={16} className="text-blue-600 mt-1 flex-shrink-0" />
                      )}
                      {message.isUser && (
                        <User size={16} className="text-white mt-1 flex-shrink-0" />
                      )}
                      <p className="text-sm">{message.text}</p>
                    </div>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* Mensaje de ayuda cuando IA está desconectada */}
              {aiStatus === 'disconnected' && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mx-4">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <Bot size={16} />
                    <span className="text-sm">
                      La IA no está disponible. Puedes buscar por especialidad o probar la conexión.
                    </span>
                  </div>
                </div>
              )}
              
              {/* Botón de reintentar */}
              {showRetryButton && (
                <div className="flex justify-center">
                  <button
                    onClick={handleRetryMessage}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Loader2 size={16} />
                    Reintentar conexión con IA
                  </button>
                </div>
              )}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg px-4 py-2">
                    <div className="flex items-center gap-2">
                      <Bot size={16} className="text-blue-600" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 flex-shrink-0 h-[120px]">
              <div className="flex items-center gap-2">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu consulta médica o sube una imagen..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={2}
                  disabled={isLoading}
                />
                
                {/* Botón de subir imagen */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  title="Subir imagen médica"
                >
                  <Upload size={16} />
                  <span className="hidden sm:inline">Imagen</span>
                </button>
                
                {/* Input oculto para archivos */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                
                <button
                  onClick={handleSendMessage}
                  disabled={(!inputMessage.trim() && !imageFile) || isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                </button>
              </div>
              
              {/* Indicador de tipo de análisis */}
              {imageFile && (
                <div className="flex items-center gap-2 text-sm text-blue-600 mt-2">
                  <Image size={16} />
                  <span>Imagen lista para análisis con Gemini Vision</span>
                  <button
                    onClick={() => {
                      setImageFile(null);
                    }}
                    className="ml-auto text-red-600 hover:text-red-800"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Resultados de búsqueda (derecha) */}
          <div className="bg-white rounded-lg shadow-sm border p-4 h-full overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              Resultados de Búsqueda
            </h3>
            
            {searchResults.length > 0 ? (
              <div className="space-y-3">
                {searchResults.map((result) => (
                  <div key={result.id} className="border rounded-lg p-3 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{result.name}</h4>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm text-gray-600">{result.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{result.specialty}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <MapPin size={14} />
                      <span>{result.location}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-green-600">{result.price}</span>
                      <span className="text-xs text-gray-500">{result.availability}</span>
                    </div>
                    <button className="w-full mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                      Ver perfil completo
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Bot size={48} className="mx-auto mb-4 text-gray-400" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Esperando recomendación
                </h4>
                <p className="text-gray-600 text-sm">
                  La IA analizará tu consulta y te mostrará especialistas cuando identifique la especialidad apropiada.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISearchInterface;
