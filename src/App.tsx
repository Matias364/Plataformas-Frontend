import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardStudent from './presentation/pages/Student/dashboardStudent';
import PerformanceStudent from './presentation/pages/Student/performanceStudent';
import LoginPage from './presentation/pages/Login/LoginPage';
import ProtectedRoute from './presentation/components/ProtectedRoute';
//import TeacherEcoeMainPage from './presentation/pages/TeacherECOE/MainPageTeacherEcoe';
import StudentLayout from './presentation/pages/Student/StudentLayout';
import TeacherSubjectDashboard from './presentation/pages/TeacherSubject/TeacherSubjectDashboard';
import EcoeLayout from './presentation/pages/TeacherECOE/EcoeLayout';
import EcoeCycleSelectorPage from './presentation/pages/TeacherECOE/EcoeCycleSelector';
import EcoesCyclePage from './presentation/pages/TeacherECOE/EcoesCyclePage';

function App() {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
                path="/docente-ecoe/ecoes/*"
                element={
                    <ProtectedRoute allowedRoles={['docente_ecoe']}>
                        <EcoeLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<EcoeCycleSelectorPage />} />
                {/* Rutas hijas anidadas bajo /docente-ecoe/ecoes/ */}
                <Route path=":cycle" element={<EcoesCyclePage />} />
            </Route>
            <Route
                path='/docente-asignatura'
                element={
                    <ProtectedRoute allowedRoles={['docente_asignatura']}>
                        <TeacherSubjectDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                element={
                    <ProtectedRoute allowedRoles={['estudiante']}>
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