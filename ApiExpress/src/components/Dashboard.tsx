import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HotelSharp from '@mui/icons-material/HotelSharp';
import SettingsIcon from '@mui/icons-material/Settings';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import Reservas from './Reservas';
import Hoteles from './Hoteles';
import { HomeRepairServiceSharp } from '@mui/icons-material';
import Configuraciones from './Configuraciones';
import { useUser } from '../context/UserContext'; 
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Tooltip from '@mui/material/Tooltip';
import { Zoom } from '@mui/material';

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
  },
  {
    segment: 'hoteles',
    title: 'Hoteles',
    icon: <HotelSharp />,
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

function DemoPageContent({ pathname }: DemoPageContentProps) {
  const renderContent = () => {
    switch (pathname) {
      case '/dashboard':
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
          </Box>
        );
      case '/hoteles':
        return <Hoteles />;
      case '/reservas':
        return <Reservas />;
      case '/configuraciones':
        return <Configuraciones />;
      default:
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

function SidebarFooterAccount() {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:3000/api/auth/logout', {
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
      <Typography variant="body2" mx={2} mt={1}>
        Cuenta
      </Typography>
      <MenuList>
        <Box
          key={user._id}
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            columnGap: 2,
            padding: '8px 16px',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 2 }}>
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
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="body2">{user.nombre}</Typography>
              <Typography variant="caption">{user.email}</Typography>
            </Box>
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
    <ThemeProvider theme={demoTheme}>
      <CssBaseline />
      <AppProvider
        navigation={NAVIGATION}
        router={router}
        theme={demoTheme}
        window={demoWindow}
        session={{
          user: {
            name: 'John Doe',
            email: 'john.doe@example.com',
            image: 'https://picsum.photos/500?random=65f601a456b789c601d456e6',
          }          
        }}
      >
        <DashboardLayout
          slots={{ toolbarAccount: () => null, sidebarFooter: SidebarFooterAccount }}
        >
          <DemoPageContent pathname={pathname} />
        </DashboardLayout>
      </AppProvider>
    </ThemeProvider>
  );
}

DashboardLayoutAccountSidebar.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window: PropTypes.func,
};

export default DashboardLayoutAccountSidebar;
