import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import SidebarProgramDirector from './SidebarProgramDirector';
import { useLocation } from 'react-router-dom';
import ProgramDirectorStudents from './ProgramDirectorStudents';
import ProgramDirectorResultsEcoe from './ProgramDirectorResultsEcoe';
import ProgramDirectorUserManagement from './ProgramDirectorUserManagement';
import ProgramDirectorSubjectsManagement from './ProgramDirectorSubjectsManagement';
import ECOEStatisticsV2 from '../TeacherECOE/ECOEStatisticsV2';
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
  <Box sx={{ height: { xs: 250, sm: 300, md: 350 }, width: '100%' }}>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 11 }}
          interval={0}
          height={60}
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
        Estadísticas Generales
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

// Componente de contenido de Estadísticas
const EstadisticasContent: React.FC = () => (
  <Box>
    {/* Header */}
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" component="h1" fontWeight={700} color="#333">
        Estadísticas ECOE
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
        Análisis y métricas del programa ECOE
      </Typography>
    </Box>

    {/* Sección de Rendimiento General ECOE */}
    <Card sx={{ mb: 4, boxShadow: 2, width: '100%' }}>
      <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
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
          flexDirection: { xs: 'column', lg: 'row' }, 
          gap: { xs: 2, sm: 3, md: 4 },
          justifyContent: 'space-between',
          width: '100%'
        }}>
          <Box sx={{ flex: 1, minWidth: { xs: '100%', lg: 0 }, width: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', fontWeight: 600 }}>
              Ciclo Básico
            </Typography>
            <CustomBarChart data={graficoData1} />
          </Box>

          <Box sx={{ flex: 1, minWidth: { xs: '100%', lg: 0 }, width: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', fontWeight: 600 }}>
              Ciclo Profesional
            </Typography>
            <CustomBarChart data={graficoData2} />
          </Box>

          <Box sx={{ flex: 1, minWidth: { xs: '100%', lg: 0 }, width: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', fontWeight: 600 }}>
              Ciclo Final
            </Typography>
            <CustomBarChart data={graficoData3} />
          </Box>
        </Box>
      </CardContent>
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
        return <ECOEStatisticsV2 />;
      case '/director-programa/gestionar-usuarios':
        return <ProgramDirectorUserManagement />;
      case '/director-programa/gestion-asignaturas':
        return <ProgramDirectorSubjectsManagement />;
      case '/director-programa/dashboard':
        return <DashboardContent />;
      default:
        return <EstadisticasContent />;
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
          p: { xs: 2, sm: 3, md: 4 },
          ml: { xs: 0, sm: '240px' }, // Margen para la sidebar
          minHeight: '100vh',
          width: { xs: '100%', sm: 'calc(100% - 240px)' },
          maxWidth: '100%'
        }}
      >
        {renderContent()}
      </Box>
    </Box>
  );
};

export default ProgramDirectorMainLayout;
