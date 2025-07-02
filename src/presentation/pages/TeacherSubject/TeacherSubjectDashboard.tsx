import { useState, useEffect } from 'react';
import { Box, Typography, Card, TextField, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SidebarTeacherSubject from './SidebarTeacherSubject';
import StudentsTeacherSubject from './StudentsTeacherSubject';
import RegisterGradesSubject from './RegisterGradesSubject';
import LifeDocument from './LifeDocument';
import ECOEStatistics from './ECOEStatistics';
import { logout } from '../../../utils/logout';
import { useAuth } from '../../context/AuthContext';
import { Subject } from '../../../domain/course/Subject';
import { CourseService } from '../../../infrastructure/services/CourseService';

interface Competency {
  id: string;
  name: string;
  description?: string;
}

interface DashboardContentProps {
  subjects: Subject[];
  selectedSubject: Subject | null;
  onSubjectChange: (subject: Subject) => void;
  loading: boolean;
  error: string | null;
  competencies: Competency[];
  subjectDescription: string;
  loadingCompetencies: boolean;
}

const DashboardContent = ({ subjects, selectedSubject, onSubjectChange, loading, error, competencies, subjectDescription, loadingCompetencies }: DashboardContentProps) => (
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
      {loading ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CircularProgress size={20} />
          <Typography color="text.secondary">Cargando asignaturas...</Typography>
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ minWidth: 240 }}>
          {error}
        </Alert>
      ) : (
        <TextField
          select
          size="small"
          value={selectedSubject?.id?.toString() || ''}
          onChange={(e) => {
            const subject = subjects.find(s => s.id.toString() === e.target.value);
            if (subject) onSubjectChange(subject);
          }}
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
          disabled={subjects.length === 0}
        >
          {subjects.length === 0 ? (
            <option value="">No hay asignaturas asignadas</option>
          ) : (
            <>
              <option value="">Seleccione una asignatura</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id.toString()}>
                  {subject.code} - {subject.name} (Semestre {subject.semester})
                </option>
              ))}
            </>
          )}
        </TextField>
      )}
    </Box>

    {selectedSubject && (
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
          {subjectDescription}
        </Typography>
        {loadingCompetencies ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 2 }}>
            <CircularProgress size={20} />
            <Typography color="text.secondary">Cargando competencias...</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {competencies.length === 0 ? (
              <Typography color="text.secondary">No hay competencias asociadas a esta asignatura.</Typography>
            ) : (
              competencies.map((comp) => (
                <Card
                  key={comp.id}
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
                  <Typography fontWeight={600}>{comp.name}</Typography>
                  {comp.description && (
                    <Typography color="text.secondary" fontSize={15}>
                      {comp.description}
                    </Typography>
                  )}
                </Card>
              ))
            )}
          </Box>
        )}
      </Card>
    )}

    {!selectedSubject && !loading && !error && subjects.length > 0 && (
      <Card
        variant="outlined"
        sx={{
          borderRadius: 3,
          boxShadow: 0,
          borderColor: '#ECECEC',
          mb: 2,
          p: 3,
          bgcolor: '#fff',
          textAlign: 'center'
        }}
      >
        <Typography variant="h6" fontWeight={600} mb={1}>
          Seleccione una asignatura
        </Typography>
        <Typography color="text.secondary" fontSize={15}>
          Para comenzar, seleccione una asignatura del selector de arriba
        </Typography>
      </Card>
    )}
  </Box>
);

const TeacherSubjectDashboard = () => {
  const [selected, setSelected] = useState(0);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  const [subjectDescription, setSubjectDescription] = useState('');
  const [loadingCompetencies, setLoadingCompetencies] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const courseService = new CourseService();

  useEffect(() => {
    const checkUserAndLoadCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        // Verificar si el usuario está autenticado y es docente_asignatura
        if (!user) {
          navigate('/login');
          return;
        }

        if (user.role !== 'docente_asignatura') {
          setError('No tienes permisos para acceder a esta sección');
          return;
        }

        // Cargar las asignaturas del docente
        const teacherSubjects = await courseService.getSubjectTeacher();
        console.log('Teacher subjects data:', teacherSubjects);
        setSubjects(teacherSubjects);
        
        // Seleccionar automáticamente la primera asignatura si existe
        if (teacherSubjects.length > 0) {
          console.log('First subject structure:', teacherSubjects[0]);
          setSelectedSubject(teacherSubjects[0]);
        }

      } catch (err) {
        console.error('Error loading courses:', err);
        setError('Error al cargar las asignaturas. Por favor, inténtelo de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    checkUserAndLoadCourses();
  }, [user, navigate]);

  useEffect(() => {
    const fetchCompetencies = async () => {
      if (!selectedSubject) {
        setCompetencies([]);
        setSubjectDescription('');
        return;
      }
      setLoadingCompetencies(true);
      try {
        setSubjectDescription(`${selectedSubject.code} - ${selectedSubject.name} (Semestre ${selectedSubject.semester})`);
        // Usar subject.id para obtener las competencias del subject
        const data = await courseService.getSubjectCompetencies(selectedSubject.id.toString());
        // El JSON es un array de objetos con propiedad competency
        setCompetencies((Array.isArray(data) ? data : []).map((item: any) => ({
          id: item.competency?.id || item.competency?._id || item.id || item._id,
          name: item.competency?.name || item.competency?.nombre || item.name || item.nombre,
          description: item.competency?.description || item.competency?.descripcion || item.description || item.descripcion || '',
        })));
      } catch (e) {
        setCompetencies([]);
      } finally {
        setLoadingCompetencies(false);
      }
    };
    fetchCompetencies();
  }, [selectedSubject]);

  const handleSubjectChange = (subject: Subject) => {
    setSelectedSubject(subject);
    setCompetencies([]); // Limpiar competencias al cambiar
    setSubjectDescription(''); // Limpiar descripción al cambiar
  };

  const renderContent = () => {
    switch (selected) {
      case 0:
        return (
          <DashboardContent
            subjects={subjects}
            selectedSubject={selectedSubject}
            onSubjectChange={handleSubjectChange}
            loading={loading}
            error={error}
            competencies={competencies}
            subjectDescription={subjectDescription}
            loadingCompetencies={loadingCompetencies}
          />
        );
      case 1:
        return <StudentsTeacherSubject />;
      case 2:
        return <RegisterGradesSubject/>;
      case 3:
        return <LifeDocument/>;
      case 4:
        return <ECOEStatistics/>;
      default:
        return (
          <DashboardContent 
            subjects={subjects}
            selectedSubject={selectedSubject}
            onSubjectChange={handleSubjectChange}
            loading={loading}
            error={error}
            competencies={competencies}
            subjectDescription={subjectDescription}
            loadingCompetencies={loadingCompetencies}
          />
        );
    }
  };

  // Mostrar loading mientras se verifican permisos y se cargan datos iniciales
  if (loading && !user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Mostrar error si no tiene permisos
  if (error && !subjects.length && user?.role !== 'docente_asignatura') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', p: 3 }}>
        <Alert severity="error" sx={{ maxWidth: 500 }}>
          <Typography variant="h6" gutterBottom>Acceso Denegado</Typography>
          <Typography>{error}</Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: "#FAFAFA" }}>
      <SidebarTeacherSubject
        selected={selected}
        onSelect={setSelected}
        onLogout={logout}
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