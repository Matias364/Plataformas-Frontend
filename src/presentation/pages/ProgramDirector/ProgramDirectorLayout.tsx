import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProgramDirectorDashboard from './ProgramDirectorStatistics';
import { Box } from '@mui/material';
import ProgramDirectorStatistics from './ProgramDirectorStatistics';
import ProgramDirectorUserManagement from './ProgramDirectorUserManagement';
import ECOEStatisticsV2 from '../TeacherECOE/ECOEStatisticsV2';

// Componentes placeholder para las otras rutas
const EstudiantesPage = () => (
  <Box sx={{ p: 3 }}>
    <h1>Estudiantes</h1>
    <p>Página de gestión de estudiantes - En desarrollo</p>
  </Box>
);

const ResultadosEcoePage = () => (
  <Box sx={{ p: 3 }}>
    <h1>Resultados ECOE</h1>
    <p>Página de resultados ECOE - En desarrollo</p>
  </Box>
);

const EstadisticasPage = () => (
  <Box sx={{ p: 3 }}>
    <h1>Estadísticas</h1>
    <p>Página de estadísticas - En desarrollo</p>
  </Box>
);

const GestionarUsuariosPage = () => (
  <Box sx={{ p: 3 }}>
    <h1>Gestionar Usuarios</h1>
    <p>Página de gestión de usuarios - En desarrollo</p>
  </Box>
);

const ProgramDirectorLayout: React.FC = () => {
  return (
    <Routes>
      <Route path="/estadisticas" element={<ProgramDirectorStatistics />} />
      <Route path="/estudiantes" element={<EstudiantesPage />} />
      <Route path="/resultados-ecoe" element={<ResultadosEcoePage />} />
      <Route path="/gestionar-usuarios" element={<ProgramDirectorUserManagement />} />
      <Route path="/" element={<ProgramDirectorStatistics />} />
    </Routes>
  );
};

export default ProgramDirectorLayout;
