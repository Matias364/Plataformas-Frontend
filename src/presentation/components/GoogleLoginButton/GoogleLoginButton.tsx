import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { AuthUseCase } from '../../../application/auth/AuthUseCase';
import { GoogleAuthService } from '../../../infrastructure/services/GoogleAuthService';
import { UserRole } from '../../../domain/user/UserRole';
import { useNavigate } from 'react-router-dom';
import User from '../../../domain/user/User';


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

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const code = tokenResponse.code
      console.log(code);

      if (!code) {
        alert("Token de Google no recibido.");
        return;
      }

      // Llamamos al método loginWithGoogle del useCase, pasándole los parámetros requeridos
      try {
        const response = await authUseCase.loginWithGoogle(userType, code);
        console.log("response: ", response.accessToken);
        if (response.success && response.accessToken) {
          const accessToken = response.accessToken;
          //console.log("role: ", response.user.role?.name);
          const userInfo = await fetch('http://localhost:3000/api/v1/auth/user-info', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          });
          const data = await userInfo.json();
          const userPayload = data.payload;
          console.log(data.payload);
          alert(`Bienvenido, ${userPayload.name}`);
          if (userPayload.role === UserRole.ESTUDIANTE) {
            console.log("onSuccess:");
            navigate("/perfil")
          };  // Callback opcional para cuando el login es exitoso
        } else {
          alert(`Error: ${response.error}`);
        }
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
