import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useUser } from "./UserContext";

interface Reservation {
  _id: string;
  usuario: {
    _id: string;
    nombre: string;
    email: string;
    telefono: string;
  };
  hotel: {
    _id: string;
    nombre: string;
    direccion: string;
    telefono: string;
  };
  habitacion: {
    _id: string;
    tipo: string;
    capacidad: number;
    precio_por_noche: number;
  };
  fecha_inicio: string;
  fecha_fin: string;
  precio_total: number;
  estado: string;
}

interface ReservationContextType {
  reservations: Reservation[];
  setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
  loading: boolean;
  error: string | null;
  refreshReservations: () => Promise<void>;
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

export const ReservationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  
  // Usar useCallback para memoizar la función fetchReservations
  const fetchReservations = useCallback(async (_id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`http://localhost:3000/api/reservas/usuario/${_id}`);
      
      if (!response.ok) {
        throw new Error("Error al obtener las reservas");
      }

      const data = await response.json();
      setReservations(data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  // Usar useCallback para memoizar la función refreshReservations
  const refreshReservations = useCallback(async () => {
    if (user?._id) {
      await fetchReservations(user._id);
    }
  }, [user?._id, fetchReservations]);

  // Usar efecto con bandera para evitar múltiples llamadas
  useEffect(() => {
    let isMounted = true;
    
    if (user?._id && isMounted) {
      fetchReservations(user._id);
    }
    
    return () => {
      isMounted = false;
    };
  }, [user?._id, fetchReservations]);

  return (
    <ReservationContext.Provider 
      value={{ 
        reservations, 
        setReservations, 
        loading, 
        error,
        refreshReservations 
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
};

export const useReservations = () => {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error("useReservations debe usarse dentro de un ReservationProvider");
  }
  return context;
}; 