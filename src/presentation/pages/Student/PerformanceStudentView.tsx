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
  filteredHistorial: any[];
  competenciasTotales: Record<string, number>; // NUEVO
  periodo: string[];
  periodoSeleccionado: string;
  setPeriodoSeleccionado: (val: string) => void;
}

const PerformanceStudentView: React.FC<Props> = ({
  search,
  setSearch,
  asignaturas,
  loading,
  competenciasGrafico,
  competenciasConteo,
  filteredHistorial,
  competenciasTotales, // NUEVO
  periodo,
  periodoSeleccionado,
  setPeriodoSeleccionado
}) => (
  <Box sx={{ display: 'flex', height: '100vh', overflowY: 'hidden', position: 'relative', backgroundColor: '#ffffff' }}>
    <Box
      sx={{
        flexGrow: 1,
        p: { xs: 0, sm: 3 },
        overflowY: 'auto',
        ml: { xs: 0, sm: '240px' },
        width: 'calc(100vw - 480px)',
        height: '100%',
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
          <Select
            value={periodoSeleccionado}
            onChange={e => setPeriodoSeleccionado(e.target.value)}
            size="small"
            sx={{ minWidth: 200, bgcolor: '#fff' }}
            renderValue={(selected) => {
              if (!selected) return 'Seleccionar periodo';
              const [year, semester] = selected.split('-');
              return `Año ${year} | Semestre: ${semester}`;
            }}
          >
            {periodo.map(p => {
              const [year, semester] = p.split('-');
              return (
                <MenuItem key={p} value={p} sx={{ justifyContent: 'center'}}>
                  {year}-{semester}
                </MenuItem>
              );
            })}
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
                              {asig.competencias.map((comp: any) => (
                                <Chip
                                  key={typeof comp === 'string' ? comp : comp.id}
                                  label={typeof comp === 'string' ? comp : comp.name}
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
                margin={{ left: 1, right: 50, top: 10, bottom: 10 }}
                barCategoryGap={10}
              >
                <XAxis type="number" domain={[0, 110]} hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={140}
                  tick={{ fontSize: 13, fill: '#222' }}
                />
                <Tooltip formatter={(value: number) => [`Progreso: ${value}%`]}/>
                <Bar dataKey="value" radius={[0, 4, 4, 0]}
                  >
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
                key={comp.id}
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block' }}
              >
                {comp.name}: {comp.value}% ({competenciasConteo[comp.id]} de {competenciasTotales[comp.id]})<br />
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
                {filteredHistorial.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Box sx={{ py: 2, color: 'text.secondary', fontStyle: 'italic' }}>
                        No se encontraron asignaturas con el nombre de '{search}'
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                filteredHistorial.map((item) => (
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
                      <Box sx={{ maxWidth: 260, pr: 1 }}>
                        {Array.from({ length: Math.ceil((item.competencias || []).length / 2) }).map((_, rowIdx) => (
                          <Stack direction="row" spacing={1} key={rowIdx} sx={{ mb: 0.5 }}>
                            {(item.competencias || []).slice(rowIdx * 2, rowIdx * 2 + 2).map((comp: any) => (
                              <Chip
                                key={typeof comp === 'string' ? comp + rowIdx : comp.id + rowIdx}
                                label={typeof comp === 'string' ? comp : comp.name}
                                size="small"
                                sx={{ bgcolor: 'rgba(25, 118, 210, 0.08)', color: '#1976d2', fontWeight: 600, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                              />
                            ))}
                          </Stack>
                        ))}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Box>
  </Box>
);

export default PerformanceStudentView;