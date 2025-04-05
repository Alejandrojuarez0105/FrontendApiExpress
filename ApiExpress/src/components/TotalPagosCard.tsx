import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useUser } from '../context/UserContext';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const TotalPagosCard: React.FC = () => {
  const { user } = useUser();
  const [totalPagos, setTotalPagos] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchTotalPagos = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/pagos/usuario/${user._id}/total`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setTotalPagos(data.totalPagos);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchTotalPagos();
  }, [user]);

  if (loading) {
    return (
      <Paper
        elevation={3}
        sx={{
          p: theme.spacing(3),
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <CircularProgress />
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper
        elevation={3}
        sx={{
          p: theme.spacing(3),
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <Alert severity="error">{error}</Alert>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: theme.spacing(3),
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        textAlign: 'center',
      }}
    >
      <Typography variant="h6" color="primary" gutterBottom>
        Pagos Totales Realizados
      </Typography>
      <Typography variant="h4" fontWeight="bold">
        {totalPagos}
      </Typography>
    </Paper>
  );
};

export default TotalPagosCard;