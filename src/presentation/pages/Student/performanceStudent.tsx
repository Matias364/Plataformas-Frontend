import { useState, useEffect } from 'react';
import PerformanceStudentView from './PerformanceStudentView';

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
        console.log('Access Token:', accessToken);
        const resStudent = await fetch('http://localhost:3001/api/v1/students/me/subjects', {
          headers: {
            Authorization: `Bearer ${accessToken?.replace(/"/g, '')}`,
          },
        });
        if (!resStudent.ok) {
          throw new Error('No se pudo obtener la información del estudiante');
        }
        const student = await resStudent.json();
        setUserData(student);

        // Obtener info de cada asignatura y sus competencias
        const asignaturasData = await Promise.all(
          (student.subjects || []).map(async (subj: any) => {
            // Obtener datos de la asignatura
            const resAsig = await fetch(`http://localhost:3001/api/v1/subjects/${subj.subjectId}`);
            const asigInfo = await resAsig.json();

            // Obtener competencias de la asignatura
            let competencias: string[] = [];
            try {
              const resCompetencias = await fetch(`http://localhost:3001/api/v1/students/subjects/${subj.subjectId}/competencies`);
              if (resCompetencias.ok) {
                const competenciasData = await resCompetencias.json();
                competencias = (competenciasData || []).map((comp: any) => comp.competency.name || comp.competency.nombre);
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
              competencias,
              nivel,
            };
          })
        );
        setAsignaturas(asignaturasData);
      } catch (e) {
        setAsignaturas([]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const filteredHistorial = asignaturas.filter(
    (item) =>
      item.nombre?.toLowerCase().includes(search.toLowerCase()) ||
      item.codigo?.toLowerCase().includes(search.toLowerCase())
  );

  // Calcular todas las competencias únicas del estudiante y cuántas veces aparecen
  const competenciasConteo: Record<string, number> = {};
  asignaturas.forEach(a => {
    (a.competencias || []).forEach((comp: string) => {
      competenciasConteo[comp] = (competenciasConteo[comp] || 0) + 1;
    });
  });

  // Generar arreglo para el gráfico con todas las competencias encontradas
  const totalAsignaturas = asignaturas.length;
  const competenciasGrafico = Object.entries(competenciasConteo).map(([name, count]) => ({
    name,
    value: totalAsignaturas > 0 ? Math.round((count / totalAsignaturas) * 100) : 0,
    color: "#1976d2"
  }));

  return (
    <PerformanceStudentView
      userData={userData}
      selected={selected}
      setSelected={setSelected}
      handleLogout={handleLogout}
      search={search}
      setSearch={setSearch}
      asignaturas={asignaturas}
      loading={loading}
      competenciasGrafico={competenciasGrafico}
      competenciasConteo={competenciasConteo}
      totalAsignaturas={totalAsignaturas}
      filteredHistorial={filteredHistorial}
    />
  );
};

export default PerformanceStudent;