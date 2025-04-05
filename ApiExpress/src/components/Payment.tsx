import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { usePayment, PaymentProvider } from '../context/PaymentContext';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { useReservations, ReservationProvider } from '../context/ReservationContext';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useUser } from '../context/UserContext'; // Ensure useUser is imported
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function SearchBar({ searchText, setSearchText, theme }: { searchText: string; setSearchText: (text: string) => void; theme: any }) {
  return (
    <Box
      sx={{
        width: '100%',
        padding: '10px',
        display: 'flex', // Use flexbox for alignment
        alignItems: 'center', // Center vertically
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Typography
        variant="body1"
        sx={{
          marginRight: theme.spacing(2), // Add spacing between label and input
          color: theme.palette.text.primary,
        }}
      >
        Búsqueda:
      </Typography>
      <input
        type="text"
        placeholder="Search..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{
          padding: '5px',
          width: '50%',
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '4px',
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }}
      />
    </Box>
  );
}

function PaymentTable({
  filteredPayments,
  loading,
  theme,
  navigate, // Accept navigate as a prop
}: {
  filteredPayments: any[];
  loading: boolean;
  theme: any;
  navigate: (path: string) => void; // Define the type for navigate
}) {
  const [open, setOpen] = useState(false); // State to control modal visibility
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State to control notification visibility
  const [selectedReservation, setSelectedReservation] = useState<string | null>(null); // Selected reservation ID
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null); // Selected payment method
  const { reservations, setReservations, refreshReservations } = useReservations(); // Include refreshReservations
  const { user } = useUser(); // Retrieve user context here
  const { fetchPayments, payments } = usePayment(); // Retrieve fetchPayments from PaymentContext

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleGoToReservations = () => {
    navigate('/reservas/mis-reservas'); // Use the custom navigate function
  };

  const handlePay = async () => {
    if (!selectedReservation || !selectedPaymentMethod) {
      console.error('No se ha seleccionado una reserva o un método de pago.');
      return;
    }

    if (!payments || payments.length === 0) {
      console.error('No hay pagos disponibles.');
      return;
    }

    const selectedPayment = payments.find(
      (payment) => String(payment.reserva_id._id) === String(selectedReservation)
    );

    if (!selectedPayment) {
      console.error('No se encontró un pago asociado a la reserva seleccionada.');
      return;
    }

    try {

      if (!user || !user._id) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch(`${API_BASE_URL}/pagos/pagar/${selectedPayment._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metodo_pago: selectedPaymentMethod,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error al confirmar el pago:', errorData.message);
        return;
      }

      const data = await response.json();
      console.log('Pago confirmado:', data);

      await refreshReservations();

      await fetchPayments();

      setSnackbarOpen(true);

      handleClose();

    } catch (error) {
      console.error('Error en la solicitud:', error);
    }

  };

  const pendingReservations = reservations.filter((res) => res.estado === 'pendiente');
  console.log('Pending reservations:', pendingReservations);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'hotel_name', headerName: 'Hotel', width: 200 },
    { field: 'monto', headerName: 'Monto', width: 150 },
    { field: 'metodo_pago', headerName: 'Método de Pago', width: 150 },
    { field: 'fecha_pago', headerName: 'Fecha de Pago', width: 150 },
    {
      field: 'estado',
      headerName: 'Estado',
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'completado' ? 'success' : params.value === 'pendiente' ? 'warning' : 'error'}
          variant="outlined"
        />
      ),
    },
  ];

  return (
    <Box
      sx={{
        width: '100%',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
        color: theme.palette.text.primary,
        padding: theme.spacing(2),
      }}
    >
      {loading ? (
        <Typography variant="body1" color="textSecondary">
          Loading...
        </Typography>
      ) : (
        <>
          <DataGrid
            rows={filteredPayments.map((payment) => ({
              id: payment._id,
              hotel_name: payment.hotel_name, // Map hotel_name to the column
              ...payment,
            }))}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
            sx={{
              width: '100%',
              maxWidth: '1200px',
              backgroundColor: theme.palette.background.default,
              color: theme.palette.text.primary,
            }}
          />
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: theme.spacing(2),
              marginTop: theme.spacing(4),
            }}
          >
            <Button variant="contained" color="primary" onClick={handleOpen}>
              Realizar Pago
            </Button>
            <Button variant="outlined" color="primary" onClick={handleGoToReservations}>
              Ir a mis reservas
            </Button>
          </Box>
        </>
      )}

      {/* Modal for payment */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Realizar Pago
          </Typography>
          <TextField
            select
            label="Seleccionar Reserva"
            value={selectedReservation || ''}
            onChange={(e) => setSelectedReservation(e.target.value)}
            fullWidth
            SelectProps={{
              native: true,
            }}
            sx={{ mb: 2 }}
          >
            <option value="" disabled>
              {pendingReservations.length === 0 ? 'No hay reservas pendientes' : ''}
            </option>
            {pendingReservations.map((res) => (
              <option key={res._id} value={res._id}>
                {res.hotel.nombre} - ${res.precio_total}
              </option>
            ))}
          </TextField>

          {/* Campo para seleccionar el método de pago */}
          <TextField
            select
            label="Método de Pago"
            value={selectedPaymentMethod}
            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
            fullWidth
            SelectProps={{
              native: true,
            }}
            sx={{ mb: 2 }}
          >
            <option value="" disabled>
              Seleccione un método de pago
            </option>
            <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
            <option value="Tarjeta de Débito">Tarjeta de Débito</option>
            <option value="PayPal">PayPal</option>
            <option value="Transferencia Bancaria">Transferencia Bancaria</option>
          </TextField>

          <Button
            variant="contained"
            color="primary"
            onClick={handlePay}
            disabled={!selectedReservation || !selectedPaymentMethod}
            fullWidth
          >
            Pagar
          </Button>
        </Box>
      </Modal>

      {/* Snackbar for success notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Reserva pagada con éxito
        </Alert>
      </Snackbar>
    </Box>
  );
}

function PaymentDataGrid({ navigate }: { navigate: (path: string) => void }) {
  const theme = useTheme(); // Use the global theme
  const { payments, fetchPayments, loading } = usePayment();
  const [filteredPayments, setFilteredPayments] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchPayments(); // Fetch payments on component mount
  }, [fetchPayments]);

  useEffect(() => {
    const lowercasedSearchText = searchText.toLowerCase();
    setFilteredPayments(
      payments.filter((payment) =>
        Object.values(payment).some((value) =>
          String(value).toLowerCase().includes(lowercasedSearchText)
        )
      )
    );
  }, [searchText, payments]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(4),
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 2,
          mb: 4,
          backgroundColor: theme.palette.background.default,
          boxShadow: `0 4px 20px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)`,
          borderRadius: 1
        }}
      >
        <Typography
          variant="h4"
          align="center"
          color="primary"
          sx={{
            fontWeight: 'bold',
            letterSpacing: '0.5px',
            textShadow: '1px 1px 3px rgba(0,0,0,0.3)'
          }}
        >
          Mis Pagos
        </Typography>
      </Paper>
      <SearchBar searchText={searchText} setSearchText={setSearchText} theme={theme} />
      <PaymentTable filteredPayments={filteredPayments} loading={loading} theme={theme} navigate={navigate} />
    </Box>
  );
}

export default function Payment({ navigate }: { navigate: (path: string) => void }) {
  return (
    <PaymentProvider>
      <ReservationProvider>
        <PaymentDataGrid navigate={navigate} />
      </ReservationProvider>
    </PaymentProvider>
  );
}
