import { Box, Typography, Card, FormControl, InputLabel, Select, MenuItem, CircularProgress, Tabs, Tab } from '@mui/material';
import { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend } from 'chart.js';
import { getAvailableEcoes, fetchStudentsByEcoeId, Student, getStudentsByEcoeId } from '../../../infrastructure/services/EcoeService';
import { Ecoe } from '../../../domain/ecoe/Ecoe';

Chart.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend);

interface StatisticsData {
  gradeDistribution: { range: string; count: number; percentage: number }[];
  statusDistribution: { status: string; count: number; percentage: number }[];
  averageGrade: number;
  totalStudents: number;
  approvedStudents: number;
  failedStudents: number;
  notEvaluatedStudents: number;
}

const ECOEStatisticsV2 = () => {
  const [ecoes, setEcoes] = useState<Ecoe[]>([]);
  const [selectedType, setSelectedType] = useState('');
  const [selectedEcoe, setSelectedEcoe] = useState<Ecoe | null>(null);
  const [competencyAverages, setCompetencyAverages] = useState<{ name: string; average: number }[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingEcoes, setLoadingEcoes] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [statisticsData, setStatisticsData] = useState<StatisticsData | null>(null);
  const [tab, setTab] = useState(0);

  // Cargar ECOEs disponibles
  useEffect(() => {
    if (!selectedType) {
        setEcoes([]);
        setSelectedEcoe(null);
        //setLoadingEcoes(false);
        return;
    }
    const fetchEcoes = async () => {
      setLoadingEcoes(true);
      try {
        // Puedes obtener el ciclo desde la URL o contexto, aquí ejemplo con "basico"
        //const cycle = "BASICO";
        const ecoesList = await getAvailableEcoes(selectedType);
        setEcoes(ecoesList);
        setSelectedEcoe(ecoesList.length > 0 ? ecoesList[0] : null);
      } catch (error) {
        setEcoes([]);
        setSelectedEcoe(null);
      } finally {
        setLoadingEcoes(false);
      }
    };
    fetchEcoes();
  }, [selectedType]);

  // Cargar estudiantes del ECOE seleccionado
  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedEcoe) {
        setStudents([]);
        setStatisticsData(null);
        return;
      }
      setLoadingStudents(true);
      try {
        const studentsList = await fetchStudentsByEcoeId(selectedEcoe.id);
        setStudents(studentsList);
        calculateStatistics(studentsList);
      } catch (error) {
        setStudents([]);
        setStatisticsData(null);
      } finally {
        setLoadingStudents(false);
      }
    };
    fetchStudents();
    // eslint-disable-next-line
  }, [selectedEcoe]);

  //Cargar promedios de competencias
  useEffect(() => {
    if (!selectedEcoe) {
      setCompetencyAverages([]);
      return;
    }
    const fetchCompetencyAverages = async () => {
        try {
            const studentEcoeData = await getStudentsByEcoeId(selectedEcoe.id);
            // Calcular promedios por competencia
            const competencyMap: { [name: string]: number[] } = {};
            studentEcoeData.forEach((student: any) => {
                (student.competenciesEvaluated || []).forEach((competency: any) => {
                    if (!competencyMap[competency.competencyName]) {
                        competencyMap[competency.competencyName] = [];
                    }
                    if (typeof competency.grade === 'number' && competency.grade > 0) {
                        competencyMap[competency.competencyName].push(competency.grade);
                    }
                });
            });
            const averages = Object.entries(competencyMap).map(([name, grades]) => ({
                name,
                average: grades.length > 0 ? Number((grades.reduce((sum, grade) => sum + grade, 0) / grades.length).toFixed(2)) : 0
            }));
            setCompetencyAverages(averages);
        } catch (error) {
            console.error('Error al cargar promedios de competencias:', error);
            setCompetencyAverages([]);
        }
    };
    fetchCompetencyAverages();
}, [selectedEcoe]);

  // Calcular estadísticas
  const calculateStatistics = (studentsData: Student[]) => {
    const totalStudents = studentsData.length;
    if (totalStudents === 0) {
      setStatisticsData(null);
      return;
    }

    // Distribución por rangos de notas
    const gradeRanges = [
      { range: 'Satisfactorio (≥5.5)', min: 5.5, max: 7.0 },
      { range: 'Suficiente (4.0-5.4)', min: 4.0, max: 5.4 },
      { range: 'Insuficiente (<4.0)', min: 1.0, max: 3.9 },
      { range: 'Sin Evaluar', min: 0, max: 0 }
    ];

    const gradeDistribution = gradeRanges.map(range => {
      const count = studentsData.filter(s => {
        if (range.range === 'Sin Evaluar') {
          return s.grade === 0;
        }
        return s.grade >= range.min && s.grade <= range.max;
      }).length;
      return {
        range: range.range,
        count,
        percentage: Math.round((count / totalStudents) * 100)
      };
    });

    // Distribución por estado
    const approvedStudents = studentsData.filter(s => s.grade >= 4.0).length;
    const failedStudents = studentsData.filter(s => s.grade > 0 && s.grade < 4.0).length;
    const notEvaluatedStudents = studentsData.filter(s => s.grade === 0).length;

    const statusDistribution = [
      { status: 'Aprobados', count: approvedStudents, percentage: Math.round((approvedStudents / totalStudents) * 100) },
      { status: 'Reprobados', count: failedStudents, percentage: Math.round((failedStudents / totalStudents) * 100) },
      { status: 'Sin Evaluar', count: notEvaluatedStudents, percentage: Math.round((notEvaluatedStudents / totalStudents) * 100) }
    ];

    // Promedio general (excluyendo notas 0)
    const evaluatedStudents = studentsData.filter(s => s.grade > 0);
    const averageGrade = evaluatedStudents.length > 0 
      ? Number((evaluatedStudents.reduce((sum, s) => sum + s.grade, 0) / evaluatedStudents.length).toFixed(2))
      : 0;

    setStatisticsData({
      gradeDistribution,
      statusDistribution,
      averageGrade,
      totalStudents,
      approvedStudents,
      failedStudents,
      notEvaluatedStudents
    });
  };

  // Datos para gráficos
  const getGradeDistributionChart = () => {
    if (!statisticsData) return null;
    return {
      labels: statisticsData.gradeDistribution.map(item => item.range),
      datasets: [{
        label: 'Cantidad de Estudiantes',
        data: statisticsData.gradeDistribution.map(item => item.count),
        backgroundColor: ['#4CAF50', '#FFC107', '#F44336', '#9E9E9E'],
        borderWidth: 1,
        borderRadius: 8,
      }]
    };
  };

  const getStatusPieChart = () => {
    if (!statisticsData) return null;
    return {
      labels: statisticsData.statusDistribution.map(item => item.status),
      datasets: [{
        data: statisticsData.statusDistribution.map(item => item.count),
        backgroundColor: ['#4CAF50', '#F44336', '#9E9E9E'],
        borderWidth: 2,
        borderColor: '#fff'
      }]
    };
  };

  const getAverageChart = () => {
    if (!competencyAverages.length) return null;
    // Colores según promedio
    const getColor = (avg: number) => {
        if (avg >= 5.5) return '#4CAF50'; // Satisfactorio
        if (avg >= 4.0) return '#FFC107'; // Suficiente
        return '#F44336'; // Insuficiente
    };
    return {
        labels: competencyAverages.map(item => item.name),
        datasets: [{
            label: 'Promedio por Competencia',
            data: competencyAverages.map(item => item.average),
            backgroundColor: competencyAverages.map(item => getColor(item.average)),
            borderWidth: 1,
            borderRadius: 8,
        }]
    };
  };

  return (
    <Box sx={{ width: '100%', mt: 3 }}>
      <Typography variant="h4" fontWeight={700} mb={2} color='black'>
        Estadísticas de ECOE
      </Typography>

      {/* Selector de tipo de ECOE */}
      <Box sx={{ mb: 3 }}>
        <FormControl size="small" sx={{ minWidth: 180, bgcolor: '#fff', borderRadius: 2 }}>
          <InputLabel id="select-ecoe-label">Seleccionar Ciclo ECOE</InputLabel>
          <Select
            labelId="select-ecoe-label"
            value={selectedType}
            label="Seleccionar Ciclo ECOE"
            onChange={e => setSelectedType(e.target.value)}
            sx={{ fontWeight: 500, textAlign: "center" }}
            >
                <MenuItem value="">
                    <em>Seleccione Ciclo</em>
                </MenuItem>
                <MenuItem value="BASICO">Básico</MenuItem>
                <MenuItem value="PROFESIONAL">Profesional</MenuItem>
                <MenuItem value="Final">Final</MenuItem>
            </Select>
        </FormControl>
        { /* Selector de periodo academico (año-semestre) */}
        <FormControl size="small" sx={{ minWidth: 220, ml: 2, bgcolor: '#fff', borderRadius: 2 }}>
            <InputLabel id="select-ecoe-period-label">Seleccionar Periodo Academico</InputLabel>
            <Select
                labelId='select-ecoe-period-label'
                value={selectedEcoe?.id ?? ''}
                label="Seleccionar Periodo Academico"
                onChange={e => {
                    const ecoeId = Number(e.target.value);
                    const ecoe = ecoes.find(ecoe => ecoe.id === ecoeId) || null;
                    setSelectedEcoe(ecoe);
                }}
                disabled={loadingEcoes || ecoes.length === 0}
                sx={{ fontWeight: 500, textAlign: "center" }}
                renderValue={selected => {
                    const ecoe = ecoes.find(e => e.id === selected);
                    return ecoe ? `${ecoe.year}-${ecoe.semester}` : '';
                }}
            >
            {ecoes.map(ecoe => (
              <MenuItem key={ecoe.id} value={ecoe.id} sx={{ justifyContent: "center", textAlign: "center" }}>
                {`${ecoe.year}-${ecoe.semester}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loadingStudents ? (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
          <CircularProgress size={30} sx={{ mr: 2 }} />
          <Typography>Cargando datos de estudiantes...</Typography>
        </Box>
      ) : !selectedEcoe ? (
        <Card
          variant="outlined"
          sx={{
            borderRadius: 3,
            boxShadow: 0,
            borderColor: '#ECECEC',
            p: 3,
            bgcolor: '#fff',
            textAlign: 'center'
          }}
        >
          <Typography variant="h6" fontWeight={600} mb={1}>
            Seleccione un ECOE
          </Typography>
          <Typography color="text.secondary" fontSize={15}>
            Para ver las estadísticas, seleccione un ECOE del selector de arriba
          </Typography>
        </Card>
      ) : statisticsData ? (
        <>
          {/* Tarjetas de resumen */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 4 }}>
            <Card sx={{ p: 3, textAlign: 'center', bgcolor: '#E3F2FD', borderRadius: 3 }}>
              <Typography variant="h4" fontWeight={700} color="#1976D2">
                {statisticsData.totalStudents}
              </Typography>
              <Typography color="text.secondary">Total Estudiantes</Typography>
            </Card>
            <Card sx={{ p: 3, textAlign: 'center', bgcolor: '#E8F5E8', borderRadius: 3 }}>
              <Typography variant="h4" fontWeight={700} color="#4CAF50">
                {statisticsData.averageGrade.toFixed(1)}
              </Typography>
              <Typography color="text.secondary">Promedio General</Typography>
            </Card>
            <Card sx={{ p: 3, textAlign: 'center', bgcolor: '#F3E5F5', borderRadius: 3 }}>
              <Typography variant="h4" fontWeight={700} color="#9C27B0">
                {Math.round((statisticsData.approvedStudents / statisticsData.totalStudents) * 100)}%
              </Typography>
              <Typography color="text.secondary">Tasa de Aprobación</Typography>
            </Card>
            <Card sx={{ p: 3, textAlign: 'center', bgcolor: '#FFF3E0', borderRadius: 3 }}>
              <Typography variant="h4" fontWeight={700} color="#FF9800">
                {statisticsData.notEvaluatedStudents}
              </Typography>
              <Typography color="text.secondary">Sin Evaluar</Typography>
            </Card>
          </Box>

          {/* Tabs para diferentes vistas */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ bgcolor: '#fff', borderRadius: 2, minHeight: 44 }}>
              <Tab label="Distribución de Notas" sx={{ fontWeight: 600, minWidth: 140 }} />
              <Tab label="Estado Académico" sx={{ fontWeight: 600, minWidth: 140 }} />
              <Tab label="Tasas de Rendimiento" sx={{ fontWeight: 600, minWidth: 140 }} />
            </Tabs>
          </Box>

          {/* Contenido basado en la pestaña seleccionada */}
          {tab === 0 && (
            <Card
              variant="outlined"
              sx={{
                borderRadius: 3,
                boxShadow: 0,
                borderColor: '#ECECEC',
                p: 3,
                bgcolor: '#fff',
                mb: 3,
              }}
            >
              <Typography variant="h6" fontWeight={700} mb={0.5}>
                Distribución de Estudiantes por Nivel de Desempeño
              </Typography>
              <Typography color="text.secondary" fontSize={15} mb={3}>
                Clasificación de estudiantes: Satisfactorio (≥5.5), Suficiente (4.0-5.4), Insuficiente (&lt;4.0)
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                <Box sx={{ width: '100%', maxWidth: 600, height: 400 }}>
                  {getGradeDistributionChart() && (
                    <Bar
                      data={getGradeDistributionChart()!}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { 
                          legend: { position: 'top' },
                          tooltip: {
                            callbacks: {
                              label: (context) => {
                                const value = context.parsed.y;
                                const total = statisticsData.totalStudents;
                                const percentage = Math.round((value / total) * 100);
                                return `${context.dataset.label}: ${value} estudiantes (${percentage}%)`;
                              }
                            }
                          }
                        },
                        scales: { 
                          y: { 
                            beginAtZero: true,
                            ticks: { stepSize: 1 }
                          } 
                        },
                      }}
                    />
                  )}
                </Box>
              </Box>
            </Card>
          )}

          {tab === 1 && (
            <Card
              variant="outlined"
              sx={{
                borderRadius: 3,
                boxShadow: 0,
                borderColor: '#ECECEC',
                p: 3,
                bgcolor: '#fff',
                mb: 3,
              }}
            >
              <Typography variant="h6" fontWeight={700} mb={0.5}>
                Estado Académico de Estudiantes
              </Typography>
              <Typography color="text.secondary" fontSize={15} mb={3}>
                Proporción de estudiantes aprobados, reprobados y sin evaluar
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                <Box sx={{ width: '100%', maxWidth: 400, height: 400 }}>
                  {getStatusPieChart() && (
                    <Pie
                      data={getStatusPieChart()!}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { 
                          legend: { position: 'right' },
                          tooltip: {
                            callbacks: {
                              label: (context) => {
                                const value = context.parsed;
                                const total = statisticsData.totalStudents;
                                const percentage = Math.round((value / total) * 100);
                                return `${context.label}: ${value} estudiantes (${percentage}%)`;
                              }
                            }
                          }
                        },
                      }}
                    />
                  )}
                </Box>
              </Box>
            </Card>
          )}

          {tab === 2 && (
            <Card
              variant="outlined"
              sx={{
                borderRadius: 3,
                boxShadow: 0,
                borderColor: '#ECECEC',
                p: 3,
                bgcolor: '#fff',
                mb: 3,
              }}
            >
              <Typography variant="h6" fontWeight={700} mb={0.5}>
                Tasas de Rendimiento Académico
              </Typography>
              <Typography color="text.secondary" fontSize={15} mb={3}>
                Rendimiento promedio por competencia evaluada en ECOE
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                <Box sx={{ width: '100%', maxWidth: 600, height: 400 }}>
                  {getAverageChart() && (
                    <Bar
                      data={getAverageChart()!}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { 
                          legend: { display: false },
                          tooltip: {
                            callbacks: {
                              label: (context) => {
                                const value = context.parsed.y;
                                return `Nota promedio: ${value.toFixed(1)}`;
                              }
                            }
                          }
                        },
                        scales: { 
                          y: { 
                            beginAtZero: true,
                            max: 7,
                            ticks: {
                                stepSize: 1,
                                callback: (value) => Number(value) === 0 ? '0' : Number(value).toFixed(1),
                            }
                          } 
                        },
                      }}
                    />
                  )}
                </Box>
              </Box>
            </Card>
          )}

          {/* Tabla de detalles */}
          <Card
            variant="outlined"
            sx={{
              borderRadius: 3,
              boxShadow: 0,
              borderColor: '#ECECEC',
              p: 3,
              bgcolor: '#fff',
            }}
          >
            <Typography variant="h6" fontWeight={700} mb={2}>
              Detalle Estadístico
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3 }}>
              {statisticsData.gradeDistribution.map((item, index) => (
                <Box key={index} sx={{ p: 2, bgcolor: '#F8F9FA', borderRadius: 2 }}>
                  <Typography fontWeight={600} fontSize={14}>
                    {item.range}
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="primary">
                    {item.count} estudiantes ({item.percentage}%)
                  </Typography>
                </Box>
              ))}
            </Box>
          </Card>
        </>
      ) : (
        <Card
          variant="outlined"
          sx={{
            borderRadius: 3,
            boxShadow: 0,
            borderColor: '#ECECEC',
            p: 3,
            bgcolor: '#fff',
            textAlign: 'center'
          }}
        >
          <Typography color="text.secondary">
            No hay datos disponibles para el ECOE seleccionado
          </Typography>
        </Card>
      )}
    </Box>
  );
};

export default ECOEStatisticsV2;