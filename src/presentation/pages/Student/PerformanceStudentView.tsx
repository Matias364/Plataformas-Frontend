import React from 'react';
import {
  Box, Typography, Paper, Select, MenuItem, Chip, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, InputBase, Stack, Divider, IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts';

const nivelColor = (nivel: string) => {
  switch (nivel) {
    case "SATISFACTORIO": return "primary";
    case "SUFICIENTE": return "warning";
    case "APROBADO": return "success";
    case "INSUFICIENTE": return "error";
    default: return "default";
  }
};

interface Props {
  search: string;
  setSearch: (val: string) => void;
  asignaturas: any[];
  loading: boolean;
  competenciasGrafico: any[];
  competenciasConteo: Record<string, number>;
  totalAsignaturas: number;
  filteredHistorial: any[];
}

const PerformanceStudentView: React.FC<Props> = ({
  search,
  setSearch,
  asignaturas,
  loading,
  competenciasGrafico,
  competenciasConteo,
  totalAsignaturas,
  filteredHistorial
}) => (
  <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#ffffff' }}>
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
            {competenciasGrafico.map((comp) => (
              <Typography
                key={comp.name}
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block' }}
              >
                {comp.name}: {comp.value}% ({competenciasConteo[comp.name]} de {totalAsignaturas})
              </Typography>
            ))}
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

export default PerformanceStudentView;