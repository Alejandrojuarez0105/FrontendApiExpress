import React, { useEffect, useState } from 'react';
import Card from './Card/Card';
import { Container, Grid, Typography, Box, CircularProgress, Alert, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

interface Hotel {
  _id: string;
  nombre: string;
  descripcion: string;
  direccion: string;
  telefono: string;
  email: string;
  servicios: string[];
  estrellas: number;
}

const Hoteles: React.FC = () => {
  const [hoteles, setHoteles] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    fetch(`${API_BASE_URL}/hoteles`)
      .then((response) => response.json())
      .then((data) => {
        setHoteles(data);
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
                Hoteles
            </Typography>
          </Paper>

        {hoteles.length > 0 ? (
          <Grid container spacing={3}>
            {hoteles.map((hotel) => (
              <Grid item xs={12} sm={6} md={4} key={hotel._id}>
                <Box sx={{ height: '100%' }}>
                  <Card
                    type="hotel"
                    title={hotel.nombre}
                    description={hotel.descripcion}
                    direccion={hotel.direccion}
                    estrellas={hotel.estrellas}
                    email={hotel.email}
                    telefono={hotel.telefono}
                    servicios={hotel.servicios}
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

export default Hoteles;
