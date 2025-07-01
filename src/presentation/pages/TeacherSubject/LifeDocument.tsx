import { useState, useEffect } from 'react';
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
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Course } from '../../../domain/course/Course';
import { CourseService } from '../../../infrastructure/services/CourseService';

interface StudentInfo {
  id: string;
  rut: string;
  name: string;
  email: string;
  grade: number;
  is_active: boolean;
  enrollmentId: string; // Agregar enrollmentId como requerido
  annotations?: StudentAnnotation[]; // Agregar anotaciones
  lastAnnotationDate?: string; // Fecha de la última anotación
}

interface StudentAnnotation {
  id: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateAnnotationModalProps {
  open: boolean;
  onClose: () => void;
  student: StudentInfo | null;
  onAnnotationCreated: () => void;
}

function CreateAnnotationModal({ open, onClose, student, onAnnotationCreated }: CreateAnnotationModalProps) {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!student || !comment.trim()) return;

    setLoading(true);
    try {
      const accessToken = localStorage.getItem('access_token');
      
      // Crear la anotación
      const response = await fetch('http://localhost:3001/api/v1/students/annotations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          enrollmentId: student.enrollmentId,
          comment: comment.trim()
        })
      });

      if (response.ok) {
        setComment('');
        onAnnotationCreated(); // Refrescar la lista
        onClose();
      } else {
        console.error('Error creating annotation');
      }
    } catch (error) {
      console.error('Error creating annotation:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Nueva anotación para {student?.name}
      </DialogTitle>
      <DialogContent>
        <Typography color="text.secondary" mb={2}>
          Escribe una observación o comportamiento relevante para la anotación del estudiante.
        </Typography>
        <TextField
          label="Anotación"
          multiline
          minRows={4}
          fullWidth
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleCreate}
          variant="contained"
          disabled={!comment.trim() || loading}
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

interface LifeNoteModalProps {
  open: boolean;
  onClose: () => void;
  student: {
    id: string;
    name: string;
    status: string;
    lastUpdate: string;
    hasRecords: boolean;
  } | null;
}

function LifeNoteModal({ open, onClose, student }: LifeNoteModalProps) {
  const [note, setNote] = useState('');
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Nueva anotación para {student?.name}
      </DialogTitle>
      <DialogContent>
        <Typography color="text.secondary" mb={2}>
          Escribe una observación o comportamiento relevante para la anotación del estudiante.
        </Typography>
        <TextField
          label="Anotación"
          multiline
          minRows={4}
          fullWidth
          value={note}
          onChange={e => setNote(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancelar
        </Button>
        <Button
          onClick={() => {
            // Aquí podrías guardar la nota
            setNote('');
            onClose();
          }}
          variant="contained"
          disabled={!note.trim()}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const LifeDocument = () => {
  const [search, setSearch] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedStudentForAnnotation, setSelectedStudentForAnnotation] = useState<StudentInfo | null>(null);
  const [selectedStudent] = useState<{
    id: string;
    name: string;
    status: string;
    lastUpdate: string;
    hasRecords: boolean;
  } | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [studentsData, setStudentsData] = useState<StudentInfo[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoadingCourses(true);
      try {
        const courseService = new CourseService();
        const teacherCourses = await courseService.getTeacherCourses();
        setCourses(teacherCourses);
        if (teacherCourses.length > 0) {
          setSelectedCourse(teacherCourses[0]);
        }
      } catch {
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
        setStudentsData([]);
        return;
      }
      setLoadingStudents(true);
      try {
        const accessToken = localStorage.getItem('access_token');
        const enrollmentsRes = await fetch(`http://localhost:3001/api/v1/courses/${selectedCourse.id}/enrollments`, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        const enrollments = await enrollmentsRes.json();
        
        const studentsInfo: StudentInfo[] = await Promise.all(
          (enrollments || []).map(async (enrollment: any) => {
            const studentId = enrollment.student?.id;
            const grade = enrollment.grade;
            const enrollmentId = enrollment.id; // Obtener el enrollmentId
            if (!studentId) return null;
            
            // Obtener información del estudiante
            const studentRes = await fetch(`http://localhost:3001/api/v1/students/${studentId}`, {
              headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            const student = await studentRes.json();
            
            // Obtener anotaciones del estudiante para este curso
            let annotations: StudentAnnotation[] = [];
            let lastAnnotationDate: string | undefined;
            try {
              const annotationsRes = await fetch(
                `http://localhost:3001/api/v1/students/${studentId}/annotations/course/${selectedCourse.id}`,
                {
                  headers: { 'Authorization': `Bearer ${accessToken}` }
                }
              );
              if (annotationsRes.ok) {
                annotations = await annotationsRes.json();
                // Encontrar la fecha de la anotación más reciente
                if (annotations.length > 0) {
                  const sortedAnnotations = annotations.sort((a, b) => 
                    new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()
                  );
                  lastAnnotationDate = sortedAnnotations[0].updatedAt || sortedAnnotations[0].createdAt;
                }
              }
            } catch (error) {
              console.error(`Error fetching annotations for student ${studentId}:`, error);
            }
            
            return {
              id: student.id || studentId,
              rut: student.rut,
              name: student.fullname || 'Sin nombre',
              email: student.email,
              grade: grade,
              is_active: student.is_active !== undefined ? student.is_active : true,
              enrollmentId: enrollmentId, // Asignar el enrollmentId
              annotations: annotations,
              lastAnnotationDate: lastAnnotationDate,
            };
          })
        );
        setStudentsData(studentsInfo.filter(Boolean));
      } catch {
        setStudentsData([]);
      } finally {
        setLoadingStudents(false);
      }
    };
    fetchStudents();
  }, [selectedCourse]);

  const handleCreateAnnotation = (student: StudentInfo) => {
    setSelectedStudentForAnnotation(student);
    setCreateModalOpen(true);
  };

  const handleAnnotationCreated = async () => {
    // Recargar las anotaciones del estudiante específico
    if (selectedStudentForAnnotation && selectedCourse) {
      try {
        const accessToken = localStorage.getItem('access_token');
        const annotationsRes = await fetch(
          `http://localhost:3001/api/v1/students/${selectedStudentForAnnotation.id}/annotations/course/${selectedCourse.id}`,
          {
            headers: { 'Authorization': `Bearer ${accessToken}` }
          }
        );
        
        if (annotationsRes.ok) {
          const annotations: StudentAnnotation[] = await annotationsRes.json();
          
          // Actualizar el estudiante en la lista
          setStudentsData(prevStudents => 
            prevStudents.map(student => {
              if (student.id === selectedStudentForAnnotation.id) {
                let lastAnnotationDate: string | undefined;
                if (annotations.length > 0) {
                  const sortedAnnotations = annotations.sort((a, b) => 
                    new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()
                  );
                  lastAnnotationDate = sortedAnnotations[0].updatedAt || sortedAnnotations[0].createdAt;
                }
                
                return {
                  ...student,
                  annotations: annotations,
                  lastAnnotationDate: lastAnnotationDate,
                };
              }
              return student;
            })
          );
        }
      } catch (error) {
        console.error('Error updating annotations:', error);
      }
    }
    
    setCreateModalOpen(false);
    setSelectedStudentForAnnotation(null);
  };

  const filteredStudents = studentsData.filter(
    s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rut.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ width: '100%', mt: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
        <IconButton size="small" sx={{ bgcolor: '#F6F6F6' }}>
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
        <Typography variant="h4" fontWeight={700} color='black'>
          Anotaciones
        </Typography>
      </Box>
      <Typography color="text.secondary" fontSize={15} mb={2}>
        Registro de comportamientos y observaciones de estudiantes
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
          {selectedCourse?.name || 'Seleccione un curso'}
        </Typography>
        <Typography color="text.secondary" fontSize={15} mb={2}>
          Anotaciones de estudiantes | Semestre: {selectedCourse?.semester} | Año: {selectedCourse?.year}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <TextField
            size="small"
            placeholder="Buscar estudiantes"
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{
              width: 340,
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E0E0E0' },
              bgcolor: '#FAFAFA',
              borderRadius: 2,
            }}
          />
        </Box>

        <TableContainer component={Paper} sx={{ boxShadow: 'none', borderRadius: 2, border: '1px solid #F0F0F0' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>RUT</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Ultima actualizacion</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loadingStudents ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">Cargando estudiantes...</TableCell>
                </TableRow>
              ) : filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">No hay estudiantes inscritos en este curso.</TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student, index) => (
                  <TableRow key={student.id || index} hover>
                    <TableCell>{student.rut}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={student.annotations && student.annotations.length > 0 ? 'Con registros' : 'Sin registros'}
                        sx={{
                          bgcolor: student.annotations && student.annotations.length > 0 ? '#E8F5E8' : '#F2F3F5',
                          color: student.annotations && student.annotations.length > 0 ? '#4CAF50' : '#888',
                          fontWeight: 500,
                          fontSize: 15,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {student.lastAnnotationDate 
                        ? new Date(student.lastAnnotationDate).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : '-'
                      }
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<AddIcon />}
                          sx={{
                            borderRadius: 1.5,
                            textTransform: 'none',
                            fontWeight: 500,
                            bgcolor: '#fff',
                            borderColor: '#E0E0E0',
                            color: '#4CAF50',
                            minWidth: 'auto',
                            px: 1.5,
                            py: 0.5,
                            fontSize: '0.75rem',
                            '&:hover': {
                              borderColor: '#4CAF50',
                              bgcolor: '#F1F8E9',
                            },
                          }}
                          onClick={() => handleCreateAnnotation(student)}
                        >
                          Crear
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<EditIcon />}
                          sx={{
                            borderRadius: 1.5,
                            textTransform: 'none',
                            fontWeight: 500,
                            bgcolor: '#fff',
                            borderColor: '#E0E0E0',
                            color: '#FF9800',
                            minWidth: 'auto',
                            px: 1.5,
                            py: 0.5,
                            fontSize: '0.75rem',
                            '&:hover': {
                              borderColor: '#FF9800',
                              bgcolor: '#FFF3E0',
                            },
                          }}
                          onClick={() => console.log('Editar anotación')}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<DeleteIcon />}
                          sx={{
                            borderRadius: 1.5,
                            textTransform: 'none',
                            fontWeight: 500,
                            bgcolor: '#fff',
                            borderColor: '#E0E0E0',
                            color: '#F44336',
                            minWidth: 'auto',
                            px: 1.5,
                            py: 0.5,
                            fontSize: '0.75rem',
                            '&:hover': {
                              borderColor: '#F44336',
                              bgcolor: '#FFEBEE',
                            },
                          }}
                          onClick={() => console.log('Eliminar anotación')}
                        >
                          Eliminar
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <CreateAnnotationModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        student={selectedStudentForAnnotation}
        onAnnotationCreated={handleAnnotationCreated}
      />

      <LifeNoteModal
        open={false}
        onClose={() => {}}
        student={selectedStudent}
      />
    </Box>
  );
};

export default LifeDocument;