// GoogleLoginButton.tsx
import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { AuthUseCase } from '../../../application/auth/AuthUseCase';
import { GoogleAuthService } from '../../../infrastructure/services/GoogleAuthService';
import { UserRole } from '../../../domain/user/UserRole';
import { TeacherType } from '../../../domain/user/TeacherType';

interface GoogleLoginButtonProps {
  userType: UserRole;
  teacherType?: TeacherType;
  onSuccess?: () => void;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ userType, teacherType, onSuccess }) => {
  const authService = new GoogleAuthService();
  const authUseCase = new AuthUseCase(authService);

  const handleLoginSuccess = async (credentialResponse: any) => {
    const token = credentialResponse.credential;
    if (!token) {
      alert("Token de Google no recibido.");
      return;
    }

    try {
      const response = await authUseCase.loginWithGoogle(userType, teacherType, token);
      if (response.success) {
        alert(`Bienvenido, ${response.user?.name}`);
        if (onSuccess) onSuccess();
      } else {
        alert(`Error: ${response.error}`);
      }
    } catch (error) {
      alert("Error durante la autenticación");
      console.error(error);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleLoginSuccess}
      onError={() => alert('Falló el login con Google')}
      useOneTap={false}
    />
  );
};

export default GoogleLoginButton;
