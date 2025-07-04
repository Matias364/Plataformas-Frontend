import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import ProgramDirectorStatistics from './ProgramDirectorStatistics';
import ProgramDirectorUserManagement from './ProgramDirectorUserManagement';
import ProgramDirectorSubjectsManagement from './ProgramDirectorSubjectsManagement';

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

const ProgramDirectorLayout: React.FC = () => {
  return (
    <Routes>
      <Route path="/estadisticas" element={<ProgramDirectorStatistics />} />
      <Route path="/estudiantes" element={<EstudiantesPage />} />
      <Route path="/resultados-ecoe" element={<ResultadosEcoePage />} />
      <Route path="/gestionar-usuarios" element={<ProgramDirectorUserManagement />} />
      <Route path="/gestion-asignaturas" element={<ProgramDirectorSubjectsManagement />} />
      <Route path="/" element={<ProgramDirectorStatistics />} />
    </Routes>
  );
};

export default ProgramDirectorLayout;
