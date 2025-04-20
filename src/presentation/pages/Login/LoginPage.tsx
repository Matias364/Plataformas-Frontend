//Pagina de login
import React, { useState } from 'react';
import './LoginPage.css';
import LoginButton from '../../components/LoginButton/LoginButton';
import { AuthUseCase } from '../../../application/auth/AuthUseCase';
import { GoogleAuthService } from '../../../infrastructure/services/GoogleAuthService';
import { UserRole } from '../../../domain/user/UserRole';
import { TeacherType } from '../../../domain/user/TeacherType';

const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showTeacherTypes, setShowTeacherTypes] = useState(false);
  const authService = new GoogleAuthService();
  const authUseCase = new AuthUseCase(authService);

  const handleStudentLogin = async () => {
    setIsLoading(true);
    try {
      const response = await authUseCase.loginWithGoogle(UserRole.ESTUDIANTE);
      if (response.success && response.user) {
        alert(`Inicio sesión como estudiante: ${response.user.name}`);
        // Aquí redirigirías al estudiante a su página
      } else {
        alert(`Error de inicio de sesión: ${response.error}`);
      }
    } catch (error) {
      alert('Ocurrió un error durante el inicio de sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTeacherLogin = async (teacherType: TeacherType) => {
    setIsLoading(true);
    try {
      const response = await authUseCase.loginWithGoogle(UserRole.DOCENTE, teacherType);
      if (response.success && response.user) {
        alert(`Inicio sesión como docente (${teacherType}): ${response.user.name}`);
        // Aquí redirigirías según el tipo de docente
      } else {
        alert(`Error de inicio de sesión: ${response.error}`);
      }
    } catch (error) {
      alert('Ocurrió un error durante el inicio de sesión');
    } finally {
      setIsLoading(false);
      setShowTeacherTypes(false);
    }
  };

  const showTeacherOptions = () => {
    setShowTeacherTypes(true);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img 
          src="/src/presentation/assets/logo_ucn.png" 
          alt="Universidad Católica del Norte" 
          className="ucn-logo"
        />
        <h2>Inicio de sesión</h2>
        
        <div className="login-buttons">
          {!showTeacherTypes ? (
            <>
              <LoginButton 
                onClick={showTeacherOptions} 
                label="Continuar con Acceso Docente"
                disabled={isLoading}
              />
              <LoginButton 
                onClick={handleStudentLogin} 
                label="Continuar con Acceso Estudiante"
                disabled={isLoading}
              />
            </>
          ) : (
            <>
              <h3>Seleccione tipo de docente</h3>
              <LoginButton 
                onClick={() => handleTeacherLogin(TeacherType.COORDINADOR_ECOE)} 
                label="Coordinador ECOE"
                disabled={isLoading}
              />
              <LoginButton 
                onClick={() => handleTeacherLogin(TeacherType.COORDINADOR_ASIGNATURA)} 
                label="Coordinador de Asignatura"
                disabled={isLoading}
              />
              <LoginButton 
                onClick={() => handleTeacherLogin(TeacherType.JEFE_CARRERA)} 
                label="Jefe de Carrera"
                disabled={isLoading}
              />
              <button 
                className="back-button" 
                onClick={() => setShowTeacherTypes(false)}
                disabled={isLoading}
              >
                Volver
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;