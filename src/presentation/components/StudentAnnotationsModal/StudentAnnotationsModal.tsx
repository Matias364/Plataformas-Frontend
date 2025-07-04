import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import {
  School as SchoolIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Comment as CommentIcon
} from '@mui/icons-material';
import { AnnotationDisplay } from '../../../domain/student/StudentAnnotations';
import { StudentAnnotationsService } from '../../../infrastructure/services/StudentAnnotationsService';

interface StudentAnnotationsModalProps {
  open: boolean;
  onClose: () => void;
  studentName: string;
  studentId: string;
}

const StudentAnnotationsModal: React.FC<StudentAnnotationsModalProps> = ({
  open,
  onClose,
  studentName,
  studentId
}) => {
  const [annotations, setAnnotations] = React.useState<AnnotationDisplay[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open && studentId) {
      fetchAnnotations();
    }
  }, [open, studentId]);

  const fetchAnnotations = async () => {
    try {
      setLoading(true);
      setError(null);
      const annotationsData = await StudentAnnotationsService.getAnnotationsForDisplay(studentId);
      setAnnotations(annotationsData);
    } catch (err) {
      console.error('Error al cargar anotaciones:', err);
      setError('Error al cargar las anotaciones del estudiante.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAnnotations([]);
    setError(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <PersonIcon sx={{ color: '#1976d2', fontSize: 28 }} />
          <Box>
            <Typography variant="h6" component="h2" fontWeight={600}>
              Hoja de Vida Académica
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {studentName}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 2 }}>
        {loading && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            py: 4 
          }}>
            <CircularProgress size={40} />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && annotations.length === 0 && (
          <Box sx={{ 
            textAlign: 'center', 
            py: 4,
            color: 'text.secondary'
          }}>
            <CommentIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
            <Typography variant="h6" gutterBottom>
              Sin anotaciones registradas
            </Typography>
            <Typography variant="body2">
              Este estudiante no tiene anotaciones académicas registradas.
            </Typography>
          </Box>
        )}

        {!loading && !error && annotations.length > 0 && (
          <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
            {annotations.map((annotation, index) => (
              <Card 
                key={annotation.id} 
                sx={{ 
                  mb: 2, 
                  border: '1px solid #e0e0e0',
                  boxShadow: 1,
                  '&:hover': { boxShadow: 2 }
                }}
              >
                <CardContent sx={{ pb: 2 }}>
                  {/* Header de la anotación */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    mb: 2
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SchoolIcon sx={{ color: '#1976d2', fontSize: 20 }} />
                      <Typography variant="subtitle1" fontWeight={600} color="#333">
                        {annotation.subjectName}
                      </Typography>
                    </Box>
                    <Chip 
                      label={`Anotación #${index + 1}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>

                  {/* Comentario */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" sx={{ 
                      fontStyle: 'italic',
                      color: '#444',
                      lineHeight: 1.6,
                      p: 2,
                      bgcolor: '#f8f9fa',
                      borderRadius: 1,
                      border: '1px solid #e9ecef'
                    }}>
                      "{annotation.comment}"
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Footer con información del profesor y fecha */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 2
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon sx={{ color: '#666', fontSize: 18 }} />
                      <Typography variant="body2" color="text.secondary">
                        <strong>Profesor:</strong> {annotation.teacherName}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ScheduleIcon sx={{ color: '#666', fontSize: 18 }} />
                      <Typography variant="body2" color="text.secondary">
                        {StudentAnnotationsService.formatDate(annotation.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button 
          onClick={handleClose}
          variant="contained"
          sx={{
            backgroundColor: '#1976d2',
            '&:hover': {
              backgroundColor: '#1565c0'
            }
          }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StudentAnnotationsModal;
