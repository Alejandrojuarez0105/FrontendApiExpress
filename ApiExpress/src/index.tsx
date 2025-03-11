import React from 'react';
import ReactDOM from 'react-dom/client'; // Importar el nuevo paquete
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/App.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement // Asegúrate de que 'root' sea de tipo HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);