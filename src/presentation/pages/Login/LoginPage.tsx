import React, { useState } from 'react';
import './LoginPage.css';
import { UserRole } from '../../../domain/user/UserRole';
import GoogleLoginButton from '../../components/GoogleLoginButton/GoogleLoginButton';
import axios from 'axios';
import { saveToStorage } from '../../../storage/storage';

const LoginPage: React.FC = () => {
  const [showTeacherTypes, setShowTeacherTypes] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  const [showAdminForm, setShowAdminForm] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    try {
      const response = await axios.post('/api/auth/login-local', {
        email: adminEmail,
        password: adminPassword,
      });
      const { accessToken, refreshToken } = response.data;
      saveToStorage('access_token', accessToken);
      saveToStorage('refresh_token', refreshToken);
      // window.location.href = '/';
    } catch (error: any) {
      setAdminError('Credenciales inválidas');
    }
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

        {!showTeacherTypes ? (
          <>
            {!showAdminForm ? (
              <div className="login-buttons">
                <button
                  className="back-button"
                  style={{ marginBottom: 16 }}
                  onClick={() => setShowAdminForm(true)}
                >
                  Acceso Administrador
                </button>
                <GoogleLoginButton 
                  userType={UserRole.ESTUDIANTE}
                  label="Acceso Estudiante"
                />
                <button 
                  className="back-button" 
                  style={{ marginTop: 16 }}
                  onClick={() => setShowTeacherTypes(true)}
                >
                  Acceso Docente
                </button>
              </div>
            ) : (
              <form onSubmit={handleAdminLogin} className="admin-login-form" style={{ marginBottom: 24 }}>
                <h3>Administrador Local</h3>
                <input
                  type="email"
                  placeholder="Correo"
                  value={adminEmail}
                  onChange={e => setAdminEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                  required
                />
                <button type="submit" className="back-button">
                  Ingresar
                </button>
                {adminError && <div className="error-message">{adminError}</div>}
                <button
                  type="button"
                  className="back-button"
                  style={{ marginTop: 16 }}
                  onClick={() => setShowAdminForm(false)}
                >
                  Volver
                </button>
              </form>
            )}
          </>
        ) : (
          <div className="login-buttons">
            <h3>Seleccione tipo de docente</h3>
            <GoogleLoginButton 
              userType={UserRole.DOCENTE_ECOE}
              label="Acceso Coordinador ECOE"
            />
            <GoogleLoginButton 
              userType={UserRole.DOCENTE_ASIGNATURA}
              label="Acceso Coordinador Asignatura"
            />
            <button 
              className="back-button" 
              style={{ marginTop: 16 }}
              onClick={() => setShowTeacherTypes(false)}
            >
              Volver
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;