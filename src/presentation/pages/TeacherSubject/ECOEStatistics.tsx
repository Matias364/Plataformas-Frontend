import { Box, Typography, Card, TextField, Tabs, Tab, CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend } from 'chart.js';
import { Course } from '../../../domain/course/Course';
import { CourseService } from '../../../infrastructure/services/CourseService';

Chart.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend);

interface StudentInfo {
  id: string;
  rut: string;
  name: string;
  email: string;
  grade: number;
  is_active: boolean;
  enrollmentId: string;
}

interface StatisticsData {
  gradeDistribution: { range: string; count: number; percentage: number }[];
  statusDistribution: { status: string; count: number; percentage: number }[];
  averageGrade: number;
  totalStudents: number;
  approvedStudents: number;
  failedStudents: number;
  notEvaluatedStudents: number;
}

const ECOEStatistics = () => {
  const [tab, setTab] = useState(0);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [statisticsData, setStatisticsData] = useState<StatisticsData | null>(null);

  // Cargar cursos al montar el componente
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
      } catch (error) {
        console.error('Error fetching courses:', error);
        setCourses([]);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  // Cargar estudiantes cuando cambie el curso seleccionado
  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedCourse) {
        setStatisticsData(null);
        return;
      }
      setLoadingStudents(true);
      try {
        const accessToken = localStorage.getItem('access_token');
        const enrollmentsRes = await fetch(`http://localhost:3001/api/v1/courses/${selectedCourse.id}/enrollments`, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        const enrollments = await enrollmentsRes.json();

        const studentsData: StudentInfo[] = await Promise.all(
          (enrollments || []).map(async (enrollment: any) => {
            const studentId = enrollment.student?.id;
            const grade = enrollment.grade || 0;
            const enrollmentId = enrollment.id;
            if (!studentId) return null;
            const studentRes = await fetch(`http://localhost:3001/api/v1/students/${studentId}`, {
              headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            const student = await studentRes.json();
            return {
              id: student.id || studentId,
              rut: student.rut,
              name: student.fullname || 'Sin nombre',
              email: student.email,
              grade: grade,
              is_active: student.is_active !== false,
              enrollmentId: enrollmentId,
            };
          })
        );
        const filteredStudents = studentsData.filter(Boolean) as StudentInfo[];
        
        // Calcular estadísticas
        calculateStatistics(filteredStudents);
      } catch (error) {
        console.error('Error fetching students:', error);
        setStatisticsData(null);
      } finally {
        setLoadingStudents(false);
      }
    };
    fetchStudents();
  }, [selectedCourse]);

  const calculateStatistics = (studentsData: StudentInfo[]) => {
    const totalStudents = studentsData.length;
    if (totalStudents === 0) {
      setStatisticsData(null);
      return;
    }

    // Distribución por rangos de notas - 3 rangos
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

  const handleCourseChange = (courseId: string) => {
    const course = courses.find(c => c.id.toString() === courseId);
    setSelectedCourse(course || null);
  };

  // Datos para gráficos
  const getGradeDistributionChart = () => {
    if (!statisticsData) return null;
    
    return {
      labels: statisticsData.gradeDistribution.map(item => item.range),
      datasets: [{
        label: 'Cantidad de Estudiantes',
        data: statisticsData.gradeDistribution.map(item => item.count),
        backgroundColor: ['#4CAF50', '#FFC107', '#F44336', '#9E9E9E'], // Verde (Satisfactorio), Amarillo (Suficiente), Rojo (Insuficiente), Gris (Sin evaluar)
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
    if (!statisticsData) return null;
    
    const approvalRate = (statisticsData.approvedStudents / statisticsData.totalStudents) * 100;
    const failureRate = (statisticsData.failedStudents / statisticsData.totalStudents) * 100;
    const notEvaluatedRate = (statisticsData.notEvaluatedStudents / statisticsData.totalStudents) * 100;
    
    return {
      labels: ['Tasa de Aprobación', 'Tasa de Reprobación', 'Sin Evaluar'],
      datasets: [{
        label: 'Porcentaje',
        data: [approvalRate, failureRate, notEvaluatedRate],
        backgroundColor: ['#4CAF50', '#F44336', '#9E9E9E'],
        borderColor: ['#388E3C', '#D32F2F', '#757575'],
        borderWidth: 2,
        tension: 0.4
      }]
    };
  };

  return (
    <Box sx={{ width: '100%', mt: 3 }}>
      <Typography variant="h4" fontWeight={700} mb={2} color='black'>
        Estadísticas de Asignatura
      </Typography>

      {/* Selector de curso */}
      <Box sx={{ mb: 3 }}>
        <TextField
          select
          size="small"
          label="Seleccionar Curso"
          value={selectedCourse?.id?.toString() || ''}
          onChange={e => handleCourseChange(e.target.value)}
          sx={{
            minWidth: 400,
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
                  {`${course.subject.name} | Semestre: ${course.semester} | Año: ${course.year}`}
                </option>
              ))}
            </>
          )}
        </TextField>
      </Box>

      {loadingStudents ? (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
          <CircularProgress size={30} sx={{ mr: 2 }} />
          <Typography>Cargando datos de estudiantes...</Typography>
        </Box>
      ) : !selectedCourse ? (
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
            Seleccione un curso
          </Typography>
          <Typography color="text.secondary" fontSize={15}>
            Para ver las estadísticas, seleccione un curso del selector de arriba
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
                Porcentajes de aprobación, reprobación y estudiantes sin evaluar
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
                                return `${context.label}: ${value.toFixed(1)}%`;
                              }
                            }
                          }
                        },
                        scales: { 
                          y: { 
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                              callback: (value) => `${value}%`
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
            No hay datos disponibles para el curso seleccionado
          </Typography>
        </Card>
      )}
    </Box>
  );
};

export default ECOEStatistics;