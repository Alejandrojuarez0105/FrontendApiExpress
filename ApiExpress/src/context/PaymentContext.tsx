import { Payment } from '@mui/icons-material';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export interface Payment {
  _id: string;
  reserva_id: string;
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
  fetchPaymentById: (id: string) => Promise<Payment | null>;
  fetchPaymentsByReservationId: (reservaId: string) => Promise<Payment[] | null>;
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
      const data = await response.json();
      console.log('Payments fetched successfully:', data);
      setPayments(data);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setError('Error al obtener los pagos');
    } finally {
      setLoading(false);
    }
  }, []); // Dependencias vacías porque no depende de nada externo

  const fetchPaymentById = useCallback(async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/pagos/${id}`);
      if (!response.ok) {
        throw new Error('Error al obtener el pago');
      }
      const data = await response.json();
      console.log('Payment by ID fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('Error fetching payment by ID:', error);
      setError('Error al obtener el pago');
      return null;
    }
  }, []);

  const fetchPaymentsByReservationId = useCallback(async (reservaId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/pagos/reserva/${reservaId}`);
      if (!response.ok) {
        throw new Error('Error al obtener los pagos por ID de reserva');
      }
      const data = await response.json();
      console.log('Payments by reservation ID fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('Error fetching payments by reservation ID:', error);
      setError('Error al obtener los pagos por ID de reserva');
      return null;
    }
  }, []);

  return (
    <PaymentContext.Provider value={{ payments, loading, error, fetchPayments, fetchPaymentById, fetchPaymentsByReservationId }}>
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