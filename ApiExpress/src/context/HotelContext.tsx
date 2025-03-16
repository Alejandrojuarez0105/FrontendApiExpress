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
export interface TipoHabitacion {
  _id: string;
  tipo: string;
  capacidad: number;
  precio: number;
  descripcion?: string;
}

// Definimos la interfaz para el contexto
interface HotelContextType {
  hotels: Hotel[];
  tiposHabitacion: TipoHabitacion[];
  loading: boolean;
  error: string | null;
  fetchHotels: () => Promise<void>;
  fetchTiposHabitacion: () => Promise<void>;
}

// Creamos el contexto
const HotelContext = createContext<HotelContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export const useHotels = () => {
  const context = useContext(HotelContext);
  if (context === undefined) {
    throw new Error('useHotels debe ser usado dentro de un HotelProvider');
  }
  return context;
};

// Props para el proveedor del contexto
interface HotelProviderProps {
  children: ReactNode;
}

// Componente proveedor del contexto
export const HotelProvider: React.FC<HotelProviderProps> = ({ children }) => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [tiposHabitacion, setTiposHabitacion] = useState<TipoHabitacion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener los hoteles desde el backend
  const fetchHotels = async () => {
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
      setHotels(data);
    } catch (err) {
      console.error('Error al obtener hoteles:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido al obtener hoteles');
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener los tipos de habitación desde el backend
  const fetchTiposHabitacion = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/api/habitaciones/', {
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
    fetchHotels();
  }, []);

  // Valor del contexto
  const value = {
    hotels,
    tiposHabitacion,
    loading,
    error,
    fetchHotels,
    fetchTiposHabitacion
  };

  return <HotelContext.Provider value={value}>{children}</HotelContext.Provider>;
};

export default HotelContext; 