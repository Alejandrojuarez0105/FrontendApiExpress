import React, { useEffect } from 'react';
import { DataGrid, GridRenderCellParams } from '@mui/x-data-grid';
import { Box, Typography, Chip } from '@mui/material';
import { usePayment } from '../context/PaymentContext';

const Payment: React.FC = () => {
  const { payments, loading, error, fetchPayments } = usePayment();

  useEffect(() => {
    fetchPayments(); // Llama a fetchPayments una sola vez al montar el componente
  }, [fetchPayments]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Typography variant="h6">Cargando pagos...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        padding: 2,
      }}
    >
      <Box sx={{ height: 520, width: '80%' }}>
        <DataGrid
          rows={payments} // Asigna los datos de los pagos
          getRowId={(row) => row._id} // Usa _id como identificador único
          columns={[
            { field: '_id', headerName: 'ID de Pago', width: 150 },
            {
              field: 'hotel_nombre',
              headerName: 'Nombre del Hotel',
              width: 200,
              valueGetter: (params) => {
                if (!params || !params.row) {
                  return 'Sin datos'; // Manejo seguro si params o params.row es undefined
                }
                const reserva = params.row.reserva_id;
                if (!reserva || !reserva.hotel_id) {
                  return 'Sin hotel';
                }
                return reserva.hotel_id.nombre || 'Sin hotel';
              },
            },
            { field: 'fecha_pago', headerName: 'Fecha de Pago', width: 200 },
            { field: 'monto', headerName: 'Monto', width: 150 },
            { field: 'metodo_pago', headerName: 'Método de Pago', width: 200 },
            {
              field: 'estado',
              headerName: 'Estado',
              width: 150,
              renderCell: (params: GridRenderCellParams) => (
                <Chip
                  label={params.value}
                  color={
                    params.value === 'completado'
                      ? 'success'
                      : params.value === 'pendiente'
                      ? 'warning'
                      : 'default'
                  }
                  variant="outlined"
                />
              ),
            },
          ]}
          loading={loading}
          rowHeight={38}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    </Box>
  );
};

export default Payment;