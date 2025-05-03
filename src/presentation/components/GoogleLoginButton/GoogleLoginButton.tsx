import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { AuthUseCase } from '../../../application/auth/AuthUseCase';
import { GoogleAuthService } from '../../../infrastructure/services/GoogleAuthService';


interface GoogleLoginButtonProps {
  onSuccess?: () => void;
  label?: string; // Texto del botón
  color?: string; // Color del botón
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  onSuccess,
  label = "Acceder con Google",
  color = "#e0e0e0"
}) => {
  const authService = new GoogleAuthService();
  const authUseCase = new AuthUseCase(authService);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const token = tokenResponse.access_token;

      if (!token) {
        alert("Token de Google no recibido.");
        return;
      }

      // Llamamos al método loginWithGoogle del useCase, pasándole solo el token
      try {
        const response = await authUseCase.loginWithGoogle(token);
        if (response.success) {
          alert(`Bienvenido, ${response.user?.name}`);
          if (onSuccess) onSuccess();  // Callback opcional para cuando el login es exitoso
        } else {
          alert(`Error: ${response.error}`);
        }
      } catch (error) {
        alert("Error durante la autenticación");
        console.error(error);
      }
    },
    onError: () => alert("Falló el login de Google"),
    flow: 'implicit',  // El flujo de login que estás usando
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
