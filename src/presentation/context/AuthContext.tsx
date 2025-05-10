import React, { createContext, useContext, useState, useEffect } from "react";

import { GoogleAuthService } from "../../infrastructure/services/GoogleAuthService";
import { UserPayloadDto } from "../../domain/user/UserPayloadDto";

interface AuthContextType {
  user: UserPayloadDto | null;
  validateUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => useContext(AuthContext) as AuthContextType;

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [user, setUser] = useState<UserPayloadDto | null>(null);

  const validateUser = async () => {
    const googleAuthService = new GoogleAuthService();
    const currentUser = await googleAuthService.getCurrentUser();
    setUser(currentUser);
  };

  useEffect(() => {
    validateUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, validateUser }}>
      {children}
    </AuthContext.Provider>
  );
};