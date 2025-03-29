import * as React from 'react';
import { useState, useMemo } from 'react';
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
import { useReservations } from '../context/ReservationContext';
import { useUser } from '../context/UserContext';
import { HotelProvider } from '../context/HotelContext';
import { ReservationProvider } from '../context/ReservationContext';

interface FormData {
  hotelId: string;
  tipoHabitacionId: string;
  fechaInicio: Date | null;
  fechaFin: Date | null;
  numeroPersonas: number;
  comentarios: string;
}

const AddReservaForm: React.FC = () => {
  const theme = useTheme();
  const { hotels, tiposHabitacion, loading: hotelsLoading, error: hotelsError, fetchHotels, fetchTiposHabitacion } = useHotels();
  const { refreshReservations } = useReservations();
  const { user } = useUser();
  
  // Estado para el formulario
  const [formData, setFormData] = useState<FormData>({
    hotelId: '',
    tipoHabitacionId: '',
    fechaInicio: null,
    fechaFin: null,
    numeroPersonas: 1,
    comentarios: ''
  });
  
  // Filtrar tipos de habitación según el hotel seleccionado
  const tiposHabitacionFiltrados = useMemo(() => {
    if (!formData.hotelId) return [];
    return tiposHabitacion.filter(tipo => tipo.hotel_id === formData.hotelId && tipo.disponibilidad);
  }, [tiposHabitacion, formData.hotelId]);
  
  // Estado para errores de validación
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Estado para notificaciones
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  // Estado para indicar si está enviando el formulario
  const [submitting, setSubmitting] = useState(false);

  // React.useEffect para refrescar los datos si es necesario
  React.useEffect(() => {
    // Si no hay hoteles o tipos de habitación, intentamos cargarlos
    if (hotels.length === 0) {
      fetchHotels();
    }
    if (tiposHabitacion.length === 0) {
      fetchTiposHabitacion();
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
    
    if (name === 'tipoHabitacionId') {
      // Si se está seleccionando un tipo de habitación, actualizar también el número de personas
      const selectedRoom = tiposHabitacion.find(t => t._id === value);
      if (selectedRoom) {
        setFormData(prev => ({ 
          ...prev, 
          [name]: value,
          // Establecer el número de personas igual a la capacidad de la habitación
          numeroPersonas: selectedRoom.capacidad 
        }));
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
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
      setSubmitting(true);
      
      // Encontrar el tipo de habitación seleccionado
      const selectedTipoHabitacion = tiposHabitacion.find(t => t._id === formData.tipoHabitacionId);
      const selectedHotel = hotels.find(h => h._id === formData.hotelId);
      
      // Calcular el número de noches
      const fechaInicio = formData.fechaInicio ? new Date(formData.fechaInicio) : null;
      const fechaFin = formData.fechaFin ? new Date(formData.fechaFin) : null;
      
      let numNoches = 0;
      if (fechaInicio && fechaFin) {
        numNoches = Math.max(1, Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)));
      }
      
      // Calcular precio total
      const precioTotal = selectedTipoHabitacion?.precio_por_noche ? selectedTipoHabitacion.precio_por_noche * numNoches : 0;
      
      // Preparar datos para enviar al backend
      const reservaData = {
        usuario_id: user?._id,
        hotel_id: formData.hotelId,
        habitacion_id: formData.tipoHabitacionId,
        fecha_inicio: fechaInicio?.toISOString(),
        fecha_fin: fechaFin?.toISOString(),
        estado: "pendiente"
      };
      
      console.log('Datos de la reserva a enviar:', reservaData);
      
      // Enviar los datos al backend
      const response = await fetch('http://localhost:3000/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservaData),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Error al crear la reserva');
      }
      
      const data = await response.json();
      console.log('Reserva creada:', data);
      
      // Refrescar las reservas para que la nueva aparezca en la lista
      await refreshReservations();
      
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
    } finally {
      setSubmitting(false);
    }
  };

  // Cerrar notificación
  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  // Si está cargando, mostrar indicador
  if (hotelsLoading) {
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
  if (hotelsError) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        sx={{ backgroundColor: theme.palette.background.default }}
      >
        <Alert severity="error">{hotelsError}</Alert>
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
                      onChange={(e) => {
                        handleSelectChange(e);
                        // Al cambiar el hotel, reiniciamos el tipo de habitación
                        setFormData(prev => ({ ...prev, tipoHabitacionId: '' }));
                      }}
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
                  <FormControl 
                    fullWidth 
                    error={!!errors.tipoHabitacionId} 
                    disabled={!formData.hotelId}
                  >
                    <InputLabel id="tipo-habitacion-label">Tipo de Habitación</InputLabel>
                    <Select
                      labelId="tipo-habitacion-label"
                      id="tipoHabitacion"
                      name="tipoHabitacionId"
                      value={formData.tipoHabitacionId}
                      label="Tipo de Habitación"
                      onChange={handleSelectChange}
                    >
                      {tiposHabitacionFiltrados.map((tipo) => (
                        <MenuItem key={tipo._id} value={tipo._id}>
                          {tipo.tipo} - {tipo.capacidad} {tipo.capacidad === 1 ? 'persona' : 'personas'} - {tipo.precio_por_noche}€/noche
                        </MenuItem>
                      ))}
                    </Select>
                    {!formData.hotelId && <FormHelperText>Primero selecciona un hotel</FormHelperText>}
                    {errors.tipoHabitacionId && <FormHelperText>{errors.tipoHabitacionId}</FormHelperText>}
                  </FormControl>
                </Grid>

                {/* Mostrar información adicional sobre la habitación seleccionada */}
                {formData.tipoHabitacionId && (
                  <Grid item xs={12}>
                    <Paper 
                      elevation={1} 
                      sx={{ 
                        p: 2, 
                        backgroundColor: theme.palette.background.default,
                        border: `1px solid ${theme.palette.divider}`
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Detalles de la habitación:
                      </Typography>
                      {(() => {
                        const selectedTipo = tiposHabitacion.find(t => t._id === formData.tipoHabitacionId);
                        const fechaInicio = formData.fechaInicio ? new Date(formData.fechaInicio) : null;
                        const fechaFin = formData.fechaFin ? new Date(formData.fechaFin) : null;
                        
                        let numNoches = 0;
                        if (fechaInicio && fechaFin) {
                          numNoches = Math.max(1, Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)));
                        }
                        
                        return (
                          <Box>
                            <Typography variant="body2">
                              Tipo: {selectedTipo?.tipo}
                            </Typography>
                            <Typography variant="body2">
                              Capacidad: {selectedTipo?.capacidad} {selectedTipo?.capacidad === 1 ? 'persona' : 'personas'}
                            </Typography>
                            <Typography variant="body2">
                              Precio por noche: {selectedTipo?.precio_por_noche}€
                            </Typography>
                            {numNoches > 0 && (
                              <>
                                <Typography variant="body2">
                                  Número de noches: {numNoches}
                                </Typography>
                                <Typography variant="body1" fontWeight="bold" sx={{ mt: 1 }}>
                                  Precio total estimado: {selectedTipo?.precio_por_noche ? selectedTipo.precio_por_noche * numNoches : 0}€
                                </Typography>
                              </>
                            )}
                          </Box>
                        );
                      })()}
                    </Paper>
                  </Grid>
                )}

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
                    InputProps={{ 
                      inputProps: { 
                        min: 1, 
                        max: tiposHabitacion.find(t => t._id === formData.tipoHabitacionId)?.capacidad || 10 
                      } 
                    }}
                    value={formData.numeroPersonas}
                    onChange={handleInputChange}
                    helperText={
                      formData.tipoHabitacionId ? 
                      `Máximo ${tiposHabitacion.find(t => t._id === formData.tipoHabitacionId)?.capacidad} personas para este tipo de habitación` : 
                      'Seleccione un tipo de habitación primero'
                    }
                    disabled={!formData.tipoHabitacionId}
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
                    disabled={submitting}
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
                    {submitting ? (
                      <>
                        <CircularProgress size={24} sx={{ mr: 1, color: 'white' }} />
                        Creando...
                      </>
                    ) : 'Crear Reserva'}
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

const AddReservas: React.FC = () => {
  return (
    <HotelProvider>
      <ReservationProvider>
        <AddReservaForm />
      </ReservationProvider>
    </HotelProvider>
  );
}

export default AddReservas;