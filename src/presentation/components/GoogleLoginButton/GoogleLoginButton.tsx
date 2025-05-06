import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { AuthUseCase } from '../../../application/auth/AuthUseCase';
import { GoogleAuthService } from '../../../infrastructure/services/GoogleAuthService';
import { UserRole } from '../../../domain/user/UserRole';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import User from '../../../domain/user/User';
import { readFromStorage } from '../../../storage/storage';


interface GoogleLoginButtonProps {
  userType: UserRole;
  onSuccess?: () => void;
  label?: string; // Texto del botón
  color?: string; // Color del botón
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  userType,
  onSuccess,
  label = "Acceder con Google",
  color = "#e0e0e0"
}) => {
  const navigate = useNavigate();
  const authService = new GoogleAuthService();
  const authUseCase = new AuthUseCase(authService);
  const { validateToken } = useAuth();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const code = tokenResponse.code
      console.log(code);

      if (!code) {
        console.error("Token de Google no recibido.");
        return;
      }

      // Llamamos al método loginWithGoogle del useCase, pasándole los parámetros requeridos
      try {
        await authUseCase.loginWithGoogle(userType, code);
        
        
        const userPayload = await authUseCase.getCurrentUser(); // Obtenemos el payload del token
          
        if (userPayload?.role === UserRole.ESTUDIANTE) {
          
          await validateToken();
          navigate("/perfil");
        };  // Callback opcional para cuando el login es exitoso
        
      } catch (error) {
        alert("Error durante la autenticación");
        console.error(error);
      }
    },
    onError: () => alert("Falló el login de Google"),
    flow: 'auth-code',  
    scope: "openid email profile",  
  });

  return (
    <button
      style={{
        backgroundColor: color,
        color: "#000",
        width: "100%",
        padding: "12px",
        border: "none",
        borderRadius: "4px",
        marginBottom: "16px",
        fontWeight: 500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
      onClick={() => login()}
    >
      <img
        src="/src/presentation/assets/google icon.png"
        alt="Google"
        style={{ width: 18, height: 18, marginRight: 10 }}
      />
      {label}
    </button>
  );
};

export default GoogleLoginButton;


