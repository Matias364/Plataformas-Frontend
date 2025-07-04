import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  IconButton,
  TextField,
  CircularProgress,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Course } from '../../../domain/course/Course';
import { CourseService } from '../../../infrastructure/services/CourseService';

interface StudentInfo {
  id: string;
  rut: string;
  name: string;
  email: string;
  existingGrade?: number;
  enrollmentId: string;
}

// Genera las notas de 1.0 a 7.0 con paso de 0.1
const notas = Array.from({ length: 61 }, (_, i) => (1 + i * 0.1).toFixed(1));

interface StudentGradesModalProps {
  open: boolean;
  onClose: () => void;
}

function StudentGradesModal({ open, onClose }: StudentGradesModalProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingSendGrades, setLoadingSendGrades] = useState(false);
  const [grades, setGrades] = useState<Array<{ id: string; rut: string; name: string; email: string; grade: string; existingGrade?: number; enrollmentId: string }>>([]);

  // Cargar cursos del docente al abrir el modal
  useEffect(() => {
    if (open) {
      const fetchCourses = async () => {
        setLoadingCourses(true);
        try {
          const courseService = new CourseService();
          const teacherCourses = await courseService.getTeacherCourses();
          setCourses(teacherCourses);
          if (teacherCourses.length > 0) {
            setSelectedCourse(teacherCourses[0]);
          }
        } catch (error) {
          console.error('Error fetching courses:', error);
          setCourses([]);
        } finally {
          setLoadingCourses(false);
        }
      };
      fetchCourses();
    }
  }, [open]);

  // Cargar estudiantes cuando cambie el curso seleccionado
  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedCourse) {
        setGrades([]);
        return;
      }
      setLoadingStudents(true);
      try {
        const accessToken = localStorage.getItem('access_token');
        const enrollmentsRes = await fetch(`http://localhost:3001/api/v1/courses/${selectedCourse.id}/enrollments`, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        const enrollments = await enrollmentsRes.json();

        const studentsData: StudentInfo[] = await Promise.all(
          (enrollments || []).map(async (enrollment: any) => {
            const studentId = enrollment.student?.id;
            const existingGrade = enrollment.grade; // Obtener la nota existente del enrollment
            const enrollmentId = enrollment.id; // Obtener el enrollmentId
            if (!studentId) return null;
            const studentRes = await fetch(`http://localhost:3001/api/v1/students/${studentId}`, {
              headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            const student = await studentRes.json();
            return {
              id: student.id || studentId,
              rut: student.rut,
              name: student.fullname || 'Sin nombre',
              email: student.email,
              existingGrade: existingGrade, // Agregar la nota existente
              enrollmentId: enrollmentId, // Agregar el enrollmentId
            };
          })
        );
        const filteredStudents = studentsData.filter(Boolean) as StudentInfo[];
        setGrades(filteredStudents.map(s => ({ 
          ...s, 
          grade: s.existingGrade && s.existingGrade > 0 ? s.existingGrade.toString() : '',
          existingGrade: s.existingGrade,
          enrollmentId: s.enrollmentId
        })));
      } catch (error) {
        console.error('Error fetching students:', error);
        setGrades([]);
      } finally {
        setLoadingStudents(false);
      }
    };
    fetchStudents();
  }, [selectedCourse]);

  const handleGradeChange = (idx: number, value: string) => {
    const newGrades = [...grades];
    newGrades[idx].grade = value;
    setGrades(newGrades);
  };

  const handleSend = async () => {
    setLoadingSendGrades(true);
    try {
      const accessToken = localStorage.getItem('access_token');
      
      // Filtrar solo los estudiantes que tienen nota asignada
      const studentsWithGrades = grades.filter(student => student.grade && student.grade !== '');
      
      if (studentsWithGrades.length === 0) {
        console.warn('No hay notas para enviar');
        setLoadingSendGrades(false);
        return;
      }

      // Enviar cada nota individualmente
      const promises = studentsWithGrades.map(async (student) => {
        const response = await fetch(`http://localhost:3001/api/v1/students/enrollments/${student.enrollmentId}`, {
          method: 'PATCH', // Cambiar a PATCH que es más común para actualizaciones parciales
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            grade: parseFloat(student.grade)
          })
        });

        if (!response.ok) {
          throw new Error(`Error al actualizar la nota de ${student.name}: ${response.statusText}`);
        }

        // Manejar respuesta vacía o no-JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return response.json();
        } else {
          // Si no hay contenido JSON, retornar un objeto simple
          return { success: true, student: student.name };
        }
      });

      await Promise.all(promises);
      
      console.log('Notas enviadas exitosamente');
      // Aquí podrías mostrar un mensaje de éxito al usuario
      alert('Notas actualizadas exitosamente');
      onClose();
    } catch (error) {
      console.error('Error enviando las notas:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
      alert('Error al actualizar las notas. Por favor, intenta de nuevo.');
    } finally {
      setLoadingSendGrades(false);
    }
  };

  const handleCourseChange = (courseId: string) => {
    const course = courses.find(c => c.id.toString() === courseId);
    setSelectedCourse(course || null);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, fontSize: 22 }}>
        Ingresar Notas de Asignatura
      </DialogTitle>
      <DialogContent>
        <Typography color="text.secondary" fontSize={15} mb={2}>
          Selecciona el curso e ingresa la nota final para cada estudiante
        </Typography>
        
        {selectedCourse && grades.length > 0 && (
          <Box sx={{ mb: 2, p: 2, bgcolor: '#F3F4F6', borderRadius: 2, border: '1px solid #E5E7EB' }}>
            <Typography fontSize={14} color="text.secondary">
              <strong>Nota:</strong> Los estudiantes con notas en verde ya tienen calificaciones registradas. 
              Puedes modificarlas si es necesario.
            </Typography>
          </Box>
        )}
        
        {/* Selector de curso */}
        <Box sx={{ mb: 3 }}>
          <TextField
            select
            size="small"
            label="Seleccionar Curso"
            value={selectedCourse?.id?.toString() || ''}
            onChange={e => handleCourseChange(e.target.value)}
            sx={{
              minWidth: 400,
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
            disabled={loadingCourses || courses.length === 0}
          >
            {loadingCourses ? (
              <option value="">Cargando cursos...</option>
            ) : courses.length === 0 ? (
              <option value="">No hay cursos asignados</option>
            ) : (
              <>
                <option value="">Seleccione un curso</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id.toString()}>
                    {`${course.subject.name} | Semestre: ${course.semester} | Año: ${course.year}`}
                  </option>
                ))}
              </>
            )}
          </TextField>
        </Box>

        {/* Tabla de estudiantes */}
        {loadingStudents ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
            <CircularProgress size={30} sx={{ mr: 2 }} />
            <Typography>Cargando estudiantes...</Typography>
          </Box>
        ) : !selectedCourse ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
            <Typography color="text.secondary">Seleccione un curso para ver los estudiantes</Typography>
          </Box>
        ) : grades.length === 0 ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
            <Typography color="text.secondary">No hay estudiantes inscritos en este curso</Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ boxShadow: 'none', borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>RUT</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Nombre</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Nota Final</TableCell>
                  
                </TableRow>
              </TableHead>
              <TableBody>
                {grades.map((student, idx) => {
                  const hasExistingGrade = student.existingGrade && student.existingGrade > 0;
                  return (
                    <TableRow key={student.id}>
                      <TableCell>{student.rut}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>
                        <Select
                          size="small"
                          value={student.grade}
                          onChange={(e) => handleGradeChange(idx, e.target.value)}
                          displayEmpty
                          sx={{ 
                            width: 90, 
                            bgcolor: hasExistingGrade ? '#E8F5E8' : '#FAFAFA', 
                            borderRadius: 1,
                            '& .MuiSelect-select': {
                              color: hasExistingGrade ? '#2E7D32' : 'inherit',
                              fontWeight: hasExistingGrade ? 600 : 'normal'
                            }
                          }}
                        >
                          <MenuItem value="">
                            <em>Nota</em>
                          </MenuItem>
                          {notas.map((nota) => (
                            <MenuItem key={nota} value={nota}>
                              {nota}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell>
                        
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" disabled={loadingSendGrades}>
          Cancelar
        </Button>
        <Button 
          onClick={handleSend} 
          variant="contained"
          disabled={!selectedCourse || grades.length === 0 || grades.every(g => !g.grade) || loadingSendGrades}
          startIcon={loadingSendGrades ? <CircularProgress size={20} /> : null}
        >
          {loadingSendGrades 
            ? 'Enviando...' 
            : grades.some(g => g.existingGrade && g.existingGrade > 0) 
              ? 'Actualizar Notas' 
              : 'Enviar Notas'
          }
        </Button>
      </DialogActions>
    </Dialog>
  );
}



const RegisterGradesSubject = () => {
  const [option, setOption] = useState('');
  const [openModal, setOpenModal] = useState(false);

  const handleOption = (value: string) => {
    setOption(value);
    if (value === 'student') setOpenModal(true);
  };

  const handleBack = () => {
    setOption('');
    setOpenModal(false);
  };

  return (
    <Box sx={{ width: '100%', mt: 3 }}>
      {/* Título fijo */}
      <Typography variant="h4" fontWeight={700} mb={2} color='black' textAlign="center">
        Ingresar Notas de Asignatura
      </Typography>

      {/* Opciones */}
      {!option && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mb: 4,
            minHeight: 350,
          }}
        >
          <Box sx={{ maxWidth: 350, width: '100%' }}>
            <Card
              onClick={() => handleOption('student')}
              sx={{
                p: 4,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                border: '2px solid #E0E0E0',
                boxShadow: 0,
                transition: 'border-color 0.2s',
                '&:hover': { borderColor: '#7C3AED', boxShadow: 2 },
              }}
            >
              <PersonIcon sx={{ fontSize: 48, color: '#7C3AED', mb: 1 }} />
              <Typography variant="h6" fontWeight={600} mb={1}>
                Por estudiante
              </Typography>
              <Typography color="text.secondary" align="center">
                Ingresa la nota final de cada estudiante manualmente.
              </Typography>
            </Card>
          </Box>
        </Box>
      )}

      {/* Modal para estudiantes */}
      {option === 'student' && (
        <StudentGradesModal open={openModal} onClose={handleBack} />
      )}

      
    </Box>
  );
};

export default RegisterGradesSubject;