import React from 'react';

const TestApp: React.FC = () => {
  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '600px', 
      margin: '0 auto', 
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#4F46E5' }}>Página de Prueba</h1>
      <p style={{ marginBottom: '1rem' }}>
        Si puedes ver este texto, la aplicación React está funcionando correctamente.
      </p>
      <div style={{ 
        padding: '1rem', 
        backgroundColor: '#F3F4F6', 
        borderRadius: '0.5rem',
        marginBottom: '1rem' 
      }}>
        <p>Esta es una página simple para probar la renderización de React.</p>
      </div>
      <button 
        onClick={() => alert('El botón funciona!')}
        style={{
          backgroundColor: '#4F46E5',
          color: 'white',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '0.25rem',
          cursor: 'pointer'
        }}
      >
        Haz clic aquí
      </button>
    </div>
  );
};

export default TestApp;
