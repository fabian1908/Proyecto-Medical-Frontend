// Función simple para probar Gemini en el navegador
async function testGeminiInBrowser() {
  try {
    // Importar la librería de Gemini
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    
    const genAI = new GoogleGenerativeAI('AIzaSyBdoljmePzbjevt7cnc5XA7RKNNrreJyZQ');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    console.log('🧪 Probando Gemini 1.5 Flash...');
    
    const prompt = 'Hola, ¿puedes ayudarme con una consulta médica básica?';
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Gemini funciona correctamente!');
    console.log('✅ Respuesta:', text);
    
    return { success: true, response: text };
    
  } catch (error) {
    console.error('❌ Error en Gemini:', error);
    return { success: false, error: error.message };
  }
}

// Función para probar en la consola del navegador
window.testGemini = testGeminiInBrowser;

console.log('🔧 Para probar Gemini, ejecuta en la consola: testGemini()');
