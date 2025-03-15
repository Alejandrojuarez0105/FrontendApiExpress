import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  _id: string;
  nombre: string;
  email: string;
  telefono: string;
  historial_reservas: string[];
  username: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  setUserId: (id: string | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        try {
          const response = await fetch(`http://localhost:3000/api/usuarios/${userId}`);
          if (!response.ok) {
            throw new Error("Error al obtener los datos del usuario");
          }

          const data = await response.json();
          setUser(data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [userId]);

  return (
    <UserContext.Provider value={{ user, setUser, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe usarse dentro de un UserProvider");
  }
  return context;
};
