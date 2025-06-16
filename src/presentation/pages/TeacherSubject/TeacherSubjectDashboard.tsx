import { useState } from 'react';
import { Box, Typography, Card, CardContent, Button, TextField} from '@mui/material';
import SidebarTeacherSubject from './SidebarTeacherSubject';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import StudentsTeacherSubject from './StudentsTeacherSubject';
import RegisterGradesSubject from './RegisterGradesSubject';
import LifeDocument from './LifeDocument';
import ECOEStatistics from './ECOEStatistics';

const mockCompetencias = [
  { nombre: "Valoracion y diagnostico", promedio: "Promedio actual" },
  { nombre: "Habilidades tecnicas", promedio: "Promedio actual" },
  { nombre: "Administracion de medicamentos", promedio: "Promedio actual" },
];

const DashboardContent = () => (
  <Box sx={{ p: { xs: 0, md: 0, marginTop: 32 }, width: '100%' }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <Box>
        <Typography variant="h4" fontWeight={700} mb={0.5} color='black'>
          Panel de Coordinador de Asignatura
        </Typography>
        <Typography color="text.secondary" fontSize={15}>
          Gestion de asignaturas y evaluacion de competencias
        </Typography>
      </Box>
      <TextField
        select
        size="small"
        value="ENF-301 - Enfermeria Clinica"
        sx={{
          minWidth: 240,
          bgcolor: '#fff',
          borderRadius: 2,
          '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E0E0E0' },
        }}
        InputProps={{
          sx: { fontWeight: 500 }
        }}
        SelectProps={{
          native: true,
        }}
        disabled
      >
        <option value="ENF-301 - Enfermeria Clinica">ENF-301 - Enfermeria Clinica</option>
      </TextField>
    </Box>

    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 4 }}>
      <Card
        variant="outlined"
        sx={{
          flex: 1,
          borderRadius: 3,
          boxShadow: 0,
          borderColor: '#ECECEC',
          minWidth: 320,
        }}
      >
        <CardContent>
          <Typography fontWeight={600} mb={1}>Asignatura</Typography>
          <Typography variant="h6" fontWeight={700}>Enfermeria Clinica</Typography>
          <Typography color="text.secondary" fontSize={15} mb={2}>
            Codigo: ENF-301 | Semestre: 5to
          </Typography>
          
        </CardContent>
      </Card>
      <Card
        variant="outlined"
        sx={{
          flex: 1,
          borderRadius: 3,
          boxShadow: 0,
          borderColor: '#ECECEC',
          minWidth: 320,
        }}
      >
        <CardContent>
          <Typography fontWeight={600} mb={1}>Estudiantes</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h4" fontWeight={700}>32</Typography>
            <PeopleAltOutlinedIcon sx={{ color: '#7C3AED', fontSize: 32 }} />
          </Box>
          <Typography color="text.secondary" fontSize={15} mb={2}>
            Estudiantes matriculados en la asignatura
          </Typography>
          <Button
            variant="outlined"
            sx={{
              borderRadius: 2,
              borderColor: '#E0E0E0',
              textTransform: 'none',
              fontWeight: 500,
              width: '100%',
              py: 1.2,
            }}
          >
            Ver Estudiantes
          </Button>
        </CardContent>
      </Card>
    </Box>

    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        boxShadow: 0,
        borderColor: '#ECECEC',
        mb: 2,
        p: 2,
        bgcolor: '#fff',
      }}
    >
      <Typography variant="h6" fontWeight={700} mb={0.5}>
        Competencias Evaluadas
      </Typography>
      <Typography color="text.secondary" fontSize={15} mb={2}>
        Competencias relacionadas con la asignatura Enfermeria Clinica
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {mockCompetencias.map((comp, idx) => (
          <Card
            key={idx}
            variant="outlined"
            sx={{
              borderRadius: 2,
              boxShadow: 0,
              borderColor: '#ECECEC',
              bgcolor: '#FAFAFA',
              px: 3,
              py: 2,
            }}
          >
            <Typography fontWeight={600}>{comp.nombre}</Typography>
            <Typography color="text.secondary" fontSize={15}>
              {comp.promedio}
            </Typography>
          </Card>
        ))}
      </Box>
    </Card>
  </Box>
);

const TeacherSubjectDashboard = () => {
  const [selected, setSelected] = useState(0);

  const renderContent = () => {
    switch (selected) {
      case 0:
        return <DashboardContent />;
      case 1:
        return <StudentsTeacherSubject />;
      case 2:
        return <RegisterGradesSubject/>;
      case 3:
        return <LifeDocument/>;
      case 4:
        return <ECOEStatistics/>;
      // Puedes agregar más casos para otras secciones
      default:
        
        return <DashboardContent />;
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: "#FAFAFA" }}>
      <SidebarTeacherSubject
        selected={selected}
        onSelect={setSelected}
        onLogout={() => alert('Cerrar sesión')}
      />
      <Box
        sx={{
          flexGrow: 1,
          ml: { xs: 0, md: '240px' },
          width: '100%',
          maxWidth: 1240,
          mx: 'auto',
          px: { xs: 1.5, md: 4 },
          transition: 'margin-left 0.3s',
        }}
      >
        {renderContent()}
      </Box>
    </Box>
  );
};

export default TeacherSubjectDashboard;