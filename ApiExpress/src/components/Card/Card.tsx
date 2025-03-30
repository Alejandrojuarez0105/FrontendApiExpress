import React, { useState } from "react";
import { Card as MuiCard, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, Rating, Box, Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import "./Card.css";

// Interfaz base que comparten todos los tipos de card
interface BaseCardProps {
  type: 'hotel' | 'reserva' | 'room';
  title: string;
  description: string;
}

// Interfaz específica para hoteles
interface HotelCardProps extends BaseCardProps {
  type: 'hotel';
  direccion: string;
  estrellas: number;
  email: string;
  telefono: string;
  servicios: string[];
}

// Interfaz específica para reservas
interface ReservaCardProps extends BaseCardProps {
  type: 'reserva';
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

interface RoomCardProps extends BaseCardProps{
  type: 'room';
  hotel_id: string;
  tipo: string;
  capacidad: number;
  precio_por_noche: number;
  disponibilidad: boolean;
}

// Tipo de unión para aceptar cualquiera de los tipos
type CardProps = HotelCardProps | ReservaCardProps | RoomCardProps;

const Card: React.FC<CardProps> = (props) => {
  const [showDetails, setShowDetails] = useState(false);
  const theme = useTheme();

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  // Contenido específico según el tipo
  const renderCardContent = () => {
    if (props.type === 'hotel') {
      return (
        <div>
          <Typography 
            variant="h5" 
            component="div" 
            gutterBottom
            sx={{
              height: 60,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {props.title}
          </Typography>
          
          <Typography 
            variant="body2" 
            color="text.secondary" 
            gutterBottom
            sx={{ 
              height: 80, 
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {props.description}
          </Typography>
          
          <Typography 
            variant="body2"
            sx={{ 
              mb: 1,
              height: 24,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            <strong>Dirección:</strong> {props.direccion}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={props.estrellas} readOnly size="small" />
          </Box>
        </div>
      );
    } else if (props.type === 'reserva') {
      return (
        <div>
          <Typography 
            variant="h5" 
            component="div" 
            gutterBottom
            sx={{
              height: 60,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {props.title}
          </Typography>
          
          <Typography 
            variant="body2" 
            color="text.secondary" 
            gutterBottom
            sx={{ 
              height: 40, 
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {props.description}
          </Typography>
          
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              <strong>Hotel:</strong> {props.hotel.nombre}
            </Typography>
            
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              <strong>Período:</strong> {new Date(props.fechaInicio).toLocaleDateString()} - {new Date(props.fechaFin).toLocaleDateString()}
            </Typography>
            
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              <strong>Personas:</strong> {props.numeroPersonas}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Chip 
              label={props.estado} 
              color={
                props.estado === 'Confirmada' ? 'success' : 
                props.estado === 'Pendiente' ? 'warning' : 
                props.estado === 'Cancelada' ? 'error' : 'default'
              }
              size="small"
            />
            <Typography variant="h6" color="primary">
              ${props.precio}
            </Typography>
          </Box>
        </div>
      );
    }else if (props.type === 'room'){
      return (
        <div>
          <Typography 
            variant="h5" 
            component="div" 
            gutterBottom
            sx={{
              height: 60,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {props.title}
          </Typography>
          
          <Typography 
            variant="body2" 
            color="text.secondary" 
            gutterBottom
            sx={{ 
              height: 60, 
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {props.description}
          </Typography>
          
          <Typography 
            variant="body2"
            sx={{ 
              mb: 1,
              height: 24,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            <strong>Cuarto:</strong> {props.tipo}
          </Typography>

          <Typography 
          variant="body2"
          sx={{ 
            mb: 1,
            height: 24,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
            }}>
            <strong>Capacidad:</strong> {props.capacidad}
          </Typography>

          <Typography
          sx={{
            mb: 1,
            height: 24,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}  
          >
            <strong>{props.disponibilidad ? 'Cuarto disponible, reserva ya' : 'Cuarto no disponible'}</strong>
          </Typography>
        </div>
      );
    }
    
    return null;
  };

  const renderDialogContent = () => {
    if (props.type === 'hotel') {
      return (
        <>
          <DialogTitle>{props.title}</DialogTitle>
          <DialogContent dividers>
            <Typography variant="body1" gutterBottom>
              <strong>Descripción:</strong> {props.description}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Dirección:</strong> {props.direccion}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Teléfono:</strong> {props.telefono}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Email:</strong> {props.email}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Estrellas:</strong> <Rating value={props.estrellas} readOnly />
            </Typography>
            <Typography variant="body1">
              <strong>Servicios:</strong> {props.servicios.join(", ")}
            </Typography>
          </DialogContent>
        </>
      );
    } else if (props.type === 'reserva') {
      return (
        <>
          <DialogTitle>{props.title}</DialogTitle>
          <DialogContent dividers>
            <Typography variant="body1" gutterBottom>
              <strong>Descripción:</strong> {props.description}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Hotel:</strong> {props.hotel.nombre}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Dirección del hotel:</strong> {props.hotel.direccion}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Fecha de inicio:</strong> {new Date(props.fechaInicio).toLocaleDateString()}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Fecha de fin:</strong> {new Date(props.fechaFin).toLocaleDateString()}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Número de personas:</strong> {props.numeroPersonas}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Estado:</strong> {props.estado}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Precio total:</strong> ${props.precio}
            </Typography>
          </DialogContent>
        </>
      );
    }else if (props.type === 'room'){
      return(
        <>
        <DialogTitle>{props.title}</DialogTitle>
          <DialogContent dividers>
            <Typography variant="body1" gutterBottom>
              <strong>Tipo de cuarto:</strong> {props.tipo}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Descripcion:</strong> {'Cuarto de tipo: ' + props.tipo}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Capacidad:</strong> {props.capacidad}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Precio por noche:</strong> {props.precio_por_noche}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Disponible:</strong> {props.disponibilidad ? 'Disponible' : 'No disponible'}
            </Typography>
          </DialogContent>
        </>
      );
    }
    
    return null;
  };

  return (
    <MuiCard 
      sx={{ 
        margin: 2, 
        backgroundColor: theme.palette.background.paper, 
        color: theme.palette.text.primary,
        height: 350,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {renderCardContent()}

        <Button 
          variant="contained" 
          color="primary" 
          onClick={toggleDetails}
          sx={{ mt: 'auto' }}
          fullWidth
        >
          Detalles
        </Button>

        <Dialog
          open={showDetails}
          onClose={toggleDetails}
          maxWidth="sm"
          fullWidth
        >
          {renderDialogContent()}
          <DialogActions>
            <Button onClick={toggleDetails} color="primary">
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </MuiCard>
  );
};

export default Card;
