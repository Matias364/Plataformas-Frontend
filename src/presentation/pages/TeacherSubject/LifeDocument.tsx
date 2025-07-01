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
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Course } from '../../../domain/course/Course';
import { CourseService } from '../../../infrastructure/services/CourseService';

interface StudentInfo {
  id: string;
  rut: string;
  name: string;
  email: string;
  grade: number;
  is_active: boolean;
  enrollmentId: string; 
  annotations?: StudentAnnotation[]; 
  lastAnnotationDate?: string; 
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

interface AnnotationsModalProps {
  open: boolean;
  onClose: () => void;
  student: StudentInfo | null;
  onCreateAnnotation: () => void;
  onEditAnnotation: (annotation: StudentAnnotation) => void;
  onDeleteAnnotation: (annotationId: string) => void;
}

function AnnotationsModal({ 
  open, 
  onClose, 
  student, 
  onCreateAnnotation, 
  onEditAnnotation, 
  onDeleteAnnotation 
}: AnnotationsModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Anotaciones de {student?.name}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onCreateAnnotation}
            sx={{ mb: 2 }}
          >
            Nueva anotación
          </Button>
        </Box>
        
        {!student?.annotations || student.annotations.length === 0 ? (
          <Typography color="text.secondary" align="center" py={4}>
            No hay anotaciones para este estudiante
          </Typography>
        ) : (
          <List>
            {student.annotations.map((annotation, index) => (
              <Box key={annotation.id}>
                <ListItem 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    py: 2 
                  }}
                >
                  <ListItemText
                    primary={annotation.comment}
                    secondary={`Creado: ${new Date(annotation.createdAt).toLocaleString('es-ES')}${annotation.updatedAt && annotation.updatedAt !== annotation.createdAt ? ` | Actualizado: ${new Date(annotation.updatedAt).toLocaleString('es-ES')}` : ''}`}
                    sx={{ flex: 1, mr: 2 }}
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => onEditAnnotation(annotation)}
                      sx={{ color: '#FF9800' }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => onDeleteAnnotation(annotation.id)}
                      sx={{ color: '#F44336' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </ListItem>
                {index < (student.annotations?.length || 0) - 1 && <Divider />}
              </Box>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

interface EditAnnotationModalProps {
  open: boolean;
  onClose: () => void;
  annotation: StudentAnnotation | null;
  onSave: (annotationId: string, comment: string) => void;
}

function EditAnnotationModal({ open, onClose, annotation, onSave }: EditAnnotationModalProps) {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (annotation) {
      setComment(annotation.comment);
    }
  }, [annotation]);

  const handleSave = async () => {
    if (!annotation || !comment.trim()) return;

    setLoading(true);
    try {
      await onSave(annotation.id, comment.trim());
      onClose();
    } catch (error) {
      console.error('Error editing annotation:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Editar anotación
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Anotación"
          multiline
          minRows={4}
          fullWidth
          value={comment}
          onChange={e => setComment(e.target.value)}
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!comment.trim() || loading}
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

interface DeleteConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  annotationText: string;
}

function DeleteConfirmationModal({ open, onClose, onConfirm, annotationText }: DeleteConfirmationModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <WarningIcon sx={{ color: '#F44336' }} />
        Confirmar eliminación
      </DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Esta acción no se puede deshacer
        </Alert>
        <Typography variant="body1" mb={2}>
          ¿Estás seguro de que quieres eliminar esta anotación?
        </Typography>
        <Box 
          sx={{ 
            p: 2, 
            bgcolor: '#f5f5f5', 
            borderRadius: 1, 
            border: '1px solid #e0e0e0' 
          }}
        >
          <Typography variant="body2" color="text.secondary" fontStyle="italic">
            "{annotationText}"
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          sx={{ minWidth: 100 }}
        >
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          sx={{ minWidth: 100 }}
        >
          Eliminar
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
  const [annotationsModalOpen, setAnnotationsModalOpen] = useState(false);
  const [currentStudentAnnotations, setCurrentStudentAnnotations] = useState<StudentInfo | null>(null);
  const [editAnnotationModalOpen, setEditAnnotationModalOpen] = useState(false);
  const [selectedAnnotation, setSelectedAnnotation] = useState<StudentAnnotation | null>(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [annotationToDelete, setAnnotationToDelete] = useState<StudentAnnotation | null>(null);
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

  const handleViewAnnotations = (student: StudentInfo) => {
    setCurrentStudentAnnotations(student);
    setAnnotationsModalOpen(true);
  };

  const handleCreateAnnotationFromModal = () => {
    if (currentStudentAnnotations) {
      setSelectedStudentForAnnotation(currentStudentAnnotations);
      setAnnotationsModalOpen(false);
      setCreateModalOpen(true);
    }
  };

  const handleEditAnnotation = (annotation: StudentAnnotation) => {
    setSelectedAnnotation(annotation);
    setEditAnnotationModalOpen(true);
  };

  const handleSaveEditAnnotation = async (annotationId: string, comment: string) => {
    try {
      const accessToken = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:3001/api/v1/students/annotations/${annotationId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          comment: comment
        })
      });

      if (response.ok && currentStudentAnnotations && selectedCourse) {
        // Actualizar las anotaciones del estudiante
        await refreshStudentAnnotations(currentStudentAnnotations.id);
      } else {
        console.error('Error editing annotation');
      }
    } catch (error) {
      console.error('Error editing annotation:', error);
    }
  };

  const handleDeleteAnnotation = async (annotationId: string) => {
    // Buscar la anotación en el estudiante actual del modal
    const annotation = currentStudentAnnotations?.annotations?.find(a => a.id === annotationId);
    if (annotation) {
      setAnnotationToDelete(annotation);
      setDeleteConfirmationOpen(true);
    }
  };

  const confirmDeleteAnnotation = async () => {
    if (!annotationToDelete) return;

    try {
      const accessToken = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:3001/api/v1/students/annotations/${annotationToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.ok && currentStudentAnnotations && selectedCourse) {
        // Actualizar las anotaciones del estudiante
        await refreshStudentAnnotations(currentStudentAnnotations.id);
        setDeleteConfirmationOpen(false);
        setAnnotationToDelete(null);
      } else {
        console.error('Error deleting annotation');
      }
    } catch (error) {
      console.error('Error deleting annotation:', error);
    }
  };

  const refreshStudentAnnotations = async (studentId: string) => {
    if (!selectedCourse) return;
    
    try {
      const accessToken = localStorage.getItem('access_token');
      const annotationsRes = await fetch(
        `http://localhost:3001/api/v1/students/${studentId}/annotations/course/${selectedCourse.id}`,
        {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }
      );
      
      if (annotationsRes.ok) {
        const annotations: StudentAnnotation[] = await annotationsRes.json();
        
        // Actualizar tanto el estudiante en la lista como el estudiante actual del modal
        setStudentsData(prevStudents => 
          prevStudents.map(student => {
            if (student.id === studentId) {
              let lastAnnotationDate: string | undefined;
              if (annotations.length > 0) {
                const sortedAnnotations = annotations.sort((a, b) => 
                  new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()
                );
                lastAnnotationDate = sortedAnnotations[0].updatedAt || sortedAnnotations[0].createdAt;
              }
              
              const updatedStudent = {
                ...student,
                annotations: annotations,
                lastAnnotationDate: lastAnnotationDate,
              };
              
              // Si es el estudiante actual del modal, también actualizar ese estado
              if (currentStudentAnnotations && currentStudentAnnotations.id === studentId) {
                setCurrentStudentAnnotations(updatedStudent);
              }
              
              return updatedStudent;
            }
            return student;
          })
        );
      }
    } catch (error) {
      console.error('Error refreshing annotations:', error);
    }
  };

  const handleAnnotationCreated = async () => {
    // Recargar las anotaciones del estudiante específico
    if (selectedStudentForAnnotation && selectedCourse) {
      await refreshStudentAnnotations(selectedStudentForAnnotation.id);
    }
    
    setCreateModalOpen(false);
    setSelectedStudentForAnnotation(null);
    
    // Si venimos del modal de anotaciones, volver a abrirlo
    if (currentStudentAnnotations) {
      setAnnotationsModalOpen(true);
    }
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
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<VisibilityIcon />}
                        sx={{
                          borderRadius: 1.5,
                          textTransform: 'none',
                          fontWeight: 500,
                          bgcolor: '#fff',
                          borderColor: '#E0E0E0',
                          color: '#2196F3',
                          minWidth: 'auto',
                          px: 1.5,
                          py: 0.5,
                          fontSize: '0.75rem',
                          '&:hover': {
                            borderColor: '#2196F3',
                            bgcolor: '#E3F2FD',
                          },
                        }}
                        onClick={() => handleViewAnnotations(student)}
                      >
                        Ver anotaciones
                      </Button>
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

      <AnnotationsModal
        open={annotationsModalOpen}
        onClose={() => setAnnotationsModalOpen(false)}
        student={currentStudentAnnotations}
        onCreateAnnotation={handleCreateAnnotationFromModal}
        onEditAnnotation={handleEditAnnotation}
        onDeleteAnnotation={handleDeleteAnnotation}
      />

      <EditAnnotationModal
        open={editAnnotationModalOpen}
        onClose={() => setEditAnnotationModalOpen(false)}
        annotation={selectedAnnotation}
        onSave={handleSaveEditAnnotation}
      />

      <DeleteConfirmationModal
        open={deleteConfirmationOpen}
        onClose={() => {
          setDeleteConfirmationOpen(false);
          setAnnotationToDelete(null);
        }}
        onConfirm={confirmDeleteAnnotation}
        annotationText={annotationToDelete?.comment || ''}
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