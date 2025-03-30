import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useUser } from '../context/UserContext'; // Importa el UserContext

export interface Usuario {
  _id: string;
  nombre: string;
  email: string;
  telefono?: string;
}

export interface Reservation {
  _id: string;
  hotel_id: {
    _id: string;
    nombre: string;
  };
  fecha_inicio: string;
  fecha_fin: string;
}

export interface Payment {
  _id: string;
  usuario_id: Usuario; // Relación con el usuario
  reserva_id: Reservation | null;
  monto: number;
  metodo_pago: string;
  fecha_pago: string;
  estado: string;
}

interface PaymentContextType {
  payments: Payment[];
  loading: boolean;
  error: string | null;
  fetchPayments: () => Promise<void>; 
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useUser(); 
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    if (!user || !user._id) {
      console.error("El usuario no está autenticado o no tiene un ID válido");
      setError("El usuario no está autenticado o no tiene un ID válido");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`http://localhost:3000/api/pagos/usuario/${user._id}`);
      if (!response.ok) {
        throw new Error('Error al obtener los pagos');
      }
      const data: Payment[] = await response.json();

      // Map the payments to include the hotel name from the reservation
      const paymentsWithHotel = data.map((payment) => ({
        ...payment,
        hotel_name: payment.reserva_id?.hotel_id.nombre || 'N/A', // Add hotel name or default to 'N/A'
      }));

      console.log('Payments fetched successfully:', paymentsWithHotel);
      setPayments(paymentsWithHotel);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setError('Error al obtener los pagos');
    } finally {
      setLoading(false);
    }
  }, [user]);

  return (
    <PaymentContext.Provider value={{ payments, loading, error, fetchPayments }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};
export default PaymentContext;