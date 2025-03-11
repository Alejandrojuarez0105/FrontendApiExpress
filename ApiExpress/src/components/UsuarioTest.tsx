// src/components/UsuarioTest.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UsuarioTest: React.FC = () => {
  const navigate = useNavigate();
  const [country, setCountry] = useState<string>('');
  const [days, setDays] = useState<number>(0);

  const handleReservation = () => {
    alert(`Reservando en ${country} por ${days} días.`);
  };

  return (
    <div className="usuario-test">
      <h2>Hola, Test</h2> {/* Saludo que aparecerá después de iniciar sesión */}
      <div>
        <button onClick={() => navigate('/reservas')}>Reservas</button>
        <button onClick={() => navigate('/hoteles')}>Hoteles</button>
        <button onClick={() => navigate('/configuraciones')}>Configuración</button>
      </div>
    </div>
  );
};

export default UsuarioTest;
