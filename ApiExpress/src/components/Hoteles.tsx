// src/components/Hoteles.tsx
import React, { useState } from 'react';

const Hoteles: React.FC = () => {
  const [country, setCountry] = useState<string>('');
  const [days, setDays] = useState<number>(0);

  const handleReservation = () => {
    alert(`Reservando en ${country} por ${days} días.`);
  };

  return (
    <div>
      <h2>Página de Hoteles</h2>
      <p>Selecciona tu destino y duración para hacer una reserva.</p>
      
      <div>
        <input
          type="text"
          placeholder="País"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
        <input
          type="number"
          placeholder="Días"
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
        />
        <button onClick={handleReservation}>Reservar</button>
      </div>
    </div>
  );
};

export default Hoteles;
