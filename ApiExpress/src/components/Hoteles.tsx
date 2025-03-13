import React, { useEffect, useState } from 'react';
import Card from './Card/Card';

interface Hotel {
  _id: string;
  nombre: string;
  descripcion: string;
  direccion: string;
  telefono: string;
  email: string;
  servicios: string[];
  estrellas: number;
}

const Hoteles: React.FC = () => {
  const [hoteles, setHoteles] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/hoteles')
      .then((response) => response.json())
      .then((data) => {
        setHoteles(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Hubo un problema al cargar los datos.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p>Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-5">Lista de Hoteles</h2>

      {hoteles.length > 0 ? (
        <div className="row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-3 g-4 mb-5">
          {hoteles.map((hotel) => (
            <div key={hotel._id} className="d-flex justify-content-center col mt-0 h-100">
              <Card
                title={hotel.nombre}
                description={hotel.descripcion}
                direccion={hotel.direccion}
                estrellas={hotel.estrellas}
                email={hotel.email}
                telefono={hotel.telefono}
                servicios={hotel.servicios}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">No se encontraron hoteles</div>
      )}
    </div>
  );
};

export default Hoteles;
