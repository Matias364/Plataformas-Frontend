import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  School as SchoolIcon
} from '@mui/icons-material';

interface Subject {
  id: number;
  name: string;
  code: string;
  credits: number;
  semester: number;
  year: number;
}

interface Teacher {
  id: string;
  email: string;
  fullname: string;
  role: string;
}

interface Course {
  id: number;
  subject?: Subject;
  teacher?: Teacher;
  subjectId?: number;
  teacherUserId?: string;
  year: number;
  semester: number;
  createdAt: string;
  updatedAt: string;
}

interface CourseTableData {
  id: number;
  subjectCode: string;
  subjectName: string;
  teacherName: string;
  teacherEmail: string;
  year: number;
  semester: number;
}

// Función para transformar datos de cursos
const transformCourseData = (courses: Course[], teachers: Teacher[], subjects: Subject[]): CourseTableData[] => {
  return courses.map(course => {
    console.log('Procesando curso:', course); // Debug para ver cada curso
    
    // Si no hay datos del teacher en la respuesta, buscar en la lista local
    let teacherData = course.teacher;
    if (!teacherData && course.teacherUserId) {
      teacherData = teachers.find(t => t.id === course.teacherUserId);
      console.log('Teacher encontrado localmente:', teacherData);
    }
    
    // Si no hay datos del subject en la respuesta, buscar en la lista local
    let subjectData = course.subject;
    if (!subjectData && course.subjectId) {
      subjectData = subjects.find(s => s.id === course.subjectId);
      console.log('Subject encontrado localmente:', subjectData);
    }
    
    return {
      id: course.id,
      subjectCode: subjectData?.code || 'N/A',
      subjectName: subjectData?.name || 'Sin nombre',
      teacherName: teacherData?.fullname || 'Sin asignar',
      teacherEmail: teacherData?.email || 'Sin email',
      year: course.year,
      semester: course.semester
    };
  });
};

