import { useState } from 'react';
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

const mockAsignaturas = [
  {
    nombre: "Comunicación efectiva en enfermería",
    codigo: "ENF2101",
    semestre: "2025-1",
    calificacion: 6.5,
    nivel: "SATISFACTORIO",
    competencias: ["Comunicación efectiva", "Gestión del cuidado"],
    notasCompetencias: {
      "Comunicación efectiva": 5,
      "Gestión del cuidado": 6,
    }
  },
  {
    nombre: "Cuidados de enfermería en paciente crítico",
    codigo: "ENF3205",
    semestre: "2025-1",
    calificacion: 6.0,
    nivel: "SATISFACTORIO",
    competencias: ["Comunicación efectiva"],
    notasCompetencias: {
      "Comunicación efectiva": 7,
    }
  },
  {
    nombre: "Gestión en servicios de salud",
    codigo: "ENF4102",
    semestre: "2025-1",
    calificacion: 5.8,
    nivel: "SUFICIENTE",
    competencias: ["Gestión del cuidado"],
    notasCompetencias: {
      "Gestión del cuidado": 5,
    }
  },
  {
    nombre: "Investigación en enfermería",
    codigo: "ENF3106",
    semestre: "2025-1",
    calificacion: 6.2,
    nivel: "SATISFACTORIO",
    competencias: ["Investigación"],
    notasCompetencias: {
      "Investigación": 6,
    }
  },
];

// Define the Competencia type
type Competencia = {
  name: string;
  color: string;
};

const mockCompetencias: Competencia[] = [
  { name: "Comunicación efectiva", color: "#0088FE" },
  { name: "Gestión del cuidado", color: "#00C49F" },
  { name: "Competencia asistencial", color: "#FFBB28" },
  { name: "Bases científicas", color: "#A28CFE" },
  { name: "Gestión y liderazgo", color: "#FF8042" },
  { name: "Investigación", color: "#FF6699" },
  { name: "Ética profesional", color: "#33CC99" },
];

const mockHistorial = [
  {
    codigo: "ENF2101",
    nombre: "Comunicación efectiva en enfermería",
    semestre: "2025-1",
    calificacion: 6.5,
    nivel: "APROBADO",
    nivel2: "SATISFACTORIO",
    competencias: ["Comunicación efectiva", "Gestión del cuidado"]
  },
  {
    codigo: "ENF2204",
    nombre: "Ética y legislación en enfermería",
    semestre: "2024-2",
    calificacion: 6.7,
    nivel: "APROBADO",
    nivel2: "SATISFACTORIO",
    competencias: ["Ética profesional", "Comunicación efectiva"]
  }
];

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
const calcularPorcentajeCompetenciasGlobal = (
  asignaturas: typeof mockAsignaturas,
  competenciasRef: typeof mockCompetencias,
  max = 7
) => {
  const notasPorCompetencia: Record<string, number[]> = {};
  asignaturas.forEach(asig => {
    if (asig.notasCompetencias) {
      Object.entries(asig.notasCompetencias).forEach(([comp, nota]) => {
        if (!notasPorCompetencia[comp]) notasPorCompetencia[comp] = [];
        notasPorCompetencia[comp].push(nota);
      });
    }
  });
  return competenciasRef.map(({ name, color }) => {
    const notas = notasPorCompetencia[name] || [];
    const value =
      notas.length > 0
        ? Math.round((notas.reduce((a, b) => a + b, 0) / notas.length / max) * 100)
        : 0;
    return { name, value, color };
  });
};

// Gráfico de barra: promedio de nota global por asignatura (en %)
const dataBarraAsignaturas = mockAsignaturas.map(asig => ({
  asignatura: asig.nombre,
  porcentaje: Math.round((asig.calificacion / 7) * 100),
}));

const competenciasGrafico = calcularPorcentajeCompetenciasGlobal(mockAsignaturas, mockCompetencias);

const competenciasPorAsignatura = mockAsignaturas.map(asig => ({
  asignatura: asig.nombre,
  competencias: asig.competencias.length,
}));

const PerformanceStudent = () => {
  const [selected, setSelected] = useState('rendimiento');
  const [search, setSearch] = useState('');

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const filteredHistorial = mockHistorial.filter(
    (item) =>
      item.nombre.toLowerCase().includes(search.toLowerCase()) ||
      item.codigo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <SidebarStudent
        name={mockUser.name}
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
              <Stack spacing={2}>
                {mockAsignaturas.map((asig) => (
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
                              {asig.competencias.map((comp) => (
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
                          {asig.calificacion.toFixed(1)}
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
            </Paper>

            {/* Desarrollo de Competencias */}
            <Paper elevation={0} sx={{ flex: 1, p: 3, borderRadius: 3, minWidth: 320, bgcolor: '#ffffff' }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Desarrollo de Competencias
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Nivel de desarrollo por competencia ECOE
              </Typography>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={competenciasGrafico}
                  layout="vertical"
                  margin={{ left: 10, right: 10, top: 10, bottom: 10 }}
                  barCategoryGap={12}
                >
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={140}
                    tick={{ fontSize: 13, fill: '#222' }}
                  />
                  <Tooltip />
                  <Bar dataKey="value" radius={[8, 8, 8, 8]}>
                    <LabelList dataKey="value" position="right" />
                    {competenciasGrafico.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                • Porcentaje de desarrollo basado en asignaturas cursadas
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
                          label={item.calificacion.toFixed(1)}
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
                          <Chip
                            label={item.nivel2}
                            color={nivelColor(item.nivel2)}
                            size="small"
                            sx={{ fontWeight: 700 }}
                          />
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          {item.competencias.map((comp) => (
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