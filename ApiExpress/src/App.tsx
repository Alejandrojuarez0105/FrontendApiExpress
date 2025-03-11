import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Configuraciones from './components/Configuraciones';
import Hoteles from './components/Hoteles';
import LoginForm from './components/LoginForm';
import Reservas from './components/Reservas';
import UsuarioTest from './components/UsuarioTest';

const App: React.FC = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/usuario_test" element={<UsuarioTest />} />
        <Route path="/reservas" element={<Reservas />} />
        <Route path="/hoteles" element={<Hoteles />} />
        <Route path="/configuraciones" element={<Configuraciones />} />
      </Routes>
    </div>
  );
};

export default App;
