import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import { 
  Container, 
  Typography, 
  Paper, 
  CssBaseline, 
  TextField, 
  Button, 
  Grid, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select,
  SelectChangeEvent,
  FormHelperText,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { es } from 'date-fns/locale';
import { useHotels } from '../context/HotelContext';

// Eliminamos los datos estáticos, ahora los obtendremos del contexto

interface FormData {
  hotelId: string;
  tipoHabitacionId: string;
  fechaInicio: Date | null;
  fechaFin: Date | null;
  numeroPersonas: number;
  comentarios: string;
}

const AddReservas: React.FC = () => {
  const theme = useTheme();
  const { hotels, tiposHabitacion, loading, error, fetchHotels, fetchTiposHabitacion } = useHotels();
  
  // Estado para el formulario
  const [formData, setFormData] = useState<FormData>({
    hotelId: '',
    tipoHabitacionId: '',
    fechaInicio: null,
    fechaFin: null,
    numeroPersonas: 1,
    comentarios: ''
  });
  
  // Estado para errores de validación
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Estado para notificaciones
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  // React.useEffect para refrescar los datos si es necesario
  React.useEffect(() => {
    // Si no hay hoteles o tipos de habitación, intentamos cargarlos
    if (hotels.length === 0) {
      fetchHotels();
    }
  }, [hotels.length, tiposHabitacion.length, fetchHotels, fetchTiposHabitacion]);

  // Manejador de cambios en campos de texto
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar error al cambiar el valor
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Manejador de cambios en selects
  const handleSelectChange = (e: SelectChangeEvent) => {
    const name = e.target.name as keyof FormData;
    const value = e.target.value as string;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar error al cambiar el valor
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Manejador para las fechas
  const handleDateChange = (date: Date | null, field: 'fechaInicio' | 'fechaFin') => {
    setFormData(prev => ({ ...prev, [field]: date }));
    // Limpiar error al cambiar la fecha
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Manejador para el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    const newErrors: Record<string, string> = {};
    
    if (!formData.hotelId) newErrors.hotelId = 'Selecciona un hotel';
    if (!formData.tipoHabitacionId) newErrors.tipoHabitacionId = 'Selecciona un tipo de habitación';
    if (!formData.fechaInicio) newErrors.fechaInicio = 'Selecciona la fecha de inicio';
    if (!formData.fechaFin) newErrors.fechaFin = 'Selecciona la fecha de fin';
    
    if (formData.fechaInicio && formData.fechaFin && formData.fechaInicio >= formData.fechaFin) {
      newErrors.fechaFin = 'La fecha de salida debe ser posterior a la fecha de entrada';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      // Aquí iría la lógica para enviar los datos al backend
      // Ejemplo:
      /*
      const selectedHotel = hotels.find(h => h._id === formData.hotelId);
      const selectedTipoHabitacion = tiposHabitacion.find(t => t._id === formData.tipoHabitacionId);
      
      const reservaData = {
        hotel_id: formData.hotelId,
        habitacion: {
          tipo: selectedTipoHabitacion?.tipo,
          capacidad: selectedTipoHabitacion?.capacidad
        },
        fecha_inicio: formData.fechaInicio?.toISOString().split('T')[0],
        fecha_fin: formData.fechaFin?.toISOString().split('T')[0],
        numero_personas: formData.numeroPersonas,
        comentarios: formData.comentarios,
        precio_total: selectedTipoHabitacion?.precio * (formData.fechaFin && formData.fechaInicio ? 
                      Math.max(1, Math.ceil((formData.fechaFin.getTime() - formData.fechaInicio.getTime()) / (1000 * 60 * 60 * 24))) : 1)
      };
      
      const response = await fetch('http://localhost:3000/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservaData),
        credentials: 'include'
      });   
      
      if (!response.ok) {
        throw new Error('Error al crear la reserva');
      }
      */
      
      console.log('Datos de la reserva a enviar:', formData);
      
      // Mostrar notificación de éxito
      setNotification({
        open: true,
        message: '¡Reserva creada con éxito!',
        severity: 'success'
      });
      
      // Reiniciar formulario
      setFormData({
        hotelId: '',
        tipoHabitacionId: '',
        fechaInicio: null,
        fechaFin: null,
        numeroPersonas: 1,
        comentarios: ''
      });
    } catch (err) {
      console.error('Error al crear la reserva:', err);
      setNotification({
        open: true,
        message: err instanceof Error ? err.message : 'Error al crear la reserva',
        severity: 'error'
      });
    }
  };

  // Cerrar notificación
  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  // Si está cargando, mostrar indicador
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
          Cargando datos...
        </Typography>
      </Box>
    );
  }

  // Si hay un error, mostrar mensaje
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
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <CssBaseline />
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
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              mb: 3,
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              borderRadius: 1,
              width: '100%'
            }}
          >
            <Typography 
              variant="h4" 
              align="center"
              color="primary.main"
              sx={{
                fontWeight: 'bold',
                letterSpacing: '0.5px',
                textShadow: '1px 1px 3px rgba(0,0,0,0.3)'
              }}
            >
              Crear Nueva Reserva
            </Typography>
          </Paper>

          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary
            }}
          >
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                {/* Selección de Hotel */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={!!errors.hotelId}>
                    <InputLabel id="hotel-label">Hotel</InputLabel>
                    <Select
                      labelId="hotel-label"
                      id="hotel"
                      name="hotelId"
                      value={formData.hotelId}
                      label="Hotel"
                      onChange={handleSelectChange}
                    >
                      {hotels.map((hotel) => (
                        <MenuItem key={hotel._id} value={hotel._id}>
                          {hotel.nombre} - {hotel.direccion}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.hotelId && <FormHelperText>{errors.hotelId}</FormHelperText>}
                  </FormControl>
                </Grid>

                {/* Tipo de Habitación */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={!!errors.tipoHabitacionId}>
                    <InputLabel id="tipo-habitacion-label">Tipo de Habitación</InputLabel>
                    <Select
                      labelId="tipo-habitacion-label"
                      id="tipoHabitacion"
                      name="tipoHabitacionId"
                      value={formData.tipoHabitacionId}
                      label="Tipo de Habitación"
                      onChange={handleSelectChange}
                    >
                      {tiposHabitacion.map((tipo) => (
                        <MenuItem key={tipo._id} value={tipo._id}>
                          {tipo.tipo} - {tipo.capacidad} {tipo.capacidad === 1 ? 'persona' : 'personas'} - {tipo.precio}€/noche
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.tipoHabitacionId && <FormHelperText>{errors.tipoHabitacionId}</FormHelperText>}
                  </FormControl>
                </Grid>

                {/* Fecha de Entrada */}
                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="Fecha de Entrada"
                    value={formData.fechaInicio}
                    onChange={(date) => handleDateChange(date, 'fechaInicio')}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.fechaInicio,
                        helperText: errors.fechaInicio
                      }
                    }}
                  />
                </Grid>

                {/* Fecha de Salida */}
                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="Fecha de Salida"
                    value={formData.fechaFin}
                    onChange={(date) => handleDateChange(date, 'fechaFin')}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.fechaFin,
                        helperText: errors.fechaFin
                      }
                    }}
                    minDate={formData.fechaInicio || undefined}
                  />
                </Grid>

                {/* Número de Personas */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="numeroPersonas"
                    name="numeroPersonas"
                    label="Número de Personas"
                    type="number"
                    InputProps={{ inputProps: { min: 1, max: 10 } }}
                    value={formData.numeroPersonas}
                    onChange={handleInputChange}
                  />
                </Grid>

                {/* Comentarios */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="comentarios"
                    name="comentarios"
                    label="Comentarios o Solicitudes Especiales"
                    multiline
                    rows={4}
                    value={formData.comentarios}
                    onChange={handleInputChange}
                  />
                </Grid>

                {/* Botón de Envío */}
                <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ 
                      py: 1.5, 
                      px: 4,
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
                      '&:hover': {
                        boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.3)',
                      }
                    }}
                  >
                    Crear Reserva
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* Notificación */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </LocalizationProvider>
  );
};

export default AddReservas;