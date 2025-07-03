import React, { useState } from 'react';
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
  IconButton,
  InputAdornment,
  Chip,
  Avatar
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  GetApp as GetAppIcon,
  Person as PersonIcon
} from '@mui/icons-material';

// Datos de prueba para los estudiantes
const studentsData = [
  {
    rut: 'ST0001',
    name: 'Carlos Martinez',
    email: 'carlos.martinez@universidad.edu',
    lastEcoe: 'ECOE 2023-2',
    averageEcoe: 6.5,
    avatar: null
  },
  {
    rut: 'ST0002',
    name: 'Maria Gonzalez',
    email: 'maria.gonzalez@universidad.edu',
    lastEcoe: 'ECOE 2023-2',
    averageEcoe: 6.3,
    avatar: null
  },
  {
    rut: 'ST0003',
    name: 'Juan Perez',
    email: 'juan.perez@universidad.edu',
    lastEcoe: 'ECOE 2023-2',
    averageEcoe: 6.3,
    avatar: null
  },
  {
    rut: 'ST0004',
    name: 'Ana Rodriguez',
    email: 'ana.rodriguez@universidad.edu',
    lastEcoe: 'ECOE 2023-2',
    averageEcoe: 6.0,
    avatar: null
  },
  {
    rut: 'ST0005',
    name: 'Luis Sanchez',
    email: 'luis.sanchez@universidad.edu',
    lastEcoe: 'ECOE 2023-2',
    averageEcoe: 6.9,
    avatar: null
  }
];

const ProgramDirectorStudents: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('todos');
  const [filteredStudents, setFilteredStudents] = useState(studentsData);

  // Función para filtrar estudiantes
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    
    const filtered = studentsData.filter(student =>
      student.name.toLowerCase().includes(value) ||
      student.rut.toLowerCase().includes(value) ||
      student.email.toLowerCase().includes(value)
    );
    setFilteredStudents(filtered);
  };

  // Función para manejar el cambio de semestre
  const handleSemesterChange = (event: any) => {
    setSelectedSemester(event.target.value);
  };

  // Función para manejar la acción de hoja de vida
  const handleViewProfile = (studentRut: string) => {
    console.log('Ver hoja de vida del estudiante:', studentRut);
    // Aquí iría la navegación a la hoja de vida del estudiante
  };

  // Función para agregar estudiantes
  const handleAddStudents = () => {
    console.log('Agregar estudiantes');
    // Aquí iría la lógica para agregar estudiantes
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
          Estudiantes
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Semestre</InputLabel>
            <Select
              value={selectedSemester}
              onChange={handleSemesterChange}
              label="Semestre"
            >
              <MenuItem value="todos">Todos los semestres</MenuItem>
              <MenuItem value="2023-1">2023-1</MenuItem>
              <MenuItem value="2023-2">2023-2</MenuItem>
              <MenuItem value="2024-1">2024-1</MenuItem>
              <MenuItem value="2024-2">2024-2</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddStudents}
            sx={{
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0'
              }
            }}
          >
            Agregar Estudiantes
          </Button>
          <IconButton sx={{ color: '#666' }}>
            <GetAppIcon />
          </IconButton>
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
            Lista de Estudiantes
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
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 600, color: '#555' }}>RUT</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#555' }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#555' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#555' }}>Último ECOE</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#555' }}>Promedio ECOE</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#555' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow
                  key={student.rut}
                  sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}
                >
                  <TableCell sx={{ color: '#666' }}>{student.rut}</TableCell>
                  <TableCell>
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
                  <TableCell sx={{ color: '#666' }}>{student.email}</TableCell>
                  <TableCell sx={{ color: '#666' }}>{student.lastEcoe}</TableCell>
                  <TableCell>
                    <Chip 
                      label={student.averageEcoe.toFixed(1)}
                      size="small"
                      sx={{
                        backgroundColor: student.averageEcoe >= 6.5 ? '#4caf50' : 
                                       student.averageEcoe >= 6.0 ? '#ff9800' : '#f44336',
                        color: 'white',
                        fontWeight: 600
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleViewProfile(student.rut)}
                      sx={{
                        backgroundColor: '#1976d2',
                        '&:hover': {
                          backgroundColor: '#1565c0'
                        },
                        textTransform: 'none'
                      }}
                    >
                      Hoja de Vida
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default ProgramDirectorStudents;