const ProgramDirectorSubjectsManagement: React.FC = () => {
  const [courses, setCourses] = useState<CourseTableData[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [openModal, setOpenModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | ''>('');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const [modalError, setModalError] = useState('');
  
  // Success alert states
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Error alert states
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage] = useState('');

  // Función para obtener cursos de la API
  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/courses');
      
      if (!response.ok) {
        throw new Error('Error al obtener los cursos');
      }
      
      const data: Course[] = await response.json();
      console.log('Datos recibidos de la API:', data); // Debug
      
      if (!Array.isArray(data)) {
        throw new Error('Los datos recibidos no son un array');
      }
      
      const transformedCourses = transformCourseData(data, teachers, subjects);
      setCourses(transformedCourses);
    } catch (err) {
      console.error('Error al obtener cursos:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  // Función para obtener asignaturas de la API
  const fetchSubjects = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/subjects');
      
      if (!response.ok) {
        throw new Error('Error al obtener las asignaturas');
      }
      
      const data: Subject[] = await response.json();
      setSubjects(data);
    } catch (err) {
      console.error('Error al obtener asignaturas:', err);
    }
  };

  // Función para obtener profesores de la API
  const fetchTeachers = async () => {
    try {
      const response = await fetch('http://127.0.0.1:3000/api/v1/auth/users/teachers');
      
      if (!response.ok) {
        throw new Error('Error al obtener los profesores');
      }
      
      const data: Teacher[] = await response.json();
      setTeachers(data);
    } catch (err) {
      console.error('Error al obtener profesores:', err);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        await Promise.all([
          fetchCourses(),
          fetchSubjects(),
          fetchTeachers()
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Función para agregar curso
  const handleAddCourse = () => {
    setOpenModal(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedSubjectId('');
    setSelectedTeacherId('');
    setSelectedYear(2024);
    setSelectedSemester(1);
    setModalError('');
  };

  // Función para crear curso
  const handleCreateCourse = async () => {
    if (!selectedSubjectId || !selectedTeacherId) {
      setModalError('Por favor complete todos los campos obligatorios');
      return;
    }

    setModalLoading(true);
    setModalError('');
    
    try {
      console.log('Enviando datos para crear curso:', {
        subjectId: selectedSubjectId,
        teacherUserId: selectedTeacherId,
        year: selectedYear,
        semester: selectedSemester
      });

      const response = await fetch('http://localhost:3001/api/v1/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subjectId: selectedSubjectId,
          teacherUserId: selectedTeacherId,
          year: selectedYear,
          semester: selectedSemester
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error al crear curso:', errorData);
        const errorMsg = errorData.message 
          ? (Array.isArray(errorData.message) ? errorData.message[0] : errorData.message)
          : 'Error al crear el curso';
        throw new Error(errorMsg);
      }

      const createdCourse = await response.json();
      console.log('Curso creado exitosamente:', createdCourse);

      setSuccessMessage('Curso creado exitosamente');
      setShowSuccessAlert(true);
      handleCloseModal();
      
      // Recargar la lista de cursos
      await fetchCourses();
      
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'Error de conexión');
    } finally {
      setModalLoading(false);
    }
  };

  // Función para obtener el nombre del semestre
  const getSemesterName = (semester: number) => {
    return semester === 1 ? 'Primer Semestre' : 'Segundo Semestre';
  };

  // Función para obtener el color del semestre
  const getSemesterColor = (semester: number) => {
    return semester === 1 ? '#4caf50' : '#ff9800';
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3 
      }}>
        <Typography variant="h4" component="h1" fontWeight={700} color="#333">
          Gestión de Asignaturas
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddCourse}
          sx={{
            backgroundColor: '#17a2b8',
            '&:hover': {
              backgroundColor: '#138496'
            },
            textTransform: 'none'
          }}
        >
          Agregar Curso
        </Button>
      </Box>

      {/* Subtitle */}
      <Typography variant="h6" component="h2" fontWeight={600} color="#333" sx={{ mb: 3 }}>
        Coordinación de Asignaturas
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Gestione que docentes coordinan cada asignatura
      </Typography>

      {/* Panel de Cursos */}
      <Card sx={{ boxShadow: 2 }}>
        <CardContent>
          {/* Tabla de Cursos */}
          <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 600, color: '#555' }}>Código</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#555' }}>Asignatura</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#555' }}>Coordinador Actual</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#555' }}>Año</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#555' }}>Semestre</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <CircularProgress />
                      <Typography variant="body2" sx={{ mt: 2 }}>
                        Cargando cursos...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="error">
                        Error: {error}
                      </Typography>
                      <Button 
                        variant="outlined" 
                        onClick={() => window.location.reload()}
                        sx={{ mt: 2 }}
                      >
                        Reintentar
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : courses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <SchoolIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                      <Typography variant="body2" color="text.secondary">
                        No hay cursos registrados
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  courses.map((course) => (
                    <TableRow
                      key={course.id}
                      sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight={600} color="#333">
                          {course.subjectCode}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="#333">
                          {course.subjectName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight={500} color="#333">
                            {course.teacherName}
                          </Typography>
                          {course.teacherEmail !== 'Sin email' && (
                            <Typography variant="caption" color="text.secondary">
                              {course.teacherEmail}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="#666">
                          {course.year}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={getSemesterName(course.semester)}
                          size="small"
                          sx={{
                            backgroundColor: getSemesterColor(course.semester),
                            color: 'white',
                            fontWeight: 500
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Modal para agregar curso */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" component="h2" fontWeight={600}>
            Agregar Nuevo Curso
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Seleccionar Asignatura</InputLabel>
              <Select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value as number)}
                label="Seleccionar Asignatura"
              >
                {subjects.map((subject) => (
                  <MenuItem key={subject.id} value={subject.id}>
                    {subject.code} - {subject.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Seleccionar Profesor</InputLabel>
              <Select
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                label="Seleccionar Profesor"
              >
                {teachers.map((teacher) => (
                  <MenuItem key={teacher.id} value={teacher.id}>
                    {teacher.fullname} ({teacher.email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Año</InputLabel>
              <Select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value as number)}
                label="Año"
              >
                <MenuItem value={2024}>2024</MenuItem>
                <MenuItem value={2025}>2025</MenuItem>
                <MenuItem value={2026}>2026</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Semestre</InputLabel>
              <Select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value as number)}
                label="Semestre"
              >
                <MenuItem value={1}>Primer Semestre</MenuItem>
                <MenuItem value={2}>Segundo Semestre</MenuItem>
              </Select>
            </FormControl>

            {modalError && (
              <Alert 
                severity="error" 
                sx={{ mb: 2 }}
                onClose={() => setModalError('')}
              >
                {modalError}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Cancelar
          </Button>
          <Button 
            onClick={handleCreateCourse}
            variant="contained"
            disabled={modalLoading}
            startIcon={modalLoading ? <CircularProgress size={20} /> : null}
            sx={{
              backgroundColor: '#17a2b8',
              '&:hover': {
                backgroundColor: '#138496'
              }
            }}
          >
            {modalLoading ? 'Creando...' : 'Crear Curso'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alerta de éxito */}
      <Snackbar
        open={showSuccessAlert}
        autoHideDuration={4000}
        onClose={() => setShowSuccessAlert(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setShowSuccessAlert(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Alerta de error */}
      <Snackbar
        open={showErrorAlert}
        autoHideDuration={4000}
        onClose={() => setShowErrorAlert(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setShowErrorAlert(false)} 
          severity="error" 
          sx={{ width: '100%' }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProgramDirectorSubjectsManagement;
