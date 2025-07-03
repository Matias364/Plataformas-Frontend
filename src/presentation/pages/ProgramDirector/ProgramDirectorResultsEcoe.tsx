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
  InputAdornment,
  Chip,
  Card,
  CardContent,
  ButtonGroup
} from '@mui/material';
import {
  Search as SearchIcon,
  GetApp as GetAppIcon
} from '@mui/icons-material';

// Datos de prueba para los resultados ECOE
const ecoeResultsData = [
  {
    id: 'ST0001',
    name: 'Carlos Martinez',
    c1: 6.1,
    c2: 5.0,
    c3: 6.2,
    c4: 5.9,
    c5: 4.9,
    c6: 5.5,
    c7: 4.4,
    c8: 6.9,
    average: 6.5
  },
  {
    id: 'ST0002',
    name: 'Maria Gonzalez',
    c1: 5.9,
    c2: 6.6,
    c3: 7.0,
    c4: 5.9,
    c5: 7.0,
    c6: 6.8,
    c7: 4.0,
    c8: 5.7,
    average: 6.7
  },
  {
    id: 'ST0003',
    name: 'Juan Perez',
    c1: 5.0,
    c2: 4.5,
    c3: 6.0,
    c4: 5.5,
    c5: 7.0,
    c6: 4.8,
    c7: 3.8,
    c8: 6.4,
    average: 5.4
  }
];

const ProgramDirectorResultsEcoe: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEcoe, setSelectedEcoe] = useState('ECOE 2023-2');
  const [selectedFilter, setSelectedFilter] = useState('Por Estudiante');
  const [filteredResults, setFilteredResults] = useState(ecoeResultsData);

  // Función para filtrar estudiantes
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    
    const filtered = ecoeResultsData.filter(student =>
      student.name.toLowerCase().includes(value) ||
      student.id.toLowerCase().includes(value)
    );
    setFilteredResults(filtered);
  };

  // Función para manejar el cambio de ECOE
  const handleEcoeChange = (event: any) => {
    setSelectedEcoe(event.target.value);
  };

  // Función para manejar el filtro
  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
  };

  // Función para ver detalles
  const handleViewDetails = (studentId: string) => {
    console.log('Ver detalles del estudiante:', studentId);
    // Aquí iría la navegación a los detalles del estudiante
  };

  // Función para obtener color de la calificación
  const getGradeColor = (grade: number) => {
    if (grade >= 6.0) return '#4caf50'; // Verde
    if (grade >= 5.0) return '#ff9800'; // Naranja
    if (grade >= 4.0) return '#f44336'; // Rojo
    return '#9e9e9e'; // Gris
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
          Resultados ECOE
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>ECOE</InputLabel>
            <Select
              value={selectedEcoe}
              onChange={handleEcoeChange}
              label="ECOE"
            >
              <MenuItem value="ECOE 2023-1">ECOE 2023-1</MenuItem>
              <MenuItem value="ECOE 2023-2">ECOE 2023-2</MenuItem>
              <MenuItem value="ECOE 2024-1">ECOE 2024-1</MenuItem>
              <MenuItem value="ECOE 2024-2">ECOE 2024-2</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<GetAppIcon />}
            sx={{ color: '#666', borderColor: '#ddd' }}
          >
            Exportar
          </Button>
        </Box>
      </Box>

      {/* Resumen de Resultados Section */}
      <Card sx={{ mb: 3, boxShadow: 2 }}>
        <CardContent>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 2 
          }}>
            <Box>
              <Typography variant="h6" component="h2" fontWeight={600} color="#333">
                Resumen de Resultados
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedEcoe} (Noviembre 2023)
              </Typography>
            </Box>
            <TextField
              placeholder="Buscar estudiante, RUT..."
              value={searchTerm}
              onChange={handleSearch}
              variant="outlined"
              size="small"
              sx={{ width: 300 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Filtros */}
          <Box sx={{ mb: 2 }}>
            <ButtonGroup variant="outlined" size="small">
              <Button
                variant={selectedFilter === 'Por Estudiante' ? 'contained' : 'outlined'}
                onClick={() => handleFilterChange('Por Estudiante')}
                sx={{
                  backgroundColor: selectedFilter === 'Por Estudiante' ? '#e3f2fd' : 'transparent',
                  color: selectedFilter === 'Por Estudiante' ? '#1976d2' : '#666',
                  borderColor: '#ddd'
                }}
              >
                Por Estudiante
              </Button>
              <Button
                variant={selectedFilter === 'Por Competencia' ? 'contained' : 'outlined'}
                onClick={() => handleFilterChange('Por Competencia')}
                sx={{
                  backgroundColor: selectedFilter === 'Por Competencia' ? '#e3f2fd' : 'transparent',
                  color: selectedFilter === 'Por Competencia' ? '#1976d2' : '#666',
                  borderColor: '#ddd'
                }}
              >
                Por Competencia
              </Button>
              <Button
                variant={selectedFilter === 'Por Estación' ? 'contained' : 'outlined'}
                onClick={() => handleFilterChange('Por Estación')}
                sx={{
                  backgroundColor: selectedFilter === 'Por Estación' ? '#e3f2fd' : 'transparent',
                  color: selectedFilter === 'Por Estación' ? '#1976d2' : '#666',
                  borderColor: '#ddd'
                }}
              >
                Por Estación
              </Button>
            </ButtonGroup>
          </Box>

          {/* Tabla de Resultados */}
          <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 600, color: '#555' }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#555' }}>Nombre</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#555', textAlign: 'center' }}>C1</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#555', textAlign: 'center' }}>C2</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#555', textAlign: 'center' }}>C3</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#555', textAlign: 'center' }}>C4</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#555', textAlign: 'center' }}>C5</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#555', textAlign: 'center' }}>C6</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#555', textAlign: 'center' }}>C7</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#555', textAlign: 'center' }}>C8</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#555', textAlign: 'center' }}>Promedio</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#555' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredResults.map((student) => (
                  <TableRow
                    key={student.id}
                    sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}
                  >
                    <TableCell sx={{ color: '#666' }}>{student.id}</TableCell>
                    <TableCell sx={{ color: '#333', fontWeight: 500 }}>{student.name}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Typography
                        variant="body2"
                        sx={{ 
                          color: getGradeColor(student.c1),
                          fontWeight: 600
                        }}
                      >
                        {student.c1.toFixed(1)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Typography
                        variant="body2"
                        sx={{ 
                          color: getGradeColor(student.c2),
                          fontWeight: 600
                        }}
                      >
                        {student.c2.toFixed(1)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Typography
                        variant="body2"
                        sx={{ 
                          color: getGradeColor(student.c3),
                          fontWeight: 600
                        }}
                      >
                        {student.c3.toFixed(1)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Typography
                        variant="body2"
                        sx={{ 
                          color: getGradeColor(student.c4),
                          fontWeight: 600
                        }}
                      >
                        {student.c4.toFixed(1)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Typography
                        variant="body2"
                        sx={{ 
                          color: getGradeColor(student.c5),
                          fontWeight: 600
                        }}
                      >
                        {student.c5.toFixed(1)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Typography
                        variant="body2"
                        sx={{ 
                          color: getGradeColor(student.c6),
                          fontWeight: 600
                        }}
                      >
                        {student.c6.toFixed(1)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Typography
                        variant="body2"
                        sx={{ 
                          color: getGradeColor(student.c7),
                          fontWeight: 600
                        }}
                      >
                        {student.c7.toFixed(1)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Typography
                        variant="body2"
                        sx={{ 
                          color: getGradeColor(student.c8),
                          fontWeight: 600
                        }}
                      >
                        {student.c8.toFixed(1)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Chip 
                        label={student.average.toFixed(1)}
                        size="small"
                        sx={{
                          backgroundColor: getGradeColor(student.average),
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleViewDetails(student.id)}
                        sx={{
                          backgroundColor: '#1976d2',
                          '&:hover': {
                            backgroundColor: '#1565c0'
                          },
                          textTransform: 'none'
                        }}
                      >
                        Ver Detalles
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProgramDirectorResultsEcoe;
