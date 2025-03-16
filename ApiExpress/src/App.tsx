import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Configuraciones from "./components/Configuraciones";
import Hoteles from "./components/Hoteles";
import LoginForm from "./components/LoginForm";
import Reservas from "./components/Reservas";
import Dashboard from "./components/Dashboard";
import { useUser } from "./context/UserContext";
import { UserProvider } from "./context/UserContext";

const API_URL = "http://localhost:3000/api/auth/validate-token";

const AppContent: React.FC = () => {
  const { setUserId, setUser } = useUser();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
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

    const interval = setInterval(checkAuth, 900000);
    return () => clearInterval(interval);
  }, []);

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
          <Route path="/reservas" element={<Reservas />} />
          <Route path="/hoteles" element={<Hoteles />} />
          <Route path="/configuraciones" element={<Configuraciones />} />
        </>
      ) : (
        <Route path="*" element={<Navigate to="/" replace />} />
      )}
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <UserProvider>
      <div className="App">
        <AppContent />
      </div>
    </UserProvider>
  );
};

export default App;
