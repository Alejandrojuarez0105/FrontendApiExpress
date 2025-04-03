import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
interface User {
  _id: string;
  nombre: string;
  email: string;
  telefono: string;
  historial_reservas: string[];
  username: string;
  profilePicture: string;
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
            const response = await fetch(`${API_BASE_URL}/usuarios/${userId}`);
          if (!response.ok) {
            throw new Error("Error al obtener los datos del usuario");
          }

          const data = await response.json();
          const profilePicture = `https://picsum.photos/500?random=${userId}`;
          setUser({ ...data, profilePicture });
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
