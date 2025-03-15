import React from 'react';
import { useUser } from '../context/UserContext';

const Configuraciones: React.FC = () => {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <p>Cargando datos del usuario...</p>
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow p-4" style={{ width: '400px' }}>
        <h2 className="text-center mb-3">Perfil de Usuario</h2>
        <div className="mb-2"><strong>Nombre:</strong> {user.nombre || 'No disponible'}</div>
        <div className="mb-2"><strong>Email:</strong> {user.email || 'No disponible'}</div>
        <div className="mb-2"><strong>Teléfono:</strong> {user.telefono || 'No disponible'}</div>
        <div className="mb-2"><strong>Usuario:</strong> {user.username || 'No disponible'}</div>
        <div className="mb-2">
          <strong>Reservas:</strong> {Array.isArray(user.historial_reservas) ? user.historial_reservas.length : 0}
        </div>
      </div>
    </div>
  );
};

export default Configuraciones;
