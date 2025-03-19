import React, { useEffect, useState } from 'react';
import Card from './Card/Card';
import { Container, Grid, Typography, Box, CircularProgress, Alert, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface Cuarto {
  _id: string;
  hotel_id: string;
  tipo: string;
  capacidad: number;
  precio_por_noche: number;
  disponibilidad: boolean;
}

const Cuartos: React.FC = () => {
  const [cuartos, setRooms] = useState<Cuarto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    fetch('http://localhost:3000/api/rooms')
      .then((response) => response.json())
      .then((data) => {
        setRooms(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Hubo un problema al cargar los datos.');
        setLoading(false);
      });
  }, []);

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
                Cuartos
            </Typography>
          </Paper>

        {cuartos.length > 0 ? (
          <Grid container spacing={3}>
            {cuartos.map((cuarto) => (
              <Grid item xs={12} sm={6} md={4} key={cuarto.tipo}>
                <Box sx={{ height: '100%' }}>
                  <Card
                    type="room"
                    title={cuarto.tipo}
                    description={'Habitación de tipo ' + cuarto.tipo}
                    tipo={cuarto.tipo}
                    hotel_id={cuarto.hotel_id}
                    capacidad={cuarto.capacidad}
                    precio_por_noche={cuarto.precio_por_noche}
                    disponibilidad={cuarto.disponibilidad}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary
            }}
          >
            <Typography variant="h6" align="center">
              No se encontraron hoteles
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default Cuartos;
