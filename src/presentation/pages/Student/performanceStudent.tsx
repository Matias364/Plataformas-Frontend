import { useState, useEffect } from 'react';
import SidebarStudent from './SidebarStudent';
import {
  Box, Typography, Paper, Select, MenuItem, Chip, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, InputBase, Stack, Divider, IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts';



// MOCKS
const mockUser = {
  name: "Hackerman Estudiante",
  picture: "https://randomuser.me/api/portraits/men/32.jpg"
};

// Define the Competencia type


// UTILS
const nivelColor = (nivel: string) => {
  switch (nivel) {
    case "SATISFACTORIO": return "primary";
    case "SUFICIENTE": return "warning";
    case "APROBADO": return "success";
    default: return "default";
  }
};

// Calcula el promedio de cada competencia considerando todas las asignaturas donde aparece


// IDs o nombres de asignaturas a las que se les asigna competencia 1 y 5
const competencia1Asignaturas = [
  "Enfermería y ciencias biológicas",
  "Morfología integral en enfermería",
  "Bases integrales de la enfermería"
];
const competencia5Asignaturas = [
  "Desarrollo personal y bienestar"
];

// Gráfico de barra: promedio de nota global por asignatura (en %)

const PerformanceStudent = () => {
  const [selected, setSelected] = useState('rendimiento');
  const [search, setSearch] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const [asignaturas, setAsignaturas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Obtener info del estudiante
        const accessToken = localStorage.getItem('access_token');
        console.log("Token de acceso:", accessToken);

        const resStudent = await fetch('http://localhost:3001/api/v1/students/me', {
          headers: {
            Authorization: `Bearer ${accessToken?.replace(/"/g, '')}`,
          },
        });
        const student = await resStudent.json();
        setUserData(student);

        // Obtener info de cada asignatura
        const asignaturasData = await Promise.all(
          (student.subjects || []).map(async (subj: any) => {
            const resAsig = await fetch(`http://localhost:3001/api/v1/subjects/${subj.subjectId}`);
            const asigInfo = await resAsig.json();

            // Asignar competencias según nombre de la asignatura
            let competencias: string[] = [];
            if (competencia1Asignaturas.includes(asigInfo.nombre)) {
              competencias.push("Competencia 1");
            }
            if (competencia5Asignaturas.includes(asigInfo.nombre)) {
              competencias.push("Competencia 5");
            }

            return {
              ...asigInfo,
              calificacion: subj.grade,
              semestre: subj.semester,
              competencias,
              notasCompetencias: {},
              nivel: subj.grade >= 6 ? "SATISFACTORIO" : subj.grade >= 4 ? "SUFICIENTE" : "REPROBADO",
            };
          })
        );
        setAsignaturas(asignaturasData);
      } catch (e) {
        // Manejo de error simple
        setAsignaturas([]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // Calcular porcentaje de competencias 1 y 5
  const totalCompetencia1EnMalla = 29;
  const totalCompetencia5EnMalla = 21;
  const cantidadCompetencia1 = asignaturas.filter(a => (a.competencias || []).includes("Competencia 1")).length;
  const cantidadCompetencia5 = asignaturas.filter(a => (a.competencias || []).includes("Competencia 5")).length;
  const porcentajeCompetencia1 = totalCompetencia1EnMalla > 0 ? Math.round((cantidadCompetencia1 / totalCompetencia1EnMalla) * 100) : 0;
  const porcentajeCompetencia5 = totalCompetencia5EnMalla > 0 ? Math.round((cantidadCompetencia5 / totalCompetencia5EnMalla) * 100) : 0;

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const filteredHistorial = asignaturas.filter(
    (item) =>
      item.nombre?.toLowerCase().includes(search.toLowerCase()) ||
      item.codigo?.toLowerCase().includes(search.toLowerCase())
  );

  // Solo mostrar Competencia 1 y 5 en el gráfico, con el valor en porcentaje
  const competenciasGrafico = [
    {
      name: "Competencia 1",
      value: porcentajeCompetencia1,
      color: "#1976d2"
    },
    {
      name: "Competencia 5",
      value: porcentajeCompetencia5,
      color: "#FF8042"
    }
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <SidebarStudent
        name={userData?.rut|| mockUser.name}
        picture={mockUser.picture}
        selected={selected}
        onSelect={setSelected}
        onLogout={handleLogout}
      />

      <Box
        sx={{
          flexGrow: 1,
          p: { xs: 1, sm: 4 },
          ml: { xs: 0, sm: '240px' },
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            maxWidth: 1400,
            mx: 'auto',
            width: '100%',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" fontWeight={700} color='#000'>Rendimiento General</Typography>
            <Select value="2025-1" size="small" sx={{ minWidth: 180, bgcolor: '#fff' }}>
              <MenuItem value="2025-1">Semestre 2025-1</MenuItem>
            </Select>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 3 }}>
            {/* Asignaturas y Competencias */}
            <Paper elevation={0} sx={{ flex: 2, p: 3, borderRadius: 3, bgcolor: '#ffffff' }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Asignaturas y Competencias
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Relación entre asignaturas cursadas y competencias ECOE
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {loading ? (
                <Typography>Cargando...</Typography>
              ) : (
                <Stack spacing={2}>
                  {asignaturas.map((asig) => (
                    <Paper key={asig.codigo} variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: '#FBFBFB' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography fontWeight={700} sx={{ color: '#1976d2' }}>
                            {asig.nombre}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {asig.codigo} • Semestre {asig.semestre}
                          </Typography>
                          {asig.competencias.length > 0 && (
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="caption" color="text.secondary">
                                Competencias ECOE desarrolladas en esta asignatura:
                              </Typography>
                              <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                                {asig.competencias.map((comp: string) => (
                                  <Chip
                                    key={comp}
                                    label={comp}
                                    size="small"
                                    sx={{ bgcolor: 'rgba(25, 118, 210, 0.08)', color: '#1976d2', fontWeight: 600 }}
                                  />
                                ))}
                              </Stack>
                            </Box>
                          )}
                        </Box>
                        <Box sx={{ textAlign: 'right', minWidth: 80 }}>
                          <Typography fontWeight={700} sx={{ fontSize: 18 }}>
                            {asig.calificacion?.toFixed(1)}
                          </Typography>
                          <Chip
                            label={asig.nivel}
                            color={nivelColor(asig.nivel)}
                            size="small"
                            sx={{ fontWeight: 700, mt: 1 }}
                          />
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Stack>
              )}
            </Paper>

            {/* Desarrollo de Competencias */}
            <Paper elevation={0} sx={{ flex: 1, p: 3, borderRadius: 3, minWidth: 320, bgcolor: '#ffffff' }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Desarrollo de Competencias
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Nivel de desarrollo por competencia ECOE
              </Typography>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart
                  data={competenciasGrafico}
                  layout="vertical"
                  margin={{ left: 10, right: 10, top: 10, bottom: 10 }}
                  barCategoryGap={20}
                >
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={140}
                    tick={{ fontSize: 13, fill: '#222' }}
                  />
                  <Tooltip formatter={(value: number) => `${value}%`} />
                  <Bar dataKey="value" radius={[8, 8, 8, 8]}>
                    <LabelList dataKey="value" position="right" formatter={(value: number) => `${value}%`} />
                    {competenciasGrafico.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                • Porcentaje de desarrollo basado en asignaturas cursadas
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Competencia 1: {porcentajeCompetencia1}% ({cantidadCompetencia1} de {totalCompetencia1EnMalla})
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Competencia 5: {porcentajeCompetencia5}% ({cantidadCompetencia5} de {totalCompetencia5EnMalla})
              </Typography>
            </Paper>
          </Box>

          

          

          {/* Historial Académico */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, mt: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography variant="h6" fontWeight={700}>Historial Académico</Typography>
                <Typography variant="body2" color="text.secondary">
                  Todas las asignaturas cursadas y su relación con competencias ECOE
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#f3f6f9', borderRadius: 2, px: 1 }}>
                <InputBase
                  placeholder="Buscar asignatura."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  sx={{ ml: 1, flex: 1, fontSize: 14 }}
                />
                <IconButton size="small">
                  <SearchIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Código</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Asignatura</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Semestre</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Calificación</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Nivel</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Competencias ECOE</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredHistorial.map((item) => (
                    <TableRow key={item.codigo}>
                      <TableCell sx={{ fontWeight: 700 }}>{item.codigo}</TableCell>
                      <TableCell>{item.nombre}</TableCell>
                      <TableCell>{item.semestre}</TableCell>
                      <TableCell>
                        <Chip
                          label={item.calificacion?.toFixed(1)}
                          color="success"
                          size="small"
                          sx={{ fontWeight: 700 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="column" spacing={1}>
                          <Chip
                            label={item.nivel}
                            color={nivelColor(item.nivel)}
                            size="small"
                            sx={{ fontWeight: 700, mr: 0.5 }}
                          />
                          {item.nivel2 && (
                            <Chip
                              label={item.nivel2}
                              color={nivelColor(item.nivel2)}
                              size="small"
                              sx={{ fontWeight: 700 }}
                            />
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          {(item.competencias || []).map((comp: string) => (
                            <Chip
                              key={comp}
                              label={comp}
                              size="small"
                              sx={{ bgcolor: 'rgba(25, 118, 210, 0.08)', color: '#1976d2', fontWeight: 600 }}
                            />
                          ))}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default PerformanceStudent;