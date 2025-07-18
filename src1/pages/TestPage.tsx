import { useState } from 'react';
import apiClient from '../api/axiosConfig';

const TestPage = () => {
  const [result, setResult] = useState('');

  const testGet = async () => {
    try {
      const response = await apiClient.get('/api/usuarios');
      setResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      setResult('Error: ' + error.message);
    }
  };

  const testPost = async () => {
    try {
      const response = await apiClient.post('/api/usuarios/filter', {
        usuario: 'admin@gmail.com',
        contrasenia: 'admin'
      });
      setResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      setResult('Error: ' + error.message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Test API</h2>
      <button onClick={testGet}>Test GET /api/usuarios</button>
      <button onClick={testPost} style={{ marginLeft: '10px' }}>Test POST /api/usuarios/filter</button>
      <pre style={{ background: '#f0f0f0', padding: '10px', marginTop: '20px' }}>
        {result}
      </pre>
    </div>
  );
};

export default TestPage;
