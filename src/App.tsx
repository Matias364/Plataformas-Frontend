import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardStudent from './presentation/pages/Student/dashboardStudent';
import PerformanceStudent from './presentation/pages/Student/performanceStudent';
import LoginPage from './presentation/pages/Login/LoginPage';
import ProtectedRoute from './presentation/components/ProtectedRoute';
import TeacherEcoeMainPage from './presentation/pages/TeacherECOE/MainPageTeacherEcoe';
import StudentLayout from './presentation/pages/Student/StudentLayout';

function App() {
  return (
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
          path='/docente-ecoe'
          element={
              <TeacherEcoeMainPage />
          }
          />
          <Route
            element={
              <ProtectedRoute >
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route path='/perfil' element={<DashboardStudent />} />
            <Route path='/rendimiento' element={<PerformanceStudent />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
  );
}

export default App;