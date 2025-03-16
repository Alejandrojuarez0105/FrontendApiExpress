import React from 'react';
import { useUser } from '../context/UserContext';
import { 
  Box, 
  Typography, 
  Paper, 
  Avatar, 
  Grid, 
  Divider, 
  CircularProgress, 
  Container
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Configuraciones: React.FC = () => {
  const { user } = useUser();
  const theme = useTheme();

  if (!user) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        sx={{ backgroundColor: theme.palette.background.default }}
      >
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2, color: theme.palette.text.primary }}>
          Cargando datos del usuario...
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
        minHeight: '100%',
        backgroundColor: theme.palette.background.default,
        padding: 3
      }}
    >
      <Container maxWidth="sm">
        <Paper 
          elevation={3} 
          sx={{ 
            padding: 4, 
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary
          }}
        >
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Perfil de Usuario
          </Typography>
          
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mb: 3 
            }}
          >
            <Avatar
              src={user.profilePicture || ''}
              alt={user.nombre || 'Usuario'}
              sx={{ 
                width: 120, 
                height: 120,
                border: `3px solid ${theme.palette.primary.main}`
              }}
            />
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body1">
                <Typography component="span" fontWeight="bold">Nombre:</Typography> {user.nombre || 'No disponible'}
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="body1">
                <Typography component="span" fontWeight="bold">Email:</Typography> {user.email || 'No disponible'}
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="body1">
                <Typography component="span" fontWeight="bold">Teléfono:</Typography> {user.telefono || 'No disponible'}
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="body1">
                <Typography component="span" fontWeight="bold">Usuario:</Typography> {user.username || 'No disponible'}
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="body1">
                <Typography component="span" fontWeight="bold">Reservas:</Typography> {Array.isArray(user.historial_reservas) ? user.historial_reservas.length : 0}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Configuraciones;
