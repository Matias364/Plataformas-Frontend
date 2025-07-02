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
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  CircularProgress,
  Checkbox
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
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
  enrollmentId: string; // Agregar el ID del enrollment para poder eliminarlo
}

interface NotEnrolledStudent {
  id: string;
  rut: string;
  fullname: string;
  email: string;
}

const StudentsTeacherSubject = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [students, setStudents] = useState<StudentInfo[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para el modal de agregar estudiantes
  const [openModal, setOpenModal] = useState(false);
  const [notEnrolledStudents, setNotEnrolledStudents] = useState<NotEnrolledStudent[]>([]);
  const [loadingNotEnrolled, setLoadingNotEnrolled] = useState(false);
  const [selectedStudentsToAdd, setSelectedStudentsToAdd] = useState<Set<string>>(new Set());
  const [modalSearchTerm, setModalSearchTerm] = useState('');

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
        console.log('Enrollments response:', enrollments); 
        console.log("asignatura elegida:", selectedCourse.subject.id);
        // 2. Obtener info de cada estudiante
        const studentsData: StudentInfo[] = await Promise.all(
          (enrollments || []).map(async (enrollment: any) => {
            const studentId = enrollment.student?.id;
            const grade = enrollment.grade;
            const enrollmentId = enrollment.id; // Obtener el ID del enrollment
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
              is_active: enrollment.is_approved !== undefined ? enrollment.is_approved : true,
              enrollmentId: enrollmentId, // Incluir el ID del enrollment
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

  // Filtrar estudiantes basado en el término de búsqueda
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rut.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtrar estudiantes no inscritos para el modal
  const filteredNotEnrolledStudents = notEnrolledStudents.filter(student =>
    student.fullname.toLowerCase().includes(modalSearchTerm.toLowerCase()) ||
    student.rut.toLowerCase().includes(modalSearchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(modalSearchTerm.toLowerCase())
  );

  // Función para obtener estudiantes no inscritos
  const fetchNotEnrolledStudents = async () => {
    if (!selectedCourse?.subject.id) return;
    
    console.log('Fetching not enrolled students for subject:', selectedCourse.subject.id);
    setLoadingNotEnrolled(true);
    try {
      const accessToken = localStorage.getItem('access_token');
      
      // 1. Obtener la lista básica de estudiantes no inscritos
      const response = await fetch(
        `http://localhost:3001/api/v1/students/subjects/${selectedCourse.subject.id}/not-enrolled-or-not-approved`,
        {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }
      );
      const basicStudentsList = await response.json();
      console.log('Basic students list response:', basicStudentsList);
      console.log('Number of not enrolled students found:', basicStudentsList?.length || 0);
      
      // 2. Obtener información completa de cada estudiante
      const completeStudentsData: NotEnrolledStudent[] = await Promise.all(
        (basicStudentsList || []).map(async (basicStudent: any) => {
          const studentId = basicStudent.id;
          if (!studentId) return null;
          
          try {
            const studentDetailResponse = await fetch(
              `http://localhost:3001/api/v1/students/${studentId}`,
              {
                headers: { 'Authorization': `Bearer ${accessToken}` }
              }
            );
            const studentDetail = await studentDetailResponse.json();
            
            return {
              id: studentDetail.id || studentId,
              rut: studentDetail.rut || 'Sin RUT',
              fullname: studentDetail.fullname || 'Sin nombre',
              email: studentDetail.email || 'Sin email',
            };
          } catch (error) {
            console.error(`Error fetching details for student ${studentId}:`, error);
            // Retornar datos básicos si falla la llamada detallada
            return {
              id: studentId,
              rut: basicStudent.rut || 'Sin RUT',
              fullname: basicStudent.fullname || 'Sin nombre',
              email: basicStudent.email || 'Sin email',
            };
          }
        })
      );
      
      const filteredData = completeStudentsData.filter(Boolean);
      console.log('Final students data to display:', filteredData);
      setNotEnrolledStudents(filteredData);
    } catch (error) {
      console.error('Error fetching not enrolled students:', error);
      setNotEnrolledStudents([]);
    } finally {
      setLoadingNotEnrolled(false);
    }
  };

  // Función para abrir el modal
  const handleOpenModal = () => {
    setOpenModal(true);
    // Limpiar lista anterior y obtener datos frescos del servidor
    setNotEnrolledStudents([]);
    setSelectedStudentsToAdd(new Set());
    setModalSearchTerm('');
    fetchNotEnrolledStudents();
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedStudentsToAdd(new Set());
    setModalSearchTerm('');
    // Limpiar la lista de estudiantes no inscritos para forzar recarga la próxima vez
    setNotEnrolledStudents([]);
  };

  // Función para manejar selección de estudiantes
  const handleStudentSelection = (studentId: string) => {
    setSelectedStudentsToAdd(prev => {
      const newSet = new Set(prev);
      if (newSet.has(studentId)) {
        newSet.delete(studentId);
      } else {
        newSet.add(studentId);
      }
      return newSet;
    });
  };

  // Función para agregar estudiantes seleccionados
  const handleAddSelectedStudents = async () => {
    if (!selectedCourse || selectedStudentsToAdd.size === 0) return;

    try {
      const accessToken = localStorage.getItem('access_token');
      const selectedStudentIds = Array.from(selectedStudentsToAdd);
      
      console.log('Enrolling students:', selectedStudentIds);
      console.log('Course ID:', selectedCourse.id);

      // Enrollar cada estudiante seleccionado
      const enrollmentPromises = selectedStudentIds.map(async (studentId) => {
        const response = await fetch('http://localhost:3001/api/v1/students/enrollments', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            studentId: studentId,
            courseId: selectedCourse.id
          })
        });

        if (!response.ok) {
          throw new Error(`Error enrolling student ${studentId}: ${response.statusText}`);
        }

        return response.json();
      });

      // Esperar a que todos los enrollments se completen
      await Promise.all(enrollmentPromises);
      
      console.log('All students enrolled successfully');
      
      // Cerrar el modal
      handleCloseModal();
      
      // Recargar la lista de estudiantes para mostrar los nuevos enrollments
      await refreshStudentsList();
      
    } catch (error) {
      console.error('Error enrolling students:', error);
      alert('Error al inscribir estudiantes. Por favor, intenta nuevamente.');
    }
  };

  // Función para eliminar un estudiante del curso
  const handleRemoveStudent = async (enrollmentId: string, studentName: string) => {
    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar a ${studentName} del curso?`
    );
    
    if (!confirmDelete) return;

    try {
      const accessToken = localStorage.getItem('access_token');
      
      console.log('Removing enrollment:', enrollmentId);
      
      const response = await fetch(`http://localhost:3001/api/v1/students/enrollments/${enrollmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      });

      if (!response.ok) {
        throw new Error(`Error removing student: ${response.statusText}`);
      }

      console.log('Student removed successfully');
      
      // Recargar la lista de estudiantes
      await refreshStudentsList();
      
    } catch (error) {
      console.error('Error removing student:', error);
      alert('Error al eliminar estudiante. Por favor, intenta nuevamente.');
    }
  };

  // Función para refrescar la lista de estudiantes (extraída para reutilizar)
  const refreshStudentsList = async () => {
    if (!selectedCourse) return;
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
          const grade = enrollment.grade;
          const enrollmentId = enrollment.id;
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
            grade: grade,
            is_active: enrollment.is_approved !== undefined ? enrollment.is_approved : true,
            enrollmentId: enrollmentId,
          };
        })
      );
      setStudents(studentsData.filter(Boolean));
    } catch (error) {
      console.error('Error refreshing students list:', error);
    } finally {
      setLoadingStudents(false);
    }
  };

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
                  {`${course.subject.name} | Semestre: ${course.semester} | Año: ${course.year}`}
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
          {selectedCourse?.subject.name || 'Seleccione un curso'}
        </Typography>
        <Typography color="text.secondary" fontSize={15} mb={2}>
          Lista de estudiantes
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <TextField
            size="small"
            placeholder="Buscar estudiantes por nombre o RUT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: '#BDBDBD' }} />,
              sx: { bgcolor: '#FAFAFA', borderRadius: 2 },
            }}
            sx={{
              width: 340,
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E0E0E0' },
            }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500,
              bgcolor: '#1976D2',
              color: '#fff',
              px: 3,
              py: 1,
              '&:hover': {
                bgcolor: '#1565C0',
              },
            }}
            onClick={handleOpenModal}
            disabled={!selectedCourse}
          >
            Agregar estudiante
          </Button>
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
              ) : filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    {searchTerm ? 'No se encontraron estudiantes que coincidan con la búsqueda.' : 'No hay estudiantes inscritos en este curso.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student, index) => (
                  <TableRow key={student.id || index} hover>
                    <TableCell>{student.rut}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.grade === 0 ? 'N/A' : student.grade}</TableCell>
                    <TableCell>
                      <Chip
                        label={
                          student.grade === 0 
                            ? 'No evaluado' 
                            : student.grade >= 4 
                              ? 'Aprobado' 
                              : 'Reprobado'
                        }
                        sx={{
                          bgcolor: 
                            student.grade === 0 
                              ? '#F0F0F0' 
                              : student.grade >= 4 
                                ? '#E8F8F2' 
                                : '#FFEBEE',
                          color: 
                            student.grade === 0 
                              ? '#666' 
                              : student.grade >= 4 
                                ? '#2ECC71' 
                                : '#F44336',
                          fontWeight: 500,
                          fontSize: 15,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        startIcon={<DeleteOutlineIcon />}
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 500,
                          bgcolor: '#fff',
                          borderColor: '#FF6B6B',
                          color: '#FF6B6B',
                          px: 2,
                          '&:hover': {
                            bgcolor: '#FF6B6B',
                            color: '#fff',
                            borderColor: '#FF6B6B',
                          },
                        }}
                        onClick={() => handleRemoveStudent(student.enrollmentId, student.name)}
                      >
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Modal para agregar estudiantes */}
      <Dialog 
        open={openModal} 
        onClose={handleCloseModal} 
        maxWidth="xl" 
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: 3,
            minHeight: '70vh',
            maxHeight: '90vh'
          }
        }}
      >
        <Box sx={{ 
          bgcolor: '#f8f9fa',
          borderBottom: '1px solid #e0e0e0',
          p: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <Box>
            <Typography variant="h5" fontWeight={600} color="#333" mb={1}>
              Agregar Estudiantes al Curso
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {selectedCourse?.subject.name} - Semestre {selectedCourse?.semester} {selectedCourse?.year}
            </Typography>
          </Box>
          <IconButton 
            onClick={handleCloseModal}
            sx={{ 
              color: '#666',
              '&:hover': {
                bgcolor: '#e0e0e0',
                color: '#333'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        
        <DialogContent sx={{ p: 4, bgcolor: '#fff' }}>
          {/* Barra de búsqueda */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              size="medium"
              placeholder="Buscar estudiantes por nombre, RUT o email..."
              value={modalSearchTerm}
              onChange={(e) => setModalSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 2, color: '#666' }} />,
                sx: { 
                  bgcolor: '#f8f9fa', 
                  borderRadius: 2,
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: '1px solid #e0e0e0',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    border: '1px solid #1976d2',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    border: '2px solid #1976d2',
                  }
                },
              }}
            />
          </Box>

          {/* Contador de resultados */}
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {filteredNotEnrolledStudents.length} estudiante{filteredNotEnrolledStudents.length !== 1 ? 's' : ''} 
              {modalSearchTerm && ' encontrado' + (filteredNotEnrolledStudents.length !== 1 ? 's' : '')}
            </Typography>
            {selectedStudentsToAdd.size > 0 && (
              <Chip 
                label={`${selectedStudentsToAdd.size} seleccionado${selectedStudentsToAdd.size !== 1 ? 's' : ''}`}
                variant="outlined"
                color="primary"
                sx={{ fontWeight: 500 }}
              />
            )}
          </Box>

          {loadingNotEnrolled ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
              <CircularProgress size={40} sx={{ mb: 2 }} />
              <Typography color="text.secondary">Cargando estudiantes disponibles...</Typography>
            </Box>
          ) : filteredNotEnrolledStudents.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8, bgcolor: '#f8f9fa', borderRadius: 2, border: '1px dashed #ccc' }}>
              <Typography variant="h6" color="text.secondary" mb={1}>
                {modalSearchTerm ? 'No se encontraron estudiantes' : 'No hay estudiantes disponibles'}
              </Typography>
              <Typography color="text.secondary">
                {modalSearchTerm 
                  ? 'Intenta con otro término de búsqueda' 
                  : 'Todos los estudiantes ya están inscritos en este curso'
                }
              </Typography>
            </Box>
          ) : (
            <Card variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <TableContainer sx={{ maxHeight: '50vh' }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell 
                        sx={{ 
                          bgcolor: '#f8f9fa', 
                          fontWeight: 600, 
                          width: '100px', 
                          textAlign: 'center',
                          borderBottom: '1px solid #e0e0e0',
                          py: 2
                        }}
                      >
                        Seleccionar
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          bgcolor: '#f8f9fa', 
                          fontWeight: 600, 
                          width: '160px',
                          borderBottom: '1px solid #e0e0e0',
                          py: 2
                        }}
                      >
                        RUT
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          bgcolor: '#f8f9fa', 
                          fontWeight: 600, 
                          borderBottom: '1px solid #e0e0e0',
                          py: 2,
                          minWidth: '300px'
                        }}
                      >
                        Nombre Completo
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          bgcolor: '#f8f9fa', 
                          fontWeight: 600, 
                          width: '280px',
                          borderBottom: '1px solid #e0e0e0',
                          py: 2
                        }}
                      >
                        Email
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredNotEnrolledStudents.map((student, index) => (
                      <TableRow 
                        key={student.id} 
                        hover
                        sx={{
                          '&:hover': {
                            bgcolor: '#f5f5f5',
                          },
                          bgcolor: index % 2 === 0 ? '#fff' : '#fafafa'
                        }}
                      >
                        <TableCell sx={{ textAlign: 'center', py: 2.5, px: 2 }}>
                          <Checkbox
                            checked={selectedStudentsToAdd.has(student.id)}
                            onChange={() => handleStudentSelection(student.id)}
                            sx={{
                              color: '#666',
                              '&.Mui-checked': {
                                color: '#1976d2',
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ py: 2.5, px: 2, fontWeight: 500, fontSize: 14 }}>
                          {student.rut}
                        </TableCell>
                        <TableCell sx={{ py: 2.5, px: 2, fontSize: 14 }}>
                          {student.fullname}
                        </TableCell>
                        <TableCell sx={{ py: 2.5, px: 2, color: 'text.secondary', fontSize: 14 }}>
                          {student.email}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          )}
        </DialogContent>
        
        <DialogActions sx={{ 
          p: 3, 
          bgcolor: '#f8f9fa', 
          borderTop: '1px solid #e0e0e0',
          gap: 2
        }}>
          <Button 
            onClick={handleCloseModal}
            variant="outlined"
            size="large"
            sx={{ 
              textTransform: 'none',
              borderRadius: 2,
              px: 3,
              color: '#666',
              borderColor: '#ccc',
              '&:hover': {
                borderColor: '#999',
                bgcolor: '#f5f5f5'
              }
            }}
          >
            Cancelar
          </Button>
          <Button 
            variant="contained"
            size="large"
            onClick={handleAddSelectedStudents}
            disabled={selectedStudentsToAdd.size === 0}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              px: 3,
              bgcolor: '#1976d2',
              '&:hover': {
                bgcolor: '#1565c0',
              },
              '&:disabled': {
                bgcolor: '#e0e0e0',
                color: '#999'
              }
            }}
          >
            Agregar {selectedStudentsToAdd.size > 0 && `(${selectedStudentsToAdd.size})`}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentsTeacherSubject;