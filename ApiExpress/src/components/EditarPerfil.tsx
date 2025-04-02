import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { 
  Box, 
  Typography, 
  Paper, 
  Avatar, 
  Grid, 
  Divider, 
  CircularProgress, 
  Container, 
  TextField, 
  Button,
  Snackbar,
  Alert
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const EditarPerfil: React.FC = () => {
  const { user } = useUser();
  const theme = useTheme();
  const [nombre, setNombre] = useState(user?.nombre || '');
  const [email, setEmail] = useState(user?.email || '');
  const [telefono, setTelefono] = useState(user?.telefono || '');
  const [username, setUsername] = useState(user?.username || '');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  const [showPassword, setShowPassword] = useState(false);

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

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setPasswordError('');
  
    if (!password.trim()) {
      setPasswordError('Debe ingresar una nueva contraseña');
      setLoading(false);
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:3000/api/usuarios/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          email,
          telefono,
          username,
          password,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Error al actualizar el perfil');
      }
  
      setNotification({
        open: true,
        message: '¡Perfil actualizado con éxito!',
        severity: 'success',
      });
  
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      setError(err.message);
      setNotification({
        open: true,
        message: 'Error al actualizar el perfil',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

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
            Editar Perfil
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
              <TextField 
                label="Nombre" 
                fullWidth 
                variant="outlined" 
                value={nombre} 
                onChange={(e) => setNombre(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField 
                label="Email" 
                fullWidth 
                variant="outlined" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField 
                label="Teléfono" 
                fullWidth 
                variant="outlined" 
                value={telefono} 
                onChange={(e) => setTelefono(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField 
                label="Usuario" 
                fullWidth 
                variant="outlined" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Contraseña"
                fullWidth
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!passwordError}
                helperText={passwordError}
                InputProps={{
                  endAdornment: (
                    <IconButton 
                      onClick={() => setShowPassword(!showPassword)} 
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
              />
            </Grid>

            {error && (
              <Grid item xs={12}>
                <Typography color="error">{error}</Typography>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth 
                onClick={handleSave} 
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setNotification(prev => ({ ...prev, open: false }))} 
          severity={notification.severity} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditarPerfil;