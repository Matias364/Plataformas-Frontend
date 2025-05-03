import { useState, useRef } from 'react';
import SidebarStudent from './SidebarStudent';
import { Box, Typography, Paper, Select, MenuItem, IconButton } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const mockUser = {
  name: "Hackerman Estudiante",
  picture: "https://randomuser.me/api/portraits/men/32.jpg"
};

const mockCompetencias = [
  { nombre: "Comunicación efectiva", nivel: "SATISFACTORIO", calificacion: 6.5, estado: "APROBADO" },
  { nombre: "Competencia asistencial", nivel: "SATISFACTORIO", calificacion: 6.0, estado: "APROBADO" },
  { nombre: "Competencia clínica", nivel: "SATISFACTORIO", calificacion: 6.2, estado: "APROBADO" },
  { nombre: "Competencia ética", nivel: "SATISFACTORIO", calificacion: 6.1, estado: "APROBADO" },
  { nombre: "Competencia investigativa", nivel: "SATISFACTORIO", calificacion: 6.3, estado: "APROBADO" },
  { nombre: "Competencia social", nivel: "SATISFACTORIO", calificacion: 6.4, estado: "APROBADO" },
  { nombre: "Competencia docente", nivel: "SATISFACTORIO", calificacion: 6.6, estado: "APROBADO" },
  { nombre: "Competencia administrativa", nivel: "SATISFACTORIO", calificacion: 6.7, estado: "APROBADO" }
];

const mockPromedio = 6.3;

const DashboardStudent = () => {
  const [selected, setSelected] = useState('perfil');
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const handleScroll = (dir: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: dir * 300, behavior: 'smooth' });
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', position: 'relative' }}>
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
          p: {xs: 2, sm: 3},
          overflowY: 'auto',
          ml: { xs: 0, sm: '240px' },
          width: 'calc(100vw - 240px)',
          height: "100%"
        }}
      >
        {selected === 'perfil' && (
          <Box>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h4" color='#000000' fontWeight={700}>Mi Perfil ECOE</Typography>
              <Select value="ECOE 2025" size="small" sx={{ minWidth: 140 }}>
                <MenuItem value="ECOE 2025">ECOE 2025</MenuItem>
              </Select>
            </Box>

            <Typography variant="h6" color='#5C5C5C' fontWeight={600} sx={{ mb: 2 }}>Resumen de Competencias</Typography>

            <Box sx={{ position: 'relative', mb: 3 }}>
              <IconButton onClick={() => handleScroll(-1)} sx={{ position: 'absolute', left: -20, top: '50%', transform: 'translateY(-50%)', zIndex: 2, bgcolor: 'white' }}>
                <ArrowBackIosNewIcon />
              </IconButton>
              <Box
                ref={scrollContainerRef}
                sx={{ display: 'flex', overflowX: 'auto', gap: 2, pb: 2, scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}
              >
                {mockCompetencias.map(c => (
                  <Paper key={c.nombre} sx={{ p: 3, borderRadius: 3, bgcolor: '#f7f7f7', textAlign: 'center', flexShrink: 0, width: { xs: 280, md: 320 } }}>
                    <Typography fontWeight={600}>{c.nombre}</Typography>
                    <Box sx={{ mt: 1, mb: 1 }}>
                      <Typography component="span" sx={{ bgcolor: '#e0e0e0', borderRadius: 1, px: 1.5, fontSize: 14 }}>
                        Nivel: <span style={{ color: '#6fcf97', fontWeight: 700 }}>{c.nivel}</span>
                      </Typography>
                    </Box>
                    <Typography fontWeight={500} sx={{ mb: 1 }}>Calificación</Typography>
                    <Box sx={{ bgcolor: '#b8e7c1', color: '#222', fontSize: 32, fontWeight: 700, borderRadius: '50%', width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1 }}>
                      {c.calificacion}
                    </Box>
                    <Typography sx={{ bgcolor: '#e0e0e0', borderRadius: 1, px: 2, py: 0.5, fontSize: 15, display: 'inline-block' }}>
                      Estado: {c.estado}
                    </Typography>
                  </Paper>
                ))}
              </Box>
              <IconButton onClick={() => handleScroll(1)} sx={{ position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%)', zIndex: 2, bgcolor: 'white' }}>
                <ArrowForwardIosIcon />
              </IconButton>
            </Box>

            <Typography variant="h6" fontWeight={600} color='#5C5C5C' sx={{ mb: 2 }}>Promedio de ECOE 2025</Typography>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: '#f7f7f7', textAlign: 'center', width: { xs: 280, md: 320 } }}>
              <Typography fontWeight={500} sx={{ mb: 1 }}>Calificación Final</Typography>
              <Box sx={{ bgcolor: '#b8e7c1', color: '#222', fontSize: 32, fontWeight: 700, borderRadius: '50%', width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1 }}>
                {mockPromedio}
              </Box>
              <Typography sx={{ bgcolor: '#e0e0e0', borderRadius: 1, px: 2, py: 0.5, fontSize: 15, display: 'inline-block' }}>
                Estado: APROBADO
              </Typography>
            </Paper>
          </Box>
        )}

        {selected === 'rendimiento' && (
          <Box>
            <Typography variant="h4" color='#000000' fontWeight={700}>Rendimiento</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default DashboardStudent;