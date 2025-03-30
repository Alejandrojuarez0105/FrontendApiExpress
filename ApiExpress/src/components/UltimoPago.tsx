import React, { useEffect, useState, useCallback } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  CircularProgress, 
  Alert, 
  Paper, 
  Grid, 
  Chip,
  Button 
} from '@mui/material';
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import { useUser } from '../context/UserContext';
import RefreshIcon from '@mui/icons-material/Refresh';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
      secondary: '#757575',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    fontWeightBold: 700,
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8, // 1 unidad de espaciado equivale a 8px
});

interface Pago {
  _id: string;
  nombre: string;
  email: string;
  telefono: string;
  monto: number;
  metodo_pago: string;
  fecha_pago: string;
  estado: 'Completado' | 'Pendiente' | 'Fallido';
}

const UltimoPago: React.FC = () => {
  const { user } = useUser(); 
  const [pago, setPago] = useState<Pago | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  const fetchUltimoPago = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:3000/api/pagos/usuario/65f601a456b789c601d456e2/ultimo`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          setPago(null);
        } else {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      } else {
        const data = await response.json();
        // Adaptar los datos de la API a la interfaz
        const adaptedData = {
          ...data,
          nombre: data.usuario_id?.nombre || 'N/A',
          email: data.usuario_id?.email || 'N/A',
          telefono: data.usuario_id?.telefono || 'N/A',
          estado: data.estado.charAt(0).toUpperCase() + data.estado.slice(1)
        };
        setPago(adaptedData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUltimoPago();
  }, [fetchUltimoPago]);

  const getEstadoColor = () => {
    switch (pago?.estado) {
      case 'Completado':
        return 'success';
      case 'Pendiente':
        return 'warning';
      case 'Fallido':
        return 'error';
      default:
        return 'default';
    }
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
        <Typography variant="body1" sx={{ mt: 2, color: theme.palette.text.primary }}>
          Cargando información de pago...
        </Typography>
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
        flexDirection="column"
        sx={{ backgroundColor: theme.palette.background.default }}
      >
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button 
          variant="outlined" 
          startIcon={<RefreshIcon />}
          onClick={fetchUltimoPago}
        >
          Reintentar
        </Button>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        backgroundColor: theme.palette.background.default, 
        minHeight: '100vh',
        width: '100%',
        pt: theme.spacing(3),
        pb: theme.spacing(5)
      }}
    >
      <Container maxWidth="md" sx={{ mt: theme.spacing(2), mb: theme.spacing(5) }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: theme.spacing(2), 
            mb: theme.spacing(4),
            backgroundColor: theme.palette.background.default,
            boxShadow: `0 4px 20px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)`,
            borderRadius: theme.shape.borderRadius
          }}
        >
          <Typography 
            variant="h4" 
            align="center"
            color="primary"
            sx={{
              fontWeight: theme.typography.fontWeightBold,
              letterSpacing: '0.5px',
              textShadow: '1px 1px 3px rgba(0,0,0,0.3)'
            }}
          >
            Último Pago
          </Typography>
        </Paper>

        {pago ? (
          <Paper elevation={3} sx={{ p: theme.spacing(4) }}>
            <Grid container spacing={theme.spacing(3)}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: theme.typography.fontWeightBold }}>
                  Fecha:
                </Typography>
                <Typography variant="body1">
                  {new Date(pago.fecha_pago).toLocaleDateString()}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: theme.typography.fontWeightBold }}>
                  Monto:
                </Typography>
                <Typography variant="body1">
                  ${pago.monto.toFixed(2)}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: theme.typography.fontWeightBold }}>
                  Método de pago:
                </Typography>
                <Typography variant="body1">
                  {pago.metodo_pago}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: theme.typography.fontWeightBold }}>
                  Estado:
                </Typography>
                <Chip 
                  label={pago.estado} 
                  color={getEstadoColor()} 
                  variant="outlined"
                  sx={{ fontWeight: theme.typography.fontWeightBold }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: theme.typography.fontWeightBold }}>
                  Referencia:
                </Typography>
                <Typography variant="body1">
                  {pago._id}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        ) : (
          <Paper 
            elevation={2} 
            sx={{ 
              p: theme.spacing(3), 
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: theme.spacing(2)
            }}
          >
            <Typography variant="h6" align="center">
              No se encontraron registros de pagos
            </Typography>
            <Button 
              variant="outlined" 
              color="primary"
              startIcon={<RefreshIcon />}
              onClick={fetchUltimoPago}
              sx={{ mt: theme.spacing(1) }}
            >
              Recargar
            </Button>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <UltimoPago />
    </ThemeProvider>
  );
};

export default App;