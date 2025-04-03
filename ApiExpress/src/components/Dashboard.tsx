import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MenuList from '@mui/material/MenuList';
import ListItemIcon from '@mui/material/ListItemIcon';
import Avatar from '@mui/material/Avatar';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HotelSharp from '@mui/icons-material/HotelSharp';
import SettingsIcon from '@mui/icons-material/Settings';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import Hoteles from './Hoteles';
import { HomeRepairServiceSharp, KingBedSharp } from '@mui/icons-material';
import Configuraciones from './Configuraciones';
import { useUser } from '../context/UserContext'; 
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Tooltip from '@mui/material/Tooltip';
import { Zoom } from '@mui/material';
import Reservas from './Reservas';
import AddReservas from './AddReservas';
import PaymentIcon from '@mui/icons-material/Payment';
import Cuarto from './Cuartos';
import Payment from './Payment';
import UltimoPago from './UltimoPago';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
interface DemoPageContentProps {
  pathname: string;
}

interface DashboardLayoutProps {
  window?: () => Window;
}

const NAVIGATION = [
  {
    kind: 'header' as const,
    title: 'Main items',
  },
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'reservas',
    title: 'Reservas',
    icon: <HomeRepairServiceSharp />,
    children: [
      {
        segment: 'crear-reserva',
        title: 'Crear Reserva',
        icon: <HomeRepairServiceSharp />,
      },
      {
        segment: 'mis-reservas',
        title: 'Mis Reservas',
        icon: <HomeRepairServiceSharp />,
      },
    ],
  },
  {
    segment: 'hoteles',
    title: 'Hoteles',
    icon: <HotelSharp />,
  },
  {
    segment: 'payments',
    title: 'Pagos',
    icon: <PaymentIcon />
  },
  { 
    segment: 'rooms',
    title: 'Cuartos',
    icon: <KingBedSharp />
  },
  {
    segment: 'configuraciones',
    title: 'Configuraciones',
    icon: <SettingsIcon />,
  },
];

const demoTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#ce93d8',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#121212',
          color: '#fff',
          minHeight: '100vh',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1E1E1E',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1E1E1E',
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ pathname, navigate }: DemoPageContentProps & { navigate: (path: string) => void }) {
  console.log('Pathname actual:', pathname);
  
  const renderContent = () => {
    switch (pathname) {
      case '/dashboard':
        console.log('Renderizando Dashboard');
        return (
          <Box
            sx={{
              py: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <Typography>Bienvenido al Dashboard</Typography>
            <UltimoPago />
          </Box>
        );
      case '/hoteles':
        console.log('Renderizando Hoteles');
        return <Hoteles />;
      case '/reservas/mis-reservas':
        console.log('Renderizando Reservas');
        try {
          return <Reservas />;
        } catch (error) {
          console.error('Error al renderizar Reservas:', error);
          return (
            <Box
              sx={{
                py: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <Typography color="error">Error al cargar Reservas</Typography>
              <Typography variant="body2">{String(error)}</Typography>
            </Box>
          );
        }
        case '/reservas/crear-reserva':
          console.log('Renderizando Reservas');
          try {
            return <AddReservas />;
          } catch (error) {
            console.error('Error al renderizar Reservas:', error);
            return (
              <Box
                sx={{
                  py: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <Typography color="error">Error al cargar Reservas</Typography>
                <Typography variant="body2">{String(error)}</Typography>
              </Box>
            );
          }
      case '/configuraciones':
        console.log('Renderizando Configuraciones');
        return <Configuraciones />;
      case '/rooms':
        return <Cuarto />;
      case '/payments':
        return <Payment navigate={navigate} />; // Pass navigate to Payment
      default:
        console.log('Ruta no encontrada:', pathname);
        return (
          <Box
            sx={{
              py: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <Typography>Página no encontrada</Typography>
          </Box>
        );
    }
  };

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      {renderContent()}
    </Box>
  );
}

interface SidebarFooterAccountProps {
  mini: boolean; 
}

function SidebarFooterAccount({ mini }: SidebarFooterAccountProps) {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    try {
      const baseUrl = API_BASE_URL || 'http://localhost:3000/api';
      await fetch(`${baseUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      window.location.reload();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      alert('Hubo un problema al cerrar sesión. Inténtalo de nuevo.');
    }
  };

  return (
    <Stack direction="column">
      {!mini && (
        <Typography
          variant="body2"
          mx={2}
          mt={1}
          sx={{
            transition: 'opacity 0.3s ease',
            opacity: mini ? 0 : 1,
          }}
        >
          Cuenta
        </Typography>
      )}

      <MenuList>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: mini ? 'column' : 'row',
            alignItems: 'center',
            columnGap: 2,
            padding: '8px 16px',
            transition: 'flex-direction 1s ease, margin-bottom 1s ease',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              columnGap: 2,
              marginBottom: mini ? '12px' : '0', 
              transition: 'margin-bottom 0.3s ease',
            }}
          >
            <ListItemIcon sx={{ minWidth: 0 }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  fontSize: '0.95rem',
                }}
                src={user.profilePicture || ''}
                alt={user.nombre || ''}
              >
                {user.nombre ? user.nombre[0] : 'U'}
              </Avatar>
            </ListItemIcon>
            {!mini && (
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="body2">{user.nombre}</Typography>
                <Typography variant="caption">{user.email}</Typography>
              </Box>
            )}
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: 'auto',
              width: '100%',
            }}
          >
            <Tooltip title="Logout" TransitionComponent={Zoom} arrow>
              <ListItemIcon sx={{ cursor: 'pointer', minWidth: 0 }} onClick={handleLogout}>
                <ExitToAppIcon sx={{ color: 'white' }} />
              </ListItemIcon>
            </Tooltip>
          </Box>
        </Box>
      </MenuList>
    </Stack>
  );
}

function DashboardLayoutAccountSidebar(props: DashboardLayoutProps) {
  const { window } = props;
  const [pathname, setPathname] = React.useState('/dashboard');

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: ((url: string | URL) => {
        const path = typeof url === 'string' ? url : url.pathname;
        setPathname(path.startsWith('/') ? path : `/${path}`);
      }),
    };
  }, [pathname]);

  const demoWindow = window !== undefined ? window() : undefined;

  return (
      <AppProvider
        navigation={NAVIGATION}
        router={router}
        theme={demoTheme}
        window={demoWindow}
      >
        <DashboardLayout
          slots={{ toolbarAccount: () => null, sidebarFooter: SidebarFooterAccount }}
        >
          <DemoPageContent pathname={pathname} navigate={router.navigate} /> {/* Pass navigate */}
        </DashboardLayout>
      </AppProvider>
  );
}

DashboardLayoutAccountSidebar.propTypes = {
  window: PropTypes.func,
};

export default DashboardLayoutAccountSidebar;
