import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import SidebarProgramDirector from './SidebarProgramDirector';
import { useLocation, useNavigate } from 'react-router-dom';
import { GoogleAuthService } from '../../../infrastructure/services/GoogleAuthService';
import ProgramDirectorStudents from './ProgramDirectorStudents';
import ProgramDirectorResultsEcoe from './ProgramDirectorResultsEcoe';
import ProgramDirectorRoleAssigment from './ProgramDirectorRoleAssigment';
import { logout } from '../../../utils/logout';

// Datos de prueba para las competencias
const competenciasData = [
  { name: 'Comp 1', valor: 85 },
  { name: 'Comp 2', valor: 78 },
  { name: 'Comp 3', valor: 92 },
  { name: 'Comp 4', valor: 88 },
  { name: 'Comp 5', valor: 76 },
  { name: 'Comp 6', valor: 89 },
  { name: 'Comp 7', valor: 94 },
  { name: 'Comp 8', valor: 82 },
];

// Datos de prueba para los tres gráficos
const graficoData1 = [
  { name: 'Comp 1', valor: 85 },
  { name: 'Comp 2', valor: 78 },
  { name: 'Comp 3', valor: 92 },
  { name: 'Comp 4', valor: 88 },
  { name: 'Comp 5', valor: 76 },
  { name: 'Comp 6', valor: 89 },
  { name: 'Comp 7', valor: 94 },
  { name: 'Comp 8', valor: 82 },
];

const graficoData2 = [
  { name: 'Comp 1', valor: 88 },
  { name: 'Comp 2', valor: 82 },
  { name: 'Comp 3', valor: 95 },
  { name: 'Comp 4', valor: 90 },
  { name: 'Comp 5', valor: 79 },
  { name: 'Comp 6', valor: 86 },
  { name: 'Comp 7', valor: 91 },
  { name: 'Comp 8', valor: 87 },
];

const graficoData3 = [
  { name: 'Comp 1', valor: 83 },
  { name: 'Comp 2', valor: 80 },
  { name: 'Comp 3', valor: 88 },
  { name: 'Comp 4', valor: 85 },
  { name: 'Comp 5', valor: 77 },
  { name: 'Comp 6', valor: 91 },
  { name: 'Comp 7', valor: 89 },
  { name: 'Comp 8', valor: 84 },
];

// Colores para las competencias
const competenciaColors = [
  '#1DB584', // Comp 1 - Verde
  '#FF9500', // Comp 2 - Naranja
  '#3B82F6', // Comp 3 - Azul
  '#10B981', // Comp 4 - Verde claro
  '#F59E0B', // Comp 5 - Amarillo
  '#EF4444', // Comp 6 - Rojo
  '#06B6D4', // Comp 7 - Cyan
  '#F97316', // Comp 8 - Naranja claro
];

const CustomBarChart: React.FC<{ data: any[] }> = ({ data }) => (
  <Box sx={{ height: 300 }}>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12 }}
          interval={0}
        />
        <YAxis domain={[0, 100]} />
        <Bar 
          dataKey="valor" 
          radius={[4, 4, 0, 0]}
        >
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={competenciaColors[index]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </Box>
);

// Componente de contenido del Dashboard
const DashboardContent: React.FC = () => (
  <Box>
    {/* Header */}
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" component="h1" fontWeight={700} color="#333">
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
        Gestión y supervisión del programa ECOE
      </Typography>
    </Box>

    {/* Sección de Rendimiento General ECOE */}
    <Card sx={{ mb: 4, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h5" component="h2" fontWeight={600} sx={{ mb: 1 }}>
          Rendimiento General ECOE
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Resultados globales del último periodo de evaluación
        </Typography>

        {/* Leyenda de competencias */}
        <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {competenciasData.map((comp, index) => (
            <Box key={comp.name} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: competenciaColors[index],
                }}
              />
              <Typography variant="body2" fontSize={14}>
                {comp.name}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Grid con los tres gráficos usando Flexbox */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          gap: 3,
          justifyContent: 'space-between'
        }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <CustomBarChart data={graficoData1} />
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <CustomBarChart data={graficoData2} />
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <CustomBarChart data={graficoData3} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  </Box>
);

// Componentes placeholder para las otras páginas
const EstadisticasContent = () => (
  <Box>
    <Typography variant="h4" component="h1" fontWeight={700} color="#333" sx={{ mb: 2 }}>
      Estadísticas
    </Typography>
    <Card sx={{ p: 3 }}>
      <Typography>Página de estadísticas - En desarrollo</Typography>
    </Card>
  </Box>
);

const ProgramDirectorMainLayout: React.FC = () => {
  const location = useLocation();
  

  // Función para renderizar el contenido según la ruta
  const renderContent = () => {
    switch (location.pathname) {
      case '/director-programa/estudiantes':
        return <ProgramDirectorStudents />;
      case '/director-programa/resultados-ecoe':
        return <ProgramDirectorResultsEcoe />;
      case '/director-programa/estadisticas':
        return <EstadisticasContent />;
      case '/director-programa/asignacion-roles':
        return <ProgramDirectorRoleAssigment />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar fija */}
      <SidebarProgramDirector
        name=""
        picture=""
        role="Jefatura de Carrera"
        onLogout={logout}
      />

      {/* Contenido principal */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          bgcolor: '#f5f5f5',
          p: 3,
          ml: { xs: 0, sm: '240px' }, // Margen para la sidebar
          minHeight: '100vh'
        }}
      >
        {renderContent()}
      </Box>
    </Box>
  );
};

export default ProgramDirectorMainLayout;
