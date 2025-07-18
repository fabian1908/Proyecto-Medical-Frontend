import React, { useState, useRef, useEffect } from 'react';
import { X, Send, MapPin, Bot, User } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface AISearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AISearchModal: React.FC<AISearchModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "¡Hola! Soy tu asistente de IA para búsquedas médicas. ¿Cómo puedo ayudarte a encontrar el especialista perfecto para ti?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simular respuesta de IA
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        text: generateAIResponse(inputMessage),
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      
      // Simular resultados de búsqueda
      setSearchResults([
        {
          id: 1,
          name: "Dr. Carlos Mendoza",
          specialty: "Cardiología",
          rating: 4.8,
          location: "San Isidro",
          price: "S/ 150",
          availability: "Disponible hoy"
        },
        {
          id: 2,
          name: "Dra. Ana López",
          specialty: "Cardiología",
          rating: 4.9,
          location: "Miraflores",
          price: "S/ 180",
          availability: "Mañana 10:00 AM"
        }
      ]);

      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    // Respuestas simuladas basadas en palabras clave
    const input = userInput.toLowerCase();
    
    if (input.includes('corazón') || input.includes('cardio')) {
      return "He encontrado varios cardiólogos excelentes en tu área. Te recomiendo especialistas con alta calificación que pueden ayudarte con problemas cardíacos. ¿Te gustaría que busque disponibilidad para esta semana?";
    } else if (input.includes('dolor') || input.includes('espalda')) {
      return "Para dolor de espalda, te recomiendo consultar con un traumatólogo o fisioterapeuta. He encontrado varios especialistas disponibles. ¿Prefieres consulta presencial o virtual?";
    } else if (input.includes('piel') || input.includes('dermatólogo')) {
      return "Los dermatólogos son ideales para problemas de piel. He encontrado varios especialistas con excelentes reseñas. ¿Hay algún síntoma específico que te preocupe?";
    } else {
      return "Entiendo tu consulta. He buscado en nuestra base de datos y encontré varios especialistas que podrían ayudarte. Los resultados aparecen en el panel lateral. ¿Te gustaría más información sobre alguno en particular?";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl h-5/6 flex">
        {/* Header */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        {/* Mapa (lado izquierdo) */}
        <div className="w-1/3 bg-gray-100 p-4 relative">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MapPin size={20} />
            Mapa de Especialistas
          </h3>
          <div className="h-full bg-gray-200 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-600">
              <MapPin size={48} className="mx-auto mb-2 opacity-50" />
              <p>Mapa interactivo</p>
              <p className="text-sm">Próximamente disponible</p>
            </div>
          </div>
        </div>

        {/* Chat (centro) */}
        <div className="w-1/3 flex flex-col border-x border-gray-200">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Bot size={20} className="text-blue-600" />
              Asistente de IA Médica
            </h3>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu consulta médica..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Resultados de búsqueda (lado derecho) */}
        <div className="w-1/3 p-4">
          <h3 className="text-lg font-semibold mb-4">
            Resultados de Búsqueda
          </h3>
          
          {searchResults.length > 0 ? (
            <div className="space-y-4">
              {searchResults.map((result) => (
                <div key={result.id} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900">{result.name}</h4>
                  <p className="text-sm text-blue-600 mb-2">{result.specialty}</p>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`text-sm ${
                            i < Math.floor(result.rating) ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">{result.rating}</span>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    <MapPin size={14} className="inline mr-1" />
                    {result.location}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-green-600">{result.price}</span>
                    <span className="text-xs text-gray-500">{result.availability}</span>
                  </div>
                  
                  <button className="w-full mt-3 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                    Ver perfil
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-8">
              <Bot size={48} className="mx-auto mb-4 opacity-50" />
              <p>Los resultados de búsqueda aparecerán aquí</p>
              <p className="text-sm">después de hacer una consulta</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AISearchModal;
