import React, { useEffect } from 'react';
import { usePayment } from '../context/PaymentContext';

const TestPaymentContext: React.FC = () => {
  const { payments, loading, error, fetchPayments } = usePayment();

  useEffect(() => {
    fetchPayments(); // Llama a fetchPayments una sola vez al montar el componente
  }, [fetchPayments]); // Ahora fetchPayments tiene una referencia estable

  if (loading) {
    return <div>Cargando pagos...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ color: 'black' }}>
      <h1 style={{ color: 'blue' }}>Prueba del Contexto de Pagos</h1>
      <h1>Pagos</h1>
      {payments.length === 0 ? (
        <p>No hay pagos disponibles.</p>
      ) : (
        <ul>
          {payments.map((payment) => (
            <li key={payment._id}>
              <strong>ID:</strong> {payment._id} | <strong>Monto:</strong> {payment.monto} | <strong>Método:</strong> {payment.metodo_pago}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TestPaymentContext;