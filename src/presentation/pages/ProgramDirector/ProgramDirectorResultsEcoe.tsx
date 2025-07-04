import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
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
  Chip,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  SelectChangeEvent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { EcoeResultsService, EcoeOption } from '../../../infrastructure/services/EcoeResultsService';
import { EcoeResultWithStudentInfo } from '../../../domain/ecoe/EcoeResult';

// Datos de prueba para los resultados ECOE - ELIMINADOS (serán reemplazados por datos dinámicos)

const ProgramDirectorResultsEcoe: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number | ''>('');
  const [selectedSemester, setSelectedSemester] = useState<number | ''>('');
  const [selectedCycle, setSelectedCycle] = useState<string | ''>('');
  const [ecoeOptions, setEcoeOptions] = useState<EcoeOption[]>([]);
  const [results, setResults] = useState<EcoeResultWithStudentInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [ecoeLoading, setEcoeLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<EcoeResultWithStudentInfo | null>(null);

  // Cargar lista de ECOEs al montar el componente
  useEffect(() => {
    const loadEcoes = async () => {
      try {
        setEcoeLoading(true);
        const ecoes = await EcoeResultsService.getEcoes();
        setEcoeOptions(ecoes);
        setError(null);
      } catch (err) {
        setError('Error al cargar la lista de ECOEs');
        console.error('Error loading ECOEs:', err);
      } finally {
        setEcoeLoading(false);
      }
    };

    loadEcoes();
  }, []);

  // Cargar resultados cuando cambian los filtros
  useEffect(() => {
    if (ecoeOptions.length > 0) {
      loadEcoeResultsWithFilters();
    }
  }, [selectedYear, selectedSemester, selectedCycle, ecoeOptions]);

  const loadEcoeResultsWithFilters = async () => {
    setLoading(true);
    setError('');
    setResults([]);

    try {
      // Filtrar ECOEs basado en los filtros seleccionados
      const filteredEcoes = ecoeOptions.filter(ecoe => {
        const yearMatch = selectedYear === '' || ecoe.year === selectedYear;
        const semesterMatch = selectedSemester === '' || ecoe.semester === selectedSemester;
        const cycleMatch = selectedCycle === '' || ecoe.cycle === selectedCycle;
        
        return yearMatch && semesterMatch && cycleMatch;
      });

      if (filteredEcoes.length === 0) {
        setResults([]);
        setLoading(false);
        return;
      }

      // Cargar resultados para todos los ECOEs que coinciden con los filtros
      const allResults: EcoeResultWithStudentInfo[] = [];
      
      for (const ecoe of filteredEcoes) {
        try {
          const ecoeResults = await EcoeResultsService.getEcoeResultsWithStudentInfo(ecoe.id);
          allResults.push(...ecoeResults);
        } catch (error) {
          console.error(`Error cargando resultados para ECOE ${ecoe.id}:`, error);
        }
      }

      setResults(allResults);
    } catch (error) {
      console.error('Error cargando resultados de ECOE:', error);
      setError('Error al cargar los resultados. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar el cambio de año
  const handleYearChange = (event: SelectChangeEvent<number | ''>) => {
    const value = event.target.value;
    setSelectedYear(value === '' ? '' : Number(value));
  };

  // Función para manejar el cambio de semestre
  const handleSemesterChange = (event: SelectChangeEvent<number | ''>) => {
    const value = event.target.value;
    setSelectedSemester(value === '' ? '' : Number(value));
  };

  // Función para manejar el cambio de ciclo
  const handleCycleChange = (event: SelectChangeEvent<string>) => {
    setSelectedCycle(event.target.value);
  };

  // Obtener años únicos
  const getUniqueYears = () => {
    const years = [...new Set(ecoeOptions.map(ecoe => ecoe.year))];
    return years.sort((a, b) => b - a); // Ordenar descendente
  };

  // Obtener semestres únicos
  const getUniqueSemesters = () => {
    return [1, 2];
  };

  // Obtener ciclos únicos
  const getUniqueCycles = () => {
    const cycles = [...new Set(ecoeOptions.map(ecoe => ecoe.cycle))];
    return cycles.sort();
  };

  // Función para obtener color de la calificación
  const getGradeColor = (grade: number) => {
    if (grade < 4.0) return '#f44336'; // Rojo
    if (grade >= 4.0 && grade <= 5.4) return '#ff9800'; // Amarillo
    if (grade >= 5.5) return '#4caf50'; // Verde
    return '#9e9e9e'; // Gris
  };

  // Función para obtener color del nivel de logro
  const getAchievementLevelColor = (level: string) => {
    if (!level || level === 'N/A') return '#9e9e9e'; // Gris para N/A
    
    switch (level?.toLowerCase()) {
      case 'excelente':
      case 'excellent':
        return '#4caf50'; // Verde
      case 'satisfactorio':
      case 'bueno':
      case 'good':
      case 'bien':
        return '#2196f3'; // Azul
      case 'suficiente':
      case 'regular':
      case 'average':
        return '#ff9800'; // Naranja
      case 'insuficiente':
      case 'deficiente':
      case 'poor':
      case 'malo':
        return '#f44336'; // Rojo
      default:
        return '#9e9e9e'; // Gris
    }
  };

  // Función para obtener la información del ECOE por ID
  const getEcoeInfo = (ecoeId: number) => {
    return ecoeOptions.find(ecoe => ecoe.id === ecoeId);
  };

  // Función para formatear el nombre del ECOE
  const formatEcoeName = (ecoeId: number) => {
    const ecoe = getEcoeInfo(ecoeId);
    if (!ecoe) return 'ECOE No encontrado';
    return `${ecoe.name} - S${ecoe.semester} ${ecoe.year}`;
  };

  // Función para abrir el modal de calificaciones
  const handleOpenModal = (student: EcoeResultWithStudentInfo) => {
    setSelectedStudent(student);
    setModalOpen(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedStudent(null);
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
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Año</InputLabel>
            <Select
              value={selectedYear}
              onChange={handleYearChange}
              label="Año"
              disabled={ecoeLoading}
            >
              <MenuItem value="">Todos</MenuItem>
              {getUniqueYears().map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Semestre</InputLabel>
            <Select
              value={selectedSemester}
              onChange={handleSemesterChange}
              label="Semestre"
              disabled={ecoeLoading}
            >
              <MenuItem value="">Todos</MenuItem>
              {getUniqueSemesters().map((semester) => (
                <MenuItem key={semester} value={semester}>
                  {semester}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 140 }}>
            <InputLabel>Ciclo</InputLabel>
            <Select
              value={selectedCycle}
              onChange={handleCycleChange}
              label="Ciclo"
              disabled={ecoeLoading}
            >
              <MenuItem value="">Todos</MenuItem>
              {getUniqueCycles().map((cycle) => (
                <MenuItem key={cycle} value={cycle}>
                  {cycle}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
                {(() => {
                  const filters = [];
                  if (selectedYear !== '') filters.push(`${selectedYear}`);
                  if (selectedSemester !== '') filters.push(`S${selectedSemester}`);
                  if (selectedCycle !== '') filters.push(`${selectedCycle}`);
                  
                  return filters.length > 0 
                    ? `Filtros aplicados: ${filters.join(' - ')}` 
                    : 'Mostrando todos los resultados disponibles';
                })()}
              </Typography>
            </Box>
          </Box>

          {/* Estados de loading y error */}
          {ecoeLoading && (
            <Box display="flex" justifyContent="center" alignItems="center" py={3}>
              <CircularProgress size={24} sx={{ mr: 2 }} />
              <Typography>Cargando ECOEs...</Typography>
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {loading && (
            <Box display="flex" justifyContent="center" alignItems="center" py={3}>
              <CircularProgress size={24} sx={{ mr: 2 }} />
              <Typography>Cargando resultados...</Typography>
            </Box>
          )}

          {!loading && !error && results.length === 0 && (
            <Box display="flex" justifyContent="center" alignItems="center" py={4}>
              <Typography color="text.secondary">
                No hay resultados disponibles para los filtros seleccionados
              </Typography>
            </Box>
          )}

          {/* Tabla de Resultados */}
          {!loading && !error && results.length > 0 && (
            <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 600, color: '#555', minWidth: 150 }}>RUT</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#555' }}>Nombre</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#555' }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#555' }}>ECOE</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#555', textAlign: 'center', minWidth: 180 }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.map((student) => (
                    <TableRow
                      key={student.id}
                      sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}
                    >
                      <TableCell sx={{ color: '#666' }}>{student.rut}</TableCell>
                      <TableCell sx={{ color: '#333', fontWeight: 500 }}>{student.fullname}</TableCell>
                      <TableCell sx={{ color: '#666' }}>{student.email}</TableCell>
                      <TableCell sx={{ color: '#333' }}>{formatEcoeName(student.ecoeId)}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Button
                          variant="outlined"
                          size="medium"
                          startIcon={<VisibilityIcon />}
                          onClick={() => handleOpenModal(student)}
                          sx={{
                            textTransform: 'none',
                            fontSize: '0.875rem',
                            px: 3,
                            py: 1
                          }}
                        >
                          Calificaciones
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Modal para mostrar calificaciones */}
      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pb: 1
        }}>
          <Typography variant="h6" component="h2">
            Calificaciones Detalladas
          </Typography>
          <Button
            onClick={handleCloseModal}
            color="inherit"
            sx={{ minWidth: 'auto', p: 1 }}
          >
            <CloseIcon />
          </Button>
        </DialogTitle>
        <DialogContent>
          {selectedStudent && (
            <Box>
              {/* Información del estudiante */}
              <Card sx={{ mb: 3, backgroundColor: '#f8f9fa' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ flex: '1 1 200px' }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Estudiante
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {selectedStudent.fullname}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: '1 1 200px' }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        RUT
                      </Typography>
                      <Typography variant="body1">
                        {selectedStudent.rut}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: '1 1 200px' }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        ECOE
                      </Typography>
                      <Typography variant="body1">
                        {formatEcoeName(selectedStudent.ecoeId)}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Nivel de logro general */}
              <Box sx={{ mb: 3, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Nivel de Logro General
                </Typography>
                <Chip 
                  label={selectedStudent.finalAchievementLevel || 'N/A'}
                  size="medium"
                  sx={{
                    backgroundColor: getAchievementLevelColor(selectedStudent.finalAchievementLevel || 'N/A'),
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '1rem',
                    height: '40px',
                    px: 2
                  }}
                />
              </Box>

              {/* Competencias evaluadas */}
              <Typography variant="h6" sx={{ mb: 2 }}>
                Competencias Evaluadas
              </Typography>
              {selectedStudent.competenciesEvaluated && selectedStudent.competenciesEvaluated.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {selectedStudent.competenciesEvaluated.map((competency) => (
                    <Box key={competency.competencyId} sx={{ flex: '1 1 250px', minWidth: '250px' }}>
                      <Card sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="h6" sx={{ mb: 1, textAlign: 'center' }}>
                            Competencia {competency.competencyId}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
                            {competency.competencyName}
                          </Typography>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography
                              variant="h4"
                              sx={{ 
                                color: getGradeColor(competency.grade),
                                fontWeight: 700,
                                mb: 1
                              }}
                            >
                              {competency.grade.toFixed(1)}
                            </Typography>
                            <Chip
                              label={competency.achievementLevel}
                              size="small"
                              sx={{
                                backgroundColor: getAchievementLevelColor(competency.achievementLevel),
                                color: 'white',
                                fontWeight: 600
                              }}
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No hay competencias evaluadas para este estudiante
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProgramDirectorResultsEcoe;
