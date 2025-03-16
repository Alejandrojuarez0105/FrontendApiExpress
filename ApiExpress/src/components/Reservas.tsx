import React from 'react';
import Card from './Card/Card';
import { Container, Grid, Typography, Box, CircularProgress, Alert, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useReservations } from '../context/ReservationContext';

// Esta interfaz se utiliza solo para mapear datos del contexto a nuestro componente Card
interface ReservaCardData {
  _id: string;
  title: string; 
  description: string;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  precio: number;
  numeroPersonas: number;
  hotel: {
    nombre: string;
    direccion: string;
  };
}

const Reservas: React.FC = () => {
  const { reservations, loading, error, refreshReservations } = useReservations();
  const theme = useTheme();

  // Ejecutamos refreshReservations al montar el componente para asegurar datos actualizados
  React.useEffect(() => {
    refreshReservations();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Mapear las reservas del contexto al formato que espera nuestro componente Card
  const mapearReservasParaCard = (): ReservaCardData[] => {
    return reservations.map(reserva => ({
      _id: reserva._id,
      title: `Reserva en ${reserva.hotel.nombre}`,
      description: `${reserva.habitacion.tipo} - ${reserva.habitacion.capacidad} personas`,
      fechaInicio: reserva.fecha_inicio,
      fechaFin: reserva.fecha_fin,
      estado: reserva.estado.charAt(0).toUpperCase() + reserva.estado.slice(1), // Primera letra mayúscula
      precio: reserva.precio_total,
      numeroPersonas: reserva.habitacion.capacidad,
      hotel: {
        nombre: reserva.hotel.nombre,
        direccion: reserva.hotel.direccion
      }
    }));
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh" 
        flexDirection="column" 
        sx={{ backgroundColor: theme.palette.background.default }}
      >
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2, color: theme.palette.text.primary }}>Cargando...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        sx={{ backgroundColor: theme.palette.background.default }}
      >
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const reservasMapeadas = mapearReservasParaCard();

  return (
    <Box 
      sx={{ 
        backgroundColor: theme.palette.background.default, 
        minHeight: '100vh',
        width: '100%',
        pt: 3,
        pb: 5
      }}
    >
      <Container maxWidth="xl" sx={{ mt: 2, mb: 5 }}>
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
                Mis Reservas
            </Typography>
          </Paper>

        {reservasMapeadas.length > 0 ? (
          <Grid container spacing={3}>
            {reservasMapeadas.map((reserva) => (
              <Grid item xs={12} sm={6} md={4} key={reserva._id}>
                <Box sx={{ height: '100%' }}>
                  <Card
                    type="reserva"
                    title={reserva.title}
                    description={reserva.description}
                    fechaInicio={reserva.fechaInicio}
                    fechaFin={reserva.fechaFin}
                    estado={reserva.estado}
                    precio={reserva.precio}
                    numeroPersonas={reserva.numeroPersonas}
                    hotel={{
                      nombre: reserva.hotel.nombre,
                      direccion: reserva.hotel.direccion
                    }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary
            }}
          >
            <Typography variant="h6" align="center">
              No tienes reservas actualmente
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default Reservas;