import React, { useEffect, useState } from 'react';
import './LoginPage.css';
import { UserRole } from '../../../domain/user/UserRole';
import GoogleLoginButton from '../../components/GoogleLoginButton/GoogleLoginButton';
import axios from 'axios';
import { saveToStorage } from '../../../storage/storage';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LOGIN_ADMIN_URL } from '../../../constants';

const LoginPage: React.FC = () => {
  const [showTeacherTypes, setShowTeacherTypes] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [showAdminForm, setShowAdminForm] = useState(false);

  useEffect(() => {
    if (user) {
      // Redirige según el rol
      if (user.role === "estudiante") navigate("/perfil");
      if (user.role === "docente_ecoe") navigate("/docente-ecoe");
      // Agrega más roles si es necesario
    }
  }, [user, navigate]);

  if (loading || user) {
    // Puedes mostrar un spinner o simplemente nada
    return <div>Cargando...</div>;
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    try {
      const response = await axios.post(LOGIN_ADMIN_URL, {
        email: adminEmail,
        password: adminPassword,
      });
      const { accessToken, refreshToken } = response.data;
      console.log('Admin logeado');
      saveToStorage('access_token', accessToken);
      saveToStorage('refresh_token', refreshToken);
      // window.location.href = '/';
    } catch (error: any) {
      setAdminError('Credenciales inválidas');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card" style={{ maxWidth: 400, margin: "0 auto" }}>
        <img 
          src="/src/presentation/assets/logo_ucn.png" 
          alt="Universidad Católica del Norte" 
          className="ucn-logo"
        />
        <h2 style={{ textAlign: "center"}}>Acceder</h2>
        <div className="login-buttons" style={{ gap: 12, display: "flex", flexDirection: "column" }}>
          {!showTeacherTypes ? (
          <>
            <button
              type="button"
              className="back-button"
               style={{
                backgroundColor: "#e0e0e0",
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
              onClick={() => setShowTeacherTypes(true)}
            >
              <img src="/src/presentation/assets/google icon.png" alt="Google" style={{ width: 18, height: 18, marginRight: 10 }} />
              Acceso Docente
            </button>
            <GoogleLoginButton
            userType={UserRole.ESTUDIANTE}
            label="Acceso Estudiantes"
            />
          </>
        ) : (
            <>
              <GoogleLoginButton
                userType={UserRole.DOCENTE_ECOE}
                label="Acceso Docente ECOE"
              />
              <GoogleLoginButton
                userType={UserRole.DOCENTE_ASIGNATURA}
                label="Acceso Docente Asignatura"
              />
              <button
                type="button"
                style={{
                  background: "transparent",
                  color: "#1a355e",
                  border: "none",
                  textAlign: "left",
                  marginTop: -8,
                  marginBottom: 8,
                  cursor: "pointer"
                }}
                onClick={() => setShowTeacherTypes(false)}
              >
                ← Volver
              </button>
            </>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <hr style={{ flex: 1, border: "none", borderTop: "1px solid #ddd" }} />
          <span style={{ margin: "0 12px", color: "#bbb" }}>o</span>
          <hr style={{ flex: 1, border: "none", borderTop: "1px solid #ddd" }} />
        </div>
        <form onSubmit={handleAdminLogin} className="admin-login-form" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            type="email"
            placeholder="Correo electrónico"
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
          <a href="#" style={{ color: "#e5735c", fontSize: 14, marginBottom: 8, textAlign: "left" }}>
            ¿Olvidó su nombre de usuario o contraseña?
          </a>
          {adminError && <div className="error-message">{adminError}</div>}
          <button type="submit" className="back-button" style={{ background: "#e5735c", color: "#fff" }}>
            Acceder
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;