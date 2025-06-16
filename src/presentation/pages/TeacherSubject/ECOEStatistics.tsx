import { Box, Typography, Card, TextField, Tabs, Tab, MenuItem } from '@mui/material';
import { useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend);

const ecoePeriods = [
  'ECOE 2021-2',
  'ECOE 2022-1',
  'ECOE 2022-2',
  'ECOE 2023-1',
  'ECOE 2023-2',
] as const;

type Period = typeof ecoePeriods[number];

const dataByPeriod: Record<Period, {
  bar: { labels: string[]; datasets: { label: string; data: number[]; backgroundColor: string; borderRadius: number; }[]; };
  line: { labels: string[]; datasets: { label: string; data: number[]; borderColor: string; backgroundColor: string; tension: number; }[]; };
  pie: { labels: string[]; datasets: { data: number[]; backgroundColor: string[]; borderWidth: number; }[]; };
}> = {
  'ECOE 2021-2': {
    bar: {
      labels: ['Competencia 1', 'Competencia 2', 'Competencia 3'],
      datasets: [
        { label: 'Promedio ECOE', data: [4.0, 4.7, 4.2], backgroundColor: '#009688', borderRadius: 8 },
        { label: 'Promedio Asignatura', data: [3.8, 4.5, 4.0], backgroundColor: '#FFA726', borderRadius: 8 },
      ],
    },
    line: {
      labels: ['ECOE 2021-2', 'ECOE 2022-1', 'ECOE 2022-2', 'ECOE 2023-1', 'ECOE 2023-2'],
      datasets: [
        { label: 'Competencia 1', data: [4.0, 4.1, 4.3, 4.5, 4.5], borderColor: '#009688', backgroundColor: '#00968822', tension: 0.4 },
        { label: 'Competencia 2', data: [4.7, 4.8, 4.9, 5.1, 5.2], borderColor: '#FFA726', backgroundColor: '#FFA72622', tension: 0.4 },
        { label: 'Competencia 3', data: [4.2, 4.3, 4.5, 4.7, 4.8], borderColor: '#42A5F5', backgroundColor: '#42A5F522', tension: 0.4 },
      ],
    },
    pie: {
      labels: ['Competencia 1', 'Competencia 2', 'Competencia 3'],
      datasets: [{ data: [25, 50, 25], backgroundColor: ['#009688', '#FFA726', '#42A5F5'], borderWidth: 1 }],
    },
  },
  'ECOE 2022-1': {
    bar: {
      labels: ['Competencia 1', 'Competencia 2', 'Competencia 3'],
      datasets: [
        { label: 'Promedio ECOE', data: [4.1, 4.8, 4.3], backgroundColor: '#009688', borderRadius: 8 },
        { label: 'Promedio Asignatura', data: [3.9, 4.6, 4.1], backgroundColor: '#FFA726', borderRadius: 8 },
      ],
    },
    line: {
      labels: ['ECOE 2021-2', 'ECOE 2022-1', 'ECOE 2022-2', 'ECOE 2023-1', 'ECOE 2023-2'],
      datasets: [
        { label: 'Competencia 1', data: [4.0, 4.1, 4.3, 4.5, 4.5], borderColor: '#009688', backgroundColor: '#00968822', tension: 0.4 },
        { label: 'Competencia 2', data: [4.7, 4.8, 4.9, 5.1, 5.2], borderColor: '#FFA726', backgroundColor: '#FFA72622', tension: 0.4 },
        { label: 'Competencia 3', data: [4.2, 4.3, 4.5, 4.7, 4.8], borderColor: '#42A5F5', backgroundColor: '#42A5F522', tension: 0.4 },
      ],
    },
    pie: {
      labels: ['Competencia 1', 'Competencia 2', 'Competencia 3'],
      datasets: [{ data: [30, 45, 25], backgroundColor: ['#009688', '#FFA726', '#42A5F5'], borderWidth: 1 }],
    },
  },
  // Puedes agregar más periodos aquí...
  'ECOE 2022-2': {
    bar: {
      labels: ['Competencia 1', 'Competencia 2', 'Competencia 3'],
      datasets: [
        { label: 'Promedio ECOE', data: [4.3, 4.9, 4.5], backgroundColor: '#009688', borderRadius: 8 },
        { label: 'Promedio Asignatura', data: [4.0, 4.7, 4.3], backgroundColor: '#FFA726', borderRadius: 8 },
      ],
    },
    line: {
      labels: ['ECOE 2021-2', 'ECOE 2022-1', 'ECOE 2022-2', 'ECOE 2023-1', 'ECOE 2023-2'],
      datasets: [
        { label: 'Competencia 1', data: [4.0, 4.1, 4.3, 4.5, 4.5], borderColor: '#009688', backgroundColor: '#00968822', tension: 0.4 },
        { label: 'Competencia 2', data: [4.7, 4.8, 4.9, 5.1, 5.2], borderColor: '#FFA726', backgroundColor: '#FFA72622', tension: 0.4 },
        { label: 'Competencia 3', data: [4.2, 4.3, 4.5, 4.7, 4.8], borderColor: '#42A5F5', backgroundColor: '#42A5F522', tension: 0.4 },
      ],
    },
    pie: {
      labels: ['Competencia 1', 'Competencia 2', 'Competencia 3'],
      datasets: [{ data: [28, 52, 20], backgroundColor: ['#009688', '#FFA726', '#42A5F5'], borderWidth: 1 }],
    },
  },
  'ECOE 2023-1': {
    bar: {
      labels: ['Competencia 1', 'Competencia 2', 'Competencia 3'],
      datasets: [
        { label: 'Promedio ECOE', data: [4.5, 5.1, 4.7], backgroundColor: '#009688', borderRadius: 8 },
        { label: 'Promedio Asignatura', data: [4.2, 4.9, 4.5], backgroundColor: '#FFA726', borderRadius: 8 },
      ],
    },
    line: {
      labels: ['ECOE 2021-2', 'ECOE 2022-1', 'ECOE 2022-2', 'ECOE 2023-1', 'ECOE 2023-2'],
      datasets: [
        { label: 'Competencia 1', data: [4.0, 4.1, 4.3, 4.5, 4.5], borderColor: '#009688', backgroundColor: '#00968822', tension: 0.4 },
        { label: 'Competencia 2', data: [4.7, 4.8, 4.9, 5.1, 5.2], borderColor: '#FFA726', backgroundColor: '#FFA72622', tension: 0.4 },
        { label: 'Competencia 3', data: [4.2, 4.3, 4.5, 4.7, 4.8], borderColor: '#42A5F5', backgroundColor: '#42A5F522', tension: 0.4 },
      ],
    },
    pie: {
      labels: ['Competencia 1', 'Competencia 2', 'Competencia 3'],
      datasets: [{ data: [32, 40, 28], backgroundColor: ['#009688', '#FFA726', '#42A5F5'], borderWidth: 1 }],
    },
  },
  'ECOE 2023-2': {
    bar: {
      labels: ['Competencia 1', 'Competencia 2', 'Competencia 3'],
      datasets: [
        { label: 'Promedio ECOE', data: [4.5, 5.2, 4.8], backgroundColor: '#009688', borderRadius: 8 },
        { label: 'Promedio Asignatura', data: [4.2, 5.0, 4.6], backgroundColor: '#FFA726', borderRadius: 8 },
      ],
    },
    line: {
      labels: ['ECOE 2021-2', 'ECOE 2022-1', 'ECOE 2022-2', 'ECOE 2023-1', 'ECOE 2023-2'],
      datasets: [
        { label: 'Competencia 1', data: [4.0, 4.1, 4.3, 4.5, 4.5], borderColor: '#009688', backgroundColor: '#00968822', tension: 0.4 },
        { label: 'Competencia 2', data: [4.7, 4.8, 4.9, 5.1, 5.2], borderColor: '#FFA726', backgroundColor: '#FFA72622', tension: 0.4 },
        { label: 'Competencia 3', data: [4.2, 4.3, 4.5, 4.7, 4.8], borderColor: '#42A5F5', backgroundColor: '#42A5F522', tension: 0.4 },
      ],
    },
    pie: {
      labels: ['Competencia 1', 'Competencia 2', 'Competencia 3'],
      datasets: [{ data: [30, 45, 25], backgroundColor: ['#009688', '#FFA726', '#42A5F5'], borderWidth: 1 }],
    },
  },
};

