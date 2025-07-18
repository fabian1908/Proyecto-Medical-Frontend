// Prueba rápida de la API de Gemini
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyBdoljmePzbjevt7cnc5XA7RKNNrreJyZQ';

async function testGeminiAPI() {
  try {
    console.log('🔍 Probando conexión con Gemini API...');
    
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = "Hola, ¿puedes confirmar que estás funcionando correctamente?";
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Respuesta de Gemini:', text);
    console.log('✅ API funcionando correctamente');
    
    return true;
  } catch (error) {
    console.error('❌ Error en Gemini API:', error);
    console.error('❌ Mensaje de error:', error.message);
    return false;
  }
}

// Ejecutar prueba
testGeminiAPI().then(success => {
  if (success) {
    console.log('🎉 Gemini API está funcionando correctamente');
  } else {
    console.log('⚠️  Gemini API no está funcionando');
  }
});
