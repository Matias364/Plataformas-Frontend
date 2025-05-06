import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardStudent from './presentation/pages/Student/dashboardStudent';
import PerformanceStudent from './presentation/pages/Student/performanceStudent';
import LoginPage from './presentation/pages/Login/LoginPage';
import { AuthProvider } from './presentation/context/AuthContext';
import ProtectedRoute from './presentation/components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/rendimiento"
            element={
              <ProtectedRoute>
                <PerformanceStudent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <DashboardStudent />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;