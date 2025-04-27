// LoginPage.tsx
import React, { useState } from 'react';
import './LoginPage.css';
import { UserRole } from '../../../domain/user/UserRole';
import { TeacherType } from '../../../domain/user/TeacherType';
import GoogleLoginButton from '../../components/GoogleLoginButton/GoogleLoginButton';

const LoginPage: React.FC = () => {
  const [showTeacherTypes, setShowTeacherTypes] = useState(false);

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
              <GoogleLoginButton 
                userType={UserRole.ESTUDIANTE}
                label="Acceso Estudiante"
              />
              <button 
                className="back-button" 
                onClick={() => setShowTeacherTypes(true)}
              >
                Acceso Docente
              </button>
            </>
          ) : (
            <>
              <h3>Seleccione tipo de docente</h3>
              <GoogleLoginButton 
                userType={UserRole.DOCENTE}
                teacherType={TeacherType.COORDINADOR_ECOE}
                label="Acceso Coordinador ECOE"
              />
              <GoogleLoginButton 
                userType={UserRole.DOCENTE}
                teacherType={TeacherType.COORDINADOR_ASIGNATURA}
                label="Acceso Coordinador Asignatura"
              />
              <GoogleLoginButton 
                userType={UserRole.DOCENTE}
                teacherType={TeacherType.JEFE_CARRERA}
                label="Acceso Jefe de Carrera"
              />
              <button 
                className="back-button" 
                onClick={() => setShowTeacherTypes(false)}
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
