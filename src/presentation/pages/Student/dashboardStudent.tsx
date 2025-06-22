import { useState, useRef, useEffect } from 'react';
import { Box, Typography, Paper, Select, MenuItem, IconButton, Skeleton } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { getUserData } from '../../../storage/storage';
import { EcoeYear } from '../../../domain/ecoe/EcoeYear';
import { GetStudentEcoeDataUseCase } from '../../../application/ecoe/GetStudentEcoeDataUseCase';

const DashboardStudent = () => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Estado para competencias reales y promedio
  const [competencias, setCompetencias] = useState<{ nombre: string, calificacion: number, nivel: string }[]>([]);
  const [promedio, setPromedio] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [minLoading, setMinLoading] = useState(true);

  const [ecoeYears, setEcoeYears] = useState<EcoeYear[]>([]);
  const [selectedEcoe, setSelectedEcoe] = useState<EcoeYear | null>(null);

  function getUserIdFromToken(token: string | null): string | null {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || payload.userId || null;
    } catch {
      return null;
    }
  }

  // Obtener datos del usuario
  const { accessToken } = getUserData();
  const ecoeUseCase = new GetStudentEcoeDataUseCase();

  // Obtener los años de ECOE disponibles
  useEffect(() => {
    const fetchEcoeYears = async () => {
      try {
        const userId = getUserIdFromToken(accessToken);
        if (!userId) throw new Error('No se pudo obtener el usuario');
        const data = await ecoeUseCase.getYears(userId);
        setEcoeYears(data);
        
        //Se selecciona el año actual si existe, sino el último disponible
        const currentYear = new Date().getFullYear();
        const currentSemester = new Date().getMonth() < 7 ? '1' : '2';
        const currentYearSemester = `${currentYear}-${currentSemester}`;
        let found = data.find(e => e.yearSemester === currentYearSemester);
        if (!found && data.length > 0) {
          found = data[data.length -1];
        }
        setSelectedEcoe(found || null);
      } catch (e) {
        console.error('Error fetching ECOE years:', e);
        setEcoeYears([]);
        setSelectedEcoe(null);
      }
      setLoading(false);
    };
    fetchEcoeYears();
  }, []);

  // Obtener competencias y promedio del ECOE seleccionado
  useEffect(() => {
    setLoading(true);
    setMinLoading(true);
    const timer = setTimeout(() => setMinLoading(false), 385); // Mínimo 0.385 segundo de carga
    const fetchData = async () => {
      if (!selectedEcoe) return;
      setLoading(true);
      try {
        const userId = getUserIdFromToken(accessToken);
        if (!userId) throw new Error('No se pudo obtener el usuario');
        // Fetch competencias
        const data = await ecoeUseCase.getCompetencies(userId, selectedEcoe.ecoeId);

        const competenciasMapped = (data.competenciesEvaluated || []).map((c: any) => ({
          nombre: c.competencyName || 'Competencia',
          calificacion: c.grade,
          nivel: c.achievementLevel?.toUpperCase() || '',
        }));
        setCompetencias(competenciasMapped);

        // Fetch promedio
        const dataAvg = await ecoeUseCase.getAvg(userId, selectedEcoe.ecoeId);
        setPromedio(dataAvg.average ?? null);
      } catch (e) {
        setCompetencias([]);
        setPromedio(null);
      }
      setLoading(false);
    };
    fetchData();
    return () => clearTimeout(timer); // Limpiar el timeout al desmontar
    // eslint-disable-next-line
  }, [selectedEcoe]);

  const handleScroll = (dir: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: dir * 300, behavior: 'smooth' });
    }
  };

  // Función para obtener colores según el nivel
  function getCompetencyColors(nivel: string) {
    switch (nivel) {
      case 'SATISFACTORIO':
        return {
          bg: '#d1f2eb', // verde suave
          border: '#27ae60',
          text: '#229954'
        };
      case 'SUFICIENTE':
        return {
          bg: '#fcf3cf', // amarillo suave
          border: '#f1c40f',
          text: '#b7950b'
        };
      case 'INSUFICIENTE':
        return {
          bg: '#f9ebea', // rojo suave
          border: '#e74c3c',
          text: '#922b21'
        };
      default:
        return {
          bg: '#e5e8e8', // gris suave
          border: '#b2babb',
          text: '#626567'
        };
    }
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', position: 'relative', backgroundColor: '#ffffff' }}>
      <Box
        sx={{
          flexGrow: 1,
          p: { xs: 0, sm: 3 },
          overflowY: 'auto',
          ml: { xs: 0, sm: '240px' },
          width: 'calc(100vw - 480px)',
          height: "100%"
        }}
      >
      
          <Box>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h4" color='#000000' fontWeight={700}>Mi Perfil ECOE </Typography>
              <Select
               value={selectedEcoe?.yearSemester || ''} 
               size="small" 
               sx={{ minWidth: 140 }}
               onChange={(e) => {
                const ecoe = ecoeYears.find(y => y.yearSemester === e.target.value);
                setSelectedEcoe(ecoe || null);
                }}
                disabled= {loading || ecoeYears.length === 0}
              >
                {ecoeYears.map((y) => (
                  <MenuItem key={y.yearSemester} value={y.yearSemester}>
                    {y.yearSemester}
                  </MenuItem>))}
              </Select>
            </Box>

            <Typography variant="h6" color='#5C5C5C' fontWeight={600} sx={{ mb: 2 }}>Resumen de Competencias</Typography>

            <Box sx={{ position: 'relative', mb: 3 }}>
              <IconButton onClick={() => handleScroll(-1)} sx={{ position: 'absolute', left: -20, top: '50%', transform: 'translateY(-50%)', zIndex: 2, bgcolor: 'white' }}>
                <ArrowBackIosNewIcon />
              </IconButton>
              <Box
                ref={scrollContainerRef}
                sx={{
                  display: 'flex',
                  overflowX: 'auto',
                  gap: 2,
                  pb: 2,
                  scrollbarWidth: 'none',
                  '&::-webkit-scrollbar': { display: 'none' }
                }}
              >
                {loading || minLoading ?(
                  Array.from({ length: 4 }).map((_, idx) => (
                    <Paper
                      key={idx}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        bgcolor: '#FBFBFB',
                        textAlign: 'center',
                        flexShrink: 0,
                        width: { xs: 280, md: 320 },
                        mr: 2
                      }}
                    >
                      <Skeleton variant="text" width={120} height={32} sx={{ mx: 'auto',mb: 2 }} />
                      <Skeleton variant="rectangular" width={64} height={64} sx={{ mx: 'auto', mb: 2, borderRadius: '50%' }} />
                      <Skeleton variant="text" width={80} height={24} sx={{ mx: 'auto' }} />
                    </Paper>
                  ))
                ) : (
                  competencias.map((c, idx) => {
                    const colors = getCompetencyColors(c.nivel);
                    return (
                      <Paper
                        key={idx}
                        sx={{
                          p: 3,
                          borderRadius: 3,
                          bgcolor: '#FBFBFB',
                          textAlign: 'center',
                          flexShrink: 0,
                          width: { xs: 280, md: 320 },
                          // Quitar el borde de color
                          
                        }}
                      >
                        <Typography fontWeight={600}>{c.nombre}</Typography>
                        <Box sx={{ mt: 1, mb: 1 }}>
                          <Typography
                            component="span"
                            sx={{
                              bgcolor: colors.bg,
                              borderRadius: 1,
                              px: 1.5,
                              fontSize: 14,
                              color: colors.text,
                              fontWeight: 700
                            }}
                          >
                            Nivel: {c.nivel}
                          </Typography>
                        </Box>
                        <Typography fontWeight={500} sx={{ mb: 1 }}>Calificación</Typography>
                        <Box
                          sx={{
                            bgcolor: colors.bg,
                            color: colors.text,
                            fontSize: 32,
                            fontWeight: 700,
                            borderRadius: '50%',
                            width: 64,
                            height: 64,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 1,
                            // Mantén solo el borde del círculo, no del Paper
                            border: `2.5px solid ${colors.border}`
                          }}
                        >
                          {c.calificacion}
                        </Box>
                      </Paper>
                    );
                  })
                )}
              </Box>
              <IconButton onClick={() => handleScroll(1)} sx={{ position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%)', zIndex: 2, bgcolor: 'white' }}>
                <ArrowForwardIosIcon />
              </IconButton>
            </Box>

            <Typography
              variant="h6"
              fontWeight={600}
              color="#5C5C5C"
              sx={{ mb: 2, textAlign: 'center' }}
            >
              Promedio ECOE {selectedEcoe?.yearSemester || ''}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: '#FBFBFB',
                  textAlign: 'center',
                  flexShrink: 0,
                  width: { xs: 280, md: 320 },
                  
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                  // Quitar el borde negro
                }}
              >
                <Typography fontWeight={600} sx={{ mb: 1 }}>Promedio</Typography>
                {loading || minLoading ? (
                  <Skeleton variant='circular' width={100} height={100} sx={{ mx: 'auto', mb: 2 }} />
                ) : (
                <Box
                  sx={{
                    bgcolor: (() => {
                      if (promedio !== null) {
                        if (promedio >= 5) return '#d1f2eb'; // verde suave
                        if (promedio >= 4) return '#fcf3cf'; // amarillo suave
                        return '#f9ebea'; // rojo suave
                      }
                      return '#e5e8e8'; // gris suave
                    })(),
                    color: (() => {
                      if (promedio !== null) {
                        if (promedio >= 5) return '#229954';
                        if (promedio >= 4) return '#b7950b';
                        return '#922b21';
                      }
                      return '#626567';
                    })(),
                    fontSize: 32,
                    fontWeight: 700,
                    borderRadius: '50%',
                    width: 100,
                    height: 100,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 1,
                    border: (() => {
                      if (promedio !== null) {
                        if (promedio >= 5) return '2.5px solid #27ae60';
                        if (promedio >= 4) return '2.5px solid #f1c40f';
                        return '2.5px solid #e74c3c';
                      }
                      return '2.5px solid #b2babb';
                    })()
                  }}
                >
                  {promedio !== null ? promedio.toFixed(1) : '--'}
                </Box>
                )}
                <Typography sx={{ fontSize: 15, color: '#5C5C5C', fontWeight: 500 }}>
                  {promedio !== null ? 'Nota final del ECOE' : 'Sin promedio'}
                </Typography>
              </Paper>
            </Box>
          </Box>
      </Box>
    </Box>
  );
};

export default DashboardStudent;