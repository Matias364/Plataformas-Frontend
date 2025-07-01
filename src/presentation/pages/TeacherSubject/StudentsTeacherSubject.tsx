import {
  Box,
  Typography,
  Card,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { useState, useEffect } from 'react';
import { Course } from '../../../domain/course/Course';
import { CourseService } from '../../../infrastructure/services/CourseService';

interface StudentInfo {
  id: string;
  rut: string;
  name: string;
  email: string;
  grade: number;
  is_active: boolean;
}

const StudentsTeacherSubject = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [students, setStudents] = useState<StudentInfo[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoadingCourses(true);
      try {
        const courseService = new CourseService();
        console.log('Calling getTeacherCourses...'); // Debug log
        const teacherCourses = await courseService.getTeacherCourses();
        console.log('Teacher courses received:', teacherCourses); // Debug log
        setCourses(teacherCourses);
        if (teacherCourses.length > 0) {
          setSelectedCourse(teacherCourses[0]);
        }
      } catch (error) {
        console.error('Error fetching courses:', error); // Debug log
        setCourses([]);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedCourse) {
        setStudents([]);
        return;
      }
      setLoadingStudents(true);
      try {
        // 1. Obtener enrollments del curso (usar selectedCourse.id, que es el id del objeto raíz, no subject.id)
        const accessToken = localStorage.getItem('access_token');
        console.log('Fetching enrollments for course ID:', selectedCourse.id); // Debug log
        const enrollmentsRes = await fetch(`http://localhost:3001/api/v1/courses/${selectedCourse.id}/enrollments`, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        const enrollments = await enrollmentsRes.json();
        console.log('Enrollments response:', enrollments); // Debug log
        // 2. Obtener info de cada estudiante
        const studentsData: StudentInfo[] = await Promise.all(
          (enrollments || []).map(async (enrollment: any) => {
            const studentId = enrollment.student?.id;
            const grade = enrollment.grade;
            if (!studentId) return null;
            const studentRes = await fetch(`http://localhost:3001/api/v1/students/${studentId}`, {
              headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            const student = await studentRes.json();
            console.log('Student data:', student); // Debug log
            return {
              id: student.id || studentId, // Usar studentId si no hay student.id
              rut: student.rut,
              name: student.fullname || 'Sin nombre', // Usar fullname del response
              email: student.email,
              grade: grade,
              is_active: student.is_active !== undefined ? student.is_active : true,
            };
          })
        );
        setStudents(studentsData.filter(Boolean));
      } catch {
        setStudents([]);
      } finally {
        setLoadingStudents(false);
      }
    };
    fetchStudents();
  }, [selectedCourse]);

  return (
    <Box sx={{ p: { xs: 0, md: 0 }, width: '100%', marginTop:4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
        <IconButton size="small" sx={{ bgcolor: '#F6F6F6' }}>
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
        <Typography variant="h4" fontWeight={700} color="black" mb={0.5}>
          Estudiantes
        </Typography>
      </Box>
      <Typography color="text.secondary" fontSize={15} mb={2}>
        Gestion de estudiantes por curso
      </Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          select
          size="small"
          value={selectedCourse?.id?.toString() || ''}
          onChange={e => {
            const course = courses.find(c => c.id.toString() === e.target.value);
            if (course) setSelectedCourse(course);
          }}
          sx={{
            minWidth: 260,
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
                  {`${course.name} | Semestre: ${course.semester} | Año: ${course.year}`}
                </option>
              ))}
            </>
          )}
        </TextField>
      </Box>

      <Card
        variant="outlined"
        sx={{
          borderRadius: 3,
          boxShadow: 0,
          borderColor: '#ECECEC',
          p: 2,
          bgcolor: '#fff',
        }}
      >
        <Typography variant="h6" fontWeight={700} mb={0.5}>
          Enfermeria Clinica
        </Typography>
        <Typography color="text.secondary" fontSize={15} mb={2}>
          Lista de estudiantes | Codigo: ENF-301 | Semestre: 5to
        </Typography>

        <Box sx={{ mb: 2 }}>
          <TextField
            size="small"
            placeholder="Buscar estudiantes."
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: '#BDBDBD' }} />,
              sx: { bgcolor: '#FAFAFA', borderRadius: 2 },
            }}
            sx={{
              width: 340,
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E0E0E0' },
            }}
          />
        </Box>

        <TableContainer component={Paper} sx={{ boxShadow: 'none', borderRadius: 2, border: '1px solid #F0F0F0' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>RUT</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Promedio</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loadingStudents ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">Cargando estudiantes...</TableCell>
                </TableRow>
              ) : students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">No hay estudiantes inscritos en este curso.</TableCell>
                </TableRow>
              ) : (
                students.map((student, index) => (
                  <TableRow key={student.id || index} hover>
                    <TableCell>{student.rut}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.grade}</TableCell>
                    <TableCell>
                      <Chip
                        label={student.is_active ? 'Activo' : 'Inactivo'}
                        sx={{
                          bgcolor: student.is_active ? '#E8F8F2' : '#F5F5F5',
                          color: student.is_active ? '#2ECC71' : '#888',
                          fontWeight: 500,
                          fontSize: 15,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        startIcon={<DescriptionOutlinedIcon />}
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 500,
                          bgcolor: '#fff',
                          borderColor: '#E0E0E0',
                          color: '#222',
                          px: 2,
                          '&:disabled': {
                            color: '#888',
                            borderColor: '#E0E0E0',
                            bgcolor: '#F5F5F5',
                          },
                        }}
                        disabled
                      >
                        Hoja de Vida
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default StudentsTeacherSubject;