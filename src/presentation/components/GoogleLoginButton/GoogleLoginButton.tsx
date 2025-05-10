import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { AuthUseCase } from '../../../application/auth/AuthUseCase';
import { GoogleAuthService } from '../../../infrastructure/services/GoogleAuthService';
import { UserRole } from '../../../domain/user/UserRole';

interface GoogleLoginButtonProps {
  userType: UserRole;
  onSuccess?: () => void;
  label?: string; // Texto del botón
  color?: string; // Color del botón
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  userType,
  label = "Acceder con Google",
  color = "#e0e0e0"
}) => {
  const authService = new GoogleAuthService();
  const authUseCase = new AuthUseCase(authService);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const code = tokenResponse.code;
      if (!code) {
        console.error("Token de Google no recibido.");
        return;
      }
      try {
        await authUseCase.loginWithGoogle(userType, code);
        // Forzar recarga y navegación al home
        window.location.href = '/';
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