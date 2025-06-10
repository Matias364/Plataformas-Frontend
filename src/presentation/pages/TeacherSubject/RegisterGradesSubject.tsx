import { useState } from 'react';
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
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const students = [
  { id: 'STD001', name: 'Carlos Martinez' },
  { id: 'STD002', name: 'Maria Gonzalez' },
  { id: 'STD003', name: 'Juan Perez' },
  { id: 'STD004', name: 'Ana Rodriguez' },
  { id: 'STD005', name: 'Luis Sanchez' },
];

// Genera las notas de 1.0 a 7.0 con paso de 0.1
const notas = Array.from({ length: 61 }, (_, i) => (1 + i * 0.1).toFixed(1));

interface StudentGradesModalProps {
  open: boolean;
  onClose: () => void;
}

function StudentGradesModal({ open, onClose }: StudentGradesModalProps) {
  const [grades, setGrades] = useState(
    students.map((s) => ({ ...s, grade: '' }))
  );

  const handleGradeChange = (idx: number, value: string) => {
    const newGrades = [...grades];
    newGrades[idx].grade = value;
    setGrades(newGrades);
  };

  const handleSend = () => {
    // Aquí puedes manejar el envío de las notas
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, fontSize: 22 }}>
        Ingresar Notas de Asignatura
      </DialogTitle>
      <DialogContent>
        <Typography color="text.secondary" fontSize={15} mb={2}>
          Ingresa la nota final para cada estudiante
        </Typography>
        <TableContainer component={Paper} sx={{ boxShadow: 'none', borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Nota Final</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {grades.map((student, idx) => (
                <TableRow key={student.id}>
                  <TableCell>{student.id}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>
                    <Select
                      size="small"
                      value={student.grade}
                      onChange={(e) => handleGradeChange(idx, e.target.value)}
                      displayEmpty
                      sx={{ width: 90, bgcolor: '#FAFAFA', borderRadius: 1 }}
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancelar
        </Button>
        <Button onClick={handleSend} variant="contained">
          Enviar Notas
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const ExcelDropZone = ({ onBack }: { onBack: () => void }) => (
  <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
    <Box sx={{ width: '100%', maxWidth: 1100, display: 'flex', alignItems: 'center', mb: 2 }}>
      <IconButton onClick={onBack} sx={{ mr: 1 }}>
        <ArrowBackIcon sx={{ fontSize: 28 }} />
      </IconButton>
      <Typography variant="h5" fontWeight={700} color="black">
        Subir Notas por Excel
      </Typography>
    </Box>
    <Box
      sx={{
        width: '90%',
        maxWidth: 1100,
        minHeight: 350,
        bgcolor: '#F6F9FF',
        border: '2px dashed #90B8F8',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        mx: 'auto',
        mb: 4,
      }}
    >
      <Typography variant="h5" fontWeight={500} mb={2} color='black'>
        Arrastra para subir
      </Typography>
      <CloudUploadOutlinedIcon sx={{ fontSize: 90, color: '#A0A4AA', mb: 2 }} />
      <Typography color="#757575" fontSize={28} align="center">
        Suelta en esta area el archivo Excel<br />para subir
      </Typography>
    </Box>
    <Button
      variant="contained"
      sx={{
        bgcolor: '#00A89D',
        color: '#fff',
        borderRadius: 8,
        px: 5,
        py: 1.5,
        fontWeight: 600,
        fontSize: 18,
        boxShadow: 'none',
        '&:hover': { bgcolor: '#009688' },
      }}
    >
      Confirmar
    </Button>
  </Box>
);

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
            flexDirection: { xs: 'column', md: 'row' },
            gap: 3,
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
          <Box sx={{ maxWidth: 350, width: '100%' }}>
            <Card
              onClick={() => handleOption('excel')}
              sx={{
                p: 4,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                border: '2px solid #E0E0E0',
                boxShadow: 0,
                transition: 'border-color 0.2s',
                '&:hover': { borderColor: '#2196F3', boxShadow: 2 },
              }}
            >
              <InsertDriveFileIcon sx={{ fontSize: 48, color: '#2196F3', mb: 1 }} />
              <Typography variant="h6" fontWeight={600} mb={1}>
                Por Excel
              </Typography>
              <Typography color="text.secondary" align="center">
                Sube un archivo Excel con las notas de todos los estudiantes.
              </Typography>
            </Card>
          </Box>
        </Box>
      )}

      {/* Modal para estudiantes */}
      {option === 'student' && (
        <StudentGradesModal open={openModal} onClose={handleBack} />
      )}

      {/* Dropzone para Excel */}
      {option === 'excel' && <ExcelDropZone onBack={handleBack} />}
    </Box>
  );
};

export default RegisterGradesSubject;