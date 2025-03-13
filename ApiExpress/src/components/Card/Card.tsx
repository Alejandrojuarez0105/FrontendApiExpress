import React, { useState } from "react";
import "./Card.css";

interface CardProps {
  title: string;
  description: string;
  direccion: string;
  estrellas: number;
  email: string;
  telefono: string;
  servicios: string[];
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  direccion,
  estrellas,
  email,
  telefono,
  servicios,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className="card">
      <h3 className="card-title">{title}</h3>
      <p className="card-description">{description}</p>
      <p><strong>Dirección:</strong> {direccion}</p>
      <p className="card-estrellas">{"⭐".repeat(estrellas)}</p>

      <button className="card-button" onClick={toggleDetails}>
        {showDetails ? "Cerrar Detalles" : "Detalles"}
      </button>

      {showDetails && (
        <div className="card-overlay" onClick={toggleDetails}>
          <div className="card-modal" onClick={(e) => e.stopPropagation()}>
            <button className="card-close" onClick={toggleDetails}>X</button>
            <h4>{title}</h4>
            <p><strong>Descripción:</strong> {description}</p>
            <p><strong>Dirección:</strong> {direccion}</p>
            <p><strong>Teléfono:</strong> {telefono}</p>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Estrellas:</strong> {"⭐".repeat(estrellas)}</p>
            <p><strong>Servicios:</strong> {servicios.join(", ")}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
