import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { readFromStorage } from "../../storage/storage";
import { VALIDATE_TOKEN_URL } from "../../constants";

interface AuthContextType {
  isAuthenticated: boolean | null;
  validateToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => useContext(AuthContext) as AuthContextType;

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const validateToken = async () => {
    const token = readFromStorage("access_token"); 
    if (!token) {
      setIsAuthenticated(false);
      return;
    }
    try {
      const res = await axios.get(VALIDATE_TOKEN_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status !== 200) {
        console.error("Error al validar el token:", res.statusText);
        setIsAuthenticated(false);
        return;
      }
      setIsAuthenticated(res.data.isValid === true);
    } catch {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    validateToken();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, validateToken }}>
      {children}
    </AuthContext.Provider>
  );
};

