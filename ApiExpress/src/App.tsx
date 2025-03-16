import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import { useUser } from "./context/UserContext";
import { UserProvider } from "./context/UserContext";

const API_URL = "http://localhost:3000/api/auth/validate-token";

const AppContent: React.FC = () => {
  const { setUserId, setUser } = useUser();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

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
    <UserProvider>
      <div className="App">
        <AppContent />
      </div>
    </UserProvider>
  );
};

export default App;
