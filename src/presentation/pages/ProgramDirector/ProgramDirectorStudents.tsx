import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
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
  InputAdornment,
  Chip,
  Avatar,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { StudentsByCycleService } from '../../../infrastructure/services/StudentsByCycleService';
import { StudentDisplay, CycleType } from '../../../domain/student/StudentTypes';
import StudentAnnotationsModal from '../../components/StudentAnnotationsModal/StudentAnnotationsModal';

const ProgramDirectorStudents: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCycle, setSelectedCycle] = useState<CycleType>('BASICO');
  const [students, setStudents] = useState<StudentDisplay[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentDisplay[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para el modal de anotaciones
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<{ name: string; id: string } | null>(null);

  // Cargar estudiantes cuando cambia el ciclo
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        const studentsData = await StudentsByCycleService.getStudentsForDisplay(selectedCycle);
        setStudents(studentsData);
        setFilteredStudents(studentsData);
      } catch (err) {
        console.error('Error al cargar estudiantes:', err);
        setError('Error al cargar los estudiantes. Verifique la conexión con el servidor.');
        setStudents([]);
        setFilteredStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [selectedCycle]);

  // Filtrar estudiantes cuando cambia el término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rut.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  }, [searchTerm, students]);

  // Función para filtrar estudiantes por búsqueda
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Función para manejar el cambio de ciclo
  const handleCycleChange = (event: any) => {
    setSelectedCycle(event.target.value as CycleType);
    setSearchTerm(''); // Limpiar búsqueda al cambiar ciclo
  };

  // Función para manejar la acción de hoja de vida
  const handleViewProfile = (student: StudentDisplay) => {
    setSelectedStudent({ name: student.name, id: student.studentId });
    setModalOpen(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedStudent(null);
  };

  if (loading) {
    return (
      <Box sx={{ 
        p: 3, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px' 
      }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Reintentar
        </Button>
      </Box>
    );
  }

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
          Estudiantes
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Ciclo ECOE</InputLabel>
            <Select
              value={selectedCycle}
              onChange={handleCycleChange}
              label="Ciclo ECOE"
            >
              <MenuItem value="BASICO">Básico</MenuItem>
              <MenuItem value="PROFESIONAL">Profesional</MenuItem>
              <MenuItem value="FINAL">Final</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Lista de Estudiantes Section */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 2 
        }}>
          <Typography variant="h6" component="h2" fontWeight={600} color="#333">
            Lista de Estudiantes - Ciclo {selectedCycle}
          </Typography>
          <TextField
            placeholder="Buscar estudiantes por nombre, RUT..."
            value={searchTerm}
            onChange={handleSearch}
            variant="outlined"
            size="small"
            sx={{ width: 350 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Tabla de Estudiantes */}
        <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 600, color: '#555', width: '13%' }}>RUT</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#555', width: '18%' }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#555', width: '22%' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#555', width: '11%' }}>Último ECOE</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#555', width: '13%' }}>Promedio ECOE</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#555', width: '13%' }}>Nivel Logrado</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#555', width: '10%' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No se encontraron estudiantes para el ciclo {selectedCycle}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => (
                  <TableRow
                    key={student.studentId}
                    sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}
                  >
                    <TableCell sx={{ color: '#666', width: '13%' }}>{student.rut}</TableCell>
                    <TableCell sx={{ width: '18%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar 
                          sx={{ 
                            width: 24, 
                            height: 24, 
                            backgroundColor: '#1976d2',
                            fontSize: '0.75rem'
                          }}
                        >
                          <PersonIcon fontSize="small" />
                        </Avatar>
                        <Typography variant="body2" color="#333">
                          {student.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: '#666', width: '22%' }}>{student.email}</TableCell>
                    <TableCell sx={{ color: '#666', width: '11%' }}>{student.lastEcoe}</TableCell>
                    <TableCell sx={{ width: '13%' }}>
                      {student.averageEcoe !== null ? (
                        <Chip 
                          label={student.averageEcoe.toFixed(1)}
                          size="small"
                          sx={{
                            backgroundColor: student.averageEcoe >= 6.5 ? '#4caf50' : 
                                           student.averageEcoe >= 6.0 ? '#ff9800' : 
                                           student.averageEcoe >= 4.0 ? '#2196f3' : '#f44336',
                            color: 'white',
                            fontWeight: 600
                          }}
                        />
                      ) : (
                        <Chip 
                          label="N/A"
                          size="small"
                          sx={{
                            backgroundColor: '#9e9e9e',
                            color: 'white',
                            fontWeight: 600
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell sx={{ width: '13%' }}>
                      <Chip 
                        label={student.achievementLevel}
                        size="small"
                        variant={student.achievementLevel === 'N/A' ? 'filled' : 'outlined'}
                        sx={{
                          ...(student.achievementLevel === 'N/A' ? {
                            backgroundColor: '#9e9e9e',
                            color: 'white',
                            fontWeight: 600
                          } : {
                            borderColor: student.achievementLevel === 'Satisfactorio' ? '#4caf50' :
                                       student.achievementLevel === 'Suficiente' ? '#ff9800' :
                                       student.achievementLevel === 'Insuficiente' ? '#f44336' : '#9e9e9e',
                            color: student.achievementLevel === 'Satisfactorio' ? '#4caf50' :
                                  student.achievementLevel === 'Suficiente' ? '#ff9800' :
                                  student.achievementLevel === 'Insuficiente' ? '#f44336' : '#9e9e9e',
                          }),
                          fontWeight: 500
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ width: '10%' }}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleViewProfile(student)}
                        sx={{
                          backgroundColor: '#1976d2',
                          '&:hover': {
                            backgroundColor: '#1565c0'
                          },
                          textTransform: 'none',
                          fontSize: '0.8rem',
                          padding: '6px 12px',
                          whiteSpace: 'nowrap'
                        }}
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
      </Box>

      {/* Modal de Anotaciones */}
      {selectedStudent && (
        <StudentAnnotationsModal
          open={modalOpen}
          onClose={handleCloseModal}
          studentName={selectedStudent.name}
          studentId={selectedStudent.id}
        />
      )}
    </Box>
  );
};

export default ProgramDirectorStudents;
