import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { usePayment, PaymentProvider } from '../context/PaymentContext'; // Import PaymentProvider
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles'; // Import the global theme
import Paper from '@mui/material/Paper'; // Ensure Paper is imported
import Chip from '@mui/material/Chip'; // Import Chip
import Button from '@mui/material/Button'; // Import Button
import Modal from '@mui/material/Modal'; // Import Modal
import TextField from '@mui/material/TextField'; // Import TextField for payment input
import { useReservations } from '../context/ReservationContext'; // Import ReservationContext
import { ReservationProvider } from '../context/ReservationContext';
import Snackbar from '@mui/material/Snackbar'; // Import Snackbar for notifications
import Alert from '@mui/material/Alert'; // Import Alert for styled notifications

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

function PaymentTable({ filteredPayments, loading, theme }: { filteredPayments: any[]; loading: boolean; theme: any }) {
  const [open, setOpen] = useState(false); // State to control modal visibility
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State to control notification visibility
  const [selectedReservation, setSelectedReservation] = useState<string | null>(null); // Selected reservation ID
  const { reservations, setReservations, refreshReservations } = useReservations(); // Include refreshReservations

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handlePay = async () => {
    if (selectedReservation) {
      console.log('Selected reservation ID:', selectedReservation);

      // Update the reservation's estado to "confirmada"
      setReservations((prevReservations) => {
        const updatedReservations = prevReservations.map((res) => {
          if (res._id === selectedReservation) {
            console.log('Updating reservation:', res);
            return { ...res, estado: 'confirmada' };
          }
          return res;
        });
        console.log('Updated reservations:', updatedReservations);
        return updatedReservations;
      });

      // Refresh reservations to ensure UI reflects changes
      await refreshReservations();

      // Show success notification
      setSnackbarOpen(true);

      // Close the modal
      handleClose();
    } else {
      console.log('No reservation selected for payment.');
    }
  };

  const pendingReservations = reservations.filter((res) => res.estado === 'pendiente'); // Filter pending reservations
  console.log('Pending reservations:', pendingReservations);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'hotel_name', headerName: 'Hotel', width: 200 }, // Use hotel_name field
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
      ), // Use Chip to display status
    },
  ];

  return (
    <Box
      sx={{
        width: '100%',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column', // Stack elements vertically
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
              justifyContent: 'flex-end', // Align buttons to the right
              gap: theme.spacing(2), // Add spacing between buttons
              marginTop: theme.spacing(4), // Add spacing between DataGrid and buttons
            }}
          >
            <Button variant="contained" color="primary" onClick={handleOpen}>
              Realizar Pago
            </Button>
            <Button variant="outlined" color="primary">
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
              Seleccione una reserva
            </option>
            {pendingReservations.map((res) => (
              <option key={res._id} value={res._id}>
                {res.hotel.nombre} - ${res.precio_total}
              </option>
            ))}
          </TextField>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePay}
            disabled={!selectedReservation}
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

function DataGridDemo() {
  const theme = useTheme(); // Use the global theme
  const { payments, fetchPayments, loading } = usePayment(); // Use PaymentContext
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
      <PaymentTable filteredPayments={filteredPayments} loading={loading} theme={theme} />
    </Box>
  );
}

export default function Payment() {
  return (
    <PaymentProvider>
      <ReservationProvider> {/* Wrap with ReservationProvider */}
        <DataGridDemo />
      </ReservationProvider>
    </PaymentProvider>
  );
}
