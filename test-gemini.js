// Test script para verificar Gemini API
const https = require('https');

async function testGeminiAPI() {
    const API_KEY = "AIzaSyBdoljmePzbjevt7cnc5XA7RKNNrreJyZQ";
    
    const postData = JSON.stringify({
        contents: [{
            parts: [{
                text: "Hola, ¿puedes ayudarme con información médica básica?"
            }]
        }]
    });
    
    const options = {
        hostname: 'generativelanguage.googleapis.com',
        port: 443,
        path: `/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };
    
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const responseData = JSON.parse(data);
                    
                    if (res.statusCode === 200) {
                        if (responseData.candidates && responseData.candidates[0] && responseData.candidates[0].content) {
                            console.log("✅ Gemini API funciona correctamente");
                            console.log("✅ Respuesta:", responseData.candidates[0].content.parts[0].text);
                            resolve(true);
                        } else {
                            console.log("❌ Formato de respuesta inesperado:", responseData);
                            resolve(false);
                        }
                    } else {
                        console.log("❌ Error HTTP:", res.statusCode);
                        console.log("❌ Respuesta:", responseData);
                        resolve(false);
                    }
                } catch (error) {
                    console.error("❌ Error al parsear JSON:", error);
                    console.log("❌ Respuesta cruda:", data);
                    resolve(false);
                }
            });
        });
        
        req.on('error', (error) => {
            console.error("❌ Error de red:", error);
            resolve(false);
        });
        
        req.write(postData);
        req.end();
    });
}

// Ejecutar test
console.log("🧪 Probando Gemini API...");
testGeminiAPI().then(success => {
    console.log(success ? "✅ Test completado exitosamente" : "❌ Test falló");
    process.exit(success ? 0 : 1);
});
