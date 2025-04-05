import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import { useUser, userGuest } from "./context/UserContext";
import { UserProvider } from "./context/UserContext";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

// Definir el tema oscuro global
const darkTheme = createTheme({
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
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1E1E1E',
          color: '#fff',
          border: '1px solid #333',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: '#333',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#1E1E1E',
          color: '#fff',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: '#fff',
        },
        input: {
          color: '#fff',
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

const API_URL = `${process.env.REACT_APP_API_BASE_URL}/auth/validate-token`;

const AppContent: React.FC = () => {
  const { setUserId, setUser } = useUser();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const cookies = document.cookie.split("; ").reduce((acc: Record<string, string>, current) => {
      const [key, value] = current.split("=");
      acc[key] = value;
      return acc;
    }, {});
  
    // Si hay cookie de invitado activa
    if (cookies["guest"] === "true") {
      setIsAuthenticated(true);
      setUserId("0");
      setUser(userGuest);
      return;
    }
  
    const checkAuth = async () => {
      try {
        const response = await fetch(API_URL, {
          method: "GET",
          credentials: "include",
        });
  
        const data = await response.json();
  
        if (data.valid && data.user) {
          setIsAuthenticated(true);
          setUserId(data.user.userId);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
      }
    };
  
    checkAuth();
  
    if (location.pathname !== "/") {
      const interval = setInterval(checkAuth, 900000);
      return () => clearInterval(interval);
    }
  }, [location.pathname]);

  if (isAuthenticated === null) {
    return <p>Cargando...</p>;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginForm />}
      />
      {isAuthenticated ? (
        <>
          <Route path="/dashboard" element={<Dashboard />} />
        </>
      ) : (
        <Route path="*" element={<Navigate to="/" replace />} />
      )}
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <UserProvider>
        <div className="App">
          <AppContent />
        </div>
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;