const ECOEStatistics = () => {
  const [tab, setTab] = useState(0);
  const [period, setPeriod] = useState(ecoePeriods[ecoePeriods.length - 1]);

  const { bar, line, pie } = dataByPeriod[period];

  return (
    <Box sx={{ width: '100%', mt: 3 }}>
      <Typography variant="h4" fontWeight={700} mb={2} color='black'>
        Estadisticas ECOE
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ bgcolor: '#fff', borderRadius: 2, minHeight: 44 }}>
          <Tab label="Competencias" sx={{ fontWeight: 600, minWidth: 140 }} />
        </Tabs>
        <TextField
          select
          size="small"
          value={period}
          onChange={e => setPeriod(e.target.value as Period)}
          sx={{
            minWidth: 180,
            bgcolor: '#fff',
            borderRadius: 2,
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E0E0E0' },
          }}
          InputProps={{
            sx: { fontWeight: 500 }
          }}
        >
          {ecoePeriods.map((p) => (
            <MenuItem key={p} value={p}>{p}</MenuItem>
          ))}
        </TextField>
      </Box>

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
          Rendimiento por Competencia
        </Typography>
        <Typography color="text.secondary" fontSize={15} mb={2}>
          Resultados promedio en competencias relacionadas con su asignatura
        </Typography>
      </Card>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4,
          bgcolor: '#F8FAFC',
          borderRadius: 3,
          p: 4,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box sx={{ width: { xs: '100%', md: 340 }, height: 300 }}>
          <Bar
            data={bar}
            options={{
              responsive: true,
              plugins: { legend: { position: 'top' } },
              scales: { y: { min: 0, max: 7 } },
            }}
          />
        </Box>
        <Box sx={{ width: { xs: '100%', md: 340 }, height: 300 }}>
          <Line
            data={line}
            options={{
              responsive: true,
              plugins: { legend: { position: 'top' } },
              scales: { y: { min: 0, max: 7 } },
            }}
          />
        </Box>
        <Box sx={{ width: { xs: '100%', md: 260 }, height: 300 }}>
          <Pie
            data={pie}
            options={{
              responsive: true,
              plugins: { legend: { position: 'top' } },
            }}
          />
        </Box>
      </Box>

      
    </Box>
  );
};

export default ECOEStatistics;