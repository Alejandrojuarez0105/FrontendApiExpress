import React from 'react';
import UltimoPago from './UltimoPago';
import TotalPagosCard from './TotalPagosCard';
import Box from '@mui/material/Box';

const Home: React.FC = () => {
  return (
    <Box
      sx={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      gap: 4,
      padding: 4,
      backgroundColor: 'background.default',
      }}
    >
      <UltimoPago />
      <TotalPagosCard />
    </Box>
  );
};

export default Home;