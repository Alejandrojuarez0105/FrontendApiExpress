import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Definimos la interfaz para un hotel
export interface Hotel {
  _id: string;
  nombre: string;
  direccion: string;
  descripcion?: string;
  estrellas?: number;
  imagenes?: string[];
  servicios?: string[];
}

// Definimos la interfaz para el tipo de habitación
export interface Room {
  _id: string;
  hotel_id: string;
  tipo: string;
  capacidad: number;
  precio_por_noche: number;
  disponibilidad: boolean;
}

interface RoomContextType {
    rooms: Room[];
    tiposHabitacion: Room[];
    loading: boolean;
    error: string | null;
    fetchRooms: () => Promise<void>;
    fetchHoteles: () => Promise<void>;
  }

// Creamos el contexto
const RoomContext = createContext<RoomContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export const useRooms = () => {
  const context = useContext(RoomContext);
  if (context === undefined) {
    throw new Error('useHotels debe ser usado dentro de un HotelProvider');
  }
  return context;
};

// Props para el proveedor del contexto
interface RoomProviderProps {
  children: ReactNode;
}

// Componente proveedor del contexto
export const RoomProvider: React.FC<RoomProviderProps> = ({ children }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [tiposHabitacion, setTiposHabitacion] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener los cuartos desde el backend
  const fetchRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/api/rooms', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setRooms(data);
    } catch (err) {
      console.error('Error al obtener cuartos:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido al obtener cuartos');
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener los hoteles donde estan ubicados los cuartos desde el backend
  const fetchHoteles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/api/hoteles', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setTiposHabitacion(data);
    } catch (err) {
      console.error('Error al obtener tipos de habitación:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido al obtener tipos de habitación');
    } finally {
      setLoading(false);
    }
  };

  // Cargar hoteles al montar el componente
  useEffect(() => {
    fetchRooms();
    fetchHoteles();
  }, []);

  // Valor del contexto
  const value = {
    rooms,
    tiposHabitacion,
    loading,
    error,
    fetchRooms,
    fetchHoteles
  };

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};

export default RoomContext; 