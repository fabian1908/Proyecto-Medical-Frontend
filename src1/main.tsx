import React from 'react';
import ReactDOM from 'react-dom/client';
import SimpleApp from './SimpleApp.tsx';
import './index.css';

// Renderizando SimpleApp con enrutamiento básico
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SimpleApp />
  </React.StrictMode>,
)
