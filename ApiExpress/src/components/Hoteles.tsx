import React, { useEffect, useState } from 'react';
import Card from './Card/Card';
import { Container, Grid, Typography, Box, CircularProgress, Alert, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';

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
    fetch('http://localhost:3000/api/hoteles')
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
      <Container maxWidth="lg" sx={{ mt: 2, mb: 5 }}>
        <Typography variant="h4" align="center" mb={5} color="text.primary">
          Lista de Hoteles
        </Typography>

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
