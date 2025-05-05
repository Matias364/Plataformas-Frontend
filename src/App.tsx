import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardStudent from './presentation/pages/Student/dashboardStudent';
import PerformanceStudent from './presentation/pages/Student/performanceStudent';
import LoginPage from './presentation/pages/Login/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/rendimiento" element={<PerformanceStudent />} />
        <Route path="/perfil" element={<DashboardStudent />} />
        {/* Puedes agregar más rutas aquí */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;