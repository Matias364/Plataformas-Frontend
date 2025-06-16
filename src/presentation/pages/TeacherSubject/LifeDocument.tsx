import { useState } from 'react';
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
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const students = [
  {
    id: 'STD001',
    name: 'Carlos Martinez',
    status: 'Con registros',
    lastUpdate: '2023-11-10',
    hasRecords: true,
  },
  {
    id: 'STD002',
    name: 'Maria Gonzalez',
    status: 'Con registros',
    lastUpdate: '2023-11-08',
    hasRecords: true,
  },
  {
    id: 'STD003',
    name: 'Juan Perez',
    status: 'Sin registros',
    lastUpdate: '',
    hasRecords: false,
  },
  {
    id: 'STD004',
    name: 'Ana Rodriguez',
    status: 'Con registros',
    lastUpdate: '2023-11-05',
    hasRecords: true,
  },
  {
    id: 'STD005',
    name: 'Luis Sanchez',
    status: 'Sin registros',
    lastUpdate: '',
    hasRecords: false,
  },
];

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
          Escribe una observación o comportamiento relevante para la hoja de vida del estudiante.
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
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<{
    id: string;
    name: string;
    status: string;
    lastUpdate: string;
    hasRecords: boolean;
  } | null>(null);

  const filteredStudents = students.filter(
    s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenModal = (student: {
    id: string;
    name: string;
    status: string;
    lastUpdate: string;
    hasRecords: boolean;
  }) => {
    setSelectedStudent(student);
    setModalOpen(true);
  };

  return (
    <Box sx={{ width: '100%', mt: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
        <IconButton size="small" sx={{ bgcolor: '#F6F6F6' }}>
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
        <Typography variant="h4" fontWeight={700} color='black'>
          Hojas de Vida
        </Typography>
      </Box>
      <Typography color="text.secondary" fontSize={15} mb={2}>
        Registro de comportamientos y observaciones de estudiantes
      </Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          select
          size="small"
          value="ENF-301 - Enfermeria Clinica"
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
          disabled
        >
          <option value="ENF-301 - Enfermeria Clinica">ENF-301 - Enfermeria Clinica</option>
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
          Enfermería Clinica
        </Typography>
        <Typography color="text.secondary" fontSize={15} mb={2}>
          Hojas de vida de estudiantes | Codigo: ENF-301 | Semestre: 5to
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
                <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Ultima actualizacion</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id} hover>
                  <TableCell>{student.id}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>
                    <Chip
                      label={student.status}
                      sx={{
                        bgcolor: student.hasRecords ? '#CFF6DD' : '#F2F3F5',
                        color: student.hasRecords ? '#2ECC71' : '#888',
                        fontWeight: 500,
                        fontSize: 15,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {student.lastUpdate || '-'}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      startIcon={<VisibilityOutlinedIcon />}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 500,
                        bgcolor: '#fff',
                        borderColor: '#E0E0E0',
                        color: '#222',
                        px: 2,
                        mr: 1,
                        '&:disabled': {
                          color: '#888',
                          borderColor: '#E0E0E0',
                          bgcolor: '#F5F5F5',
                        },
                      }}
                      onClick={() => handleOpenModal(student)}
                    >
                      Ver Hoja de Vida
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <LifeNoteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        student={selectedStudent}
      />
    </Box>
  );
};

export default LifeDocument;