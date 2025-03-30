import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

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
  reserva_id: Reservation | null; // Cambiado a un objeto o null
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
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:3000/api/pagos');
      if (!response.ok) {
        throw new Error('Error al obtener los pagos');
      }
      const data: Payment[] = await response.json();
      console.log('Payments fetched successfully:', data);
      setPayments(data);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setError('Error al obtener los pagos');
    } finally {
      setLoading(false);
    }
  }, []);

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