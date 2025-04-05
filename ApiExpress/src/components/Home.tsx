import React from 'react';
import UltimoPago from './UltimoPago';
import TotalPagosCard from './TotalPagosCard';
import Box from '@mui/material/Box';

const Home: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex', // Usa flexbox para controlar la alineación
        flexDirection: 'row', // Alinea los componentes verticalmente
        justifyContent: 'flex-start', // Alinea al inicio horizontalmente
        alignItems: 'center', // Centra los componentes horizontalmente
        gap: 4, // Espaciado entre los componentes
        padding: 4, // Espaciado interno
        backgroundColor: 'background.default', // Fondo del tema
      }}
    >
      <UltimoPago />
      <TotalPagosCard />
    </Box>
  );
};

export default Home;