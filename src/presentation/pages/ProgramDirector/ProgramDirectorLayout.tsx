import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProgramDirectorDashboard from './ProgramDirectorDashboard';
import { Box } from '@mui/material';

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

const AsignacionRolesPage = () => (
  <Box sx={{ p: 3 }}>
    <h1>Asignación de Roles</h1>
    <p>Página de asignación de roles - En desarrollo</p>
  </Box>
);

const ProgramDirectorLayout: React.FC = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<ProgramDirectorDashboard />} />
      <Route path="/estudiantes" element={<EstudiantesPage />} />
      <Route path="/resultados-ecoe" element={<ResultadosEcoePage />} />
      <Route path="/estadisticas" element={<EstadisticasPage />} />
      <Route path="/asignacion-roles" element={<AsignacionRolesPage />} />
      <Route path="/" element={<ProgramDirectorDashboard />} />
    </Routes>
  );
};

export default ProgramDirectorLayout;
