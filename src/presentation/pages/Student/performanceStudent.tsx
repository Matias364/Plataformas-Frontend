import { useState, useEffect, useMemo } from 'react';
import PerformanceStudentView from './PerformanceStudentView';

const PerformanceStudent = () => {
  const [search, setSearch] = useState('');
  const [asignaturas, setAsignaturas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [competenciasTotales, setCompetenciasTotales] = useState<Record<string, number>>({});
  const [periodo, setPeriodo] = useState<string[]>([]);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Obtener info del estudiante
        const accessToken = localStorage.getItem('access_token');
        console.log('Access Token:', accessToken);
        const resStudent = await fetch('http://localhost:3001/api/v1/students/me/subjects/enrollments', {
          headers: {
            Authorization: `Bearer ${accessToken?.replace(/"/g, '')}`,
          },
        });
        //console.log('Response from student API:', await resStudent.json());
        if (!resStudent.ok) {
          
          throw new Error('No se pudo obtener la información del estudiante');
        }
        const student = await resStudent.json();
        console.log('Student info:', student);
        // Obtener periodo de asignaturas
        const periodoSet = new Set<string>();
        (student.subjectEnrollments || []).forEach((subj: any) => {
          if (subj.year && subj.semester) {
            periodoSet.add(`${subj.year}-${subj.semester}`);
          }
        });
        const periodosArray = Array.from(periodoSet).sort((a, b) => b.localeCompare(a));
        setPeriodo(periodosArray);
        setPeriodoSeleccionado(periodosArray[0] || '');

        // Obtener info de cada asignatura y sus competencias (incluyendo id de competencia)
        const asignaturasData = await Promise.all(
          (student.subjectEnrollments || []).map(async (subj: any) => {
            // Obtener datos de la asignatura
            console.log('Subject Enrollment:', subj);
            const resAsig = await fetch(`http://localhost:3001/api/v1/subjects/${subj.subjectId}`);
            const asigInfo = await resAsig.json();
            console.log('Asignatura info:', asigInfo);

            // Obtener competencias de la asignatura
            let competencias: { id: string, name: string }[] = [];
            try {
              const resCompetencias = await fetch(`http://localhost:3001/api/v1/subjects/${subj.subjectId}/competencies`);
              if (resCompetencias.ok) {
                console.log('Competencias response:', resCompetencias);
                const competenciasData = await resCompetencias.json();
                competencias = (competenciasData || []).map((comp: any) => ({
                  id: comp.competency.id || comp.competency._id,
                  name: comp.competency.name || comp.competency.nombre
                }));

              }
            } catch (err) {
              competencias = [];
            }

            // Calcular nivel general para la asignatura usando subj.grade
            const nivel = subj.grade >= 5.5 ? "SATISFACTORIO" : subj.grade >= 4 ? "SUFICIENTE" : "INSUFICIENTE";

            return {
              codigo: asigInfo.code,
              nombre: asigInfo.name,
              calificacion: subj.grade,
              semestre: subj.semester,
              year: subj.year,
              competencias, // ahora es array de {id, name}
              nivel,
            };
          })
        );
        setAsignaturas(asignaturasData);

        // Obtener totales de cada competencia única
        const competenciasUnicas: Record<string, string> = {};
        asignaturasData.forEach(a => {
          (a.competencias || []).forEach((comp: {id: string, name: string}) => {
            competenciasUnicas[comp.id] = comp.name;
          });
        });
        // Fetch totales para cada competencia
        const totales: Record<string, number> = {};
        await Promise.all(Object.keys(competenciasUnicas).map(async (compId) => {
          try {
            const res = await fetch(`http://localhost:3001/api/v1/subjects/${compId}/countSubjects`);
            if (res.ok) {
              const data = await res.json();
              totales[compId] = data.subjectCount || 0;
            } else {
              totales[compId] = 0;
            }
          } catch {
            totales[compId] = 0;
          }
        }));
        setCompetenciasTotales(totales);
      } catch (e) {
        setAsignaturas([]);
        setCompetenciasTotales({});
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // Filtro de asignaturas por periodo seleccionado
  const asignaturasFiltradas = useMemo(() => {
    if (!periodoSeleccionado) return asignaturas;
    const [year, semester] = periodoSeleccionado.split('-');
    return asignaturas.filter(a => a.year === parseInt(year) && a.semestre === parseInt(semester));
  }, [asignaturas, periodoSeleccionado]);

  function normalize(str: string) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  }

  const filteredHistorial = asignaturas.filter(
    (item) =>
      normalize(item.nombre || "").startsWith(search.toLowerCase()) ||
      normalize(item.codigo || "").startsWith(search.toLowerCase())
  );

  // Calcular todas las competencias únicas del estudiante y cuántas veces aparecen
  const competenciasConteo: Record<string, { name: string, count: number, id: string }> = {};
  asignaturas.forEach(a => {
    (a.competencias || []).forEach((comp: {id: string, name: string}) => {
      if (!competenciasConteo[comp.id]) {
        competenciasConteo[comp.id] = { name: comp.name, count: 0, id: comp.id };
      }
      competenciasConteo[comp.id].count += 1;
    });
  });

  // Generar arreglo para el gráfico con todas las competencias encontradas;
  const competenciasGrafico = Object.values(competenciasConteo).map(({ name, count, id }) => {
    console.log('Competencia:', name, 'ID:', id, 'Count:', count);
    console.log('Total competencias:', competenciasTotales);
    const totalCarrera = competenciasTotales[id] || 0;
    
    return {
      name,
      value: totalCarrera > 0 ? Math.round((count / totalCarrera) * 100) : 0,
      color: "#1976d2",
      id,
      total: totalCarrera
    };
    
  });

  return (
    <PerformanceStudentView
      search={search}
      setSearch={setSearch}
      asignaturas={asignaturasFiltradas}
      loading={loading}
      competenciasGrafico={competenciasGrafico}
      competenciasConteo={Object.fromEntries(Object.entries(competenciasConteo).map(([k, v]) => [k, v.count]))}
      filteredHistorial={filteredHistorial}
      competenciasTotales={competenciasTotales}
      periodo={periodo}
      periodoSeleccionado={periodoSeleccionado}
      setPeriodoSeleccionado={setPeriodoSeleccionado}
    />
  );
};

export default PerformanceStudent;