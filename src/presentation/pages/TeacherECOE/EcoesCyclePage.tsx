import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Paper,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    CircularProgress,
    Modal,
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import { getAvailableEcoes, fetchStudentsByEcoeId, getStudentsWithoutEcoe, addStudentToEcoe, removeStudentFromEcoe, getCompetencies, evaluateStudentCompetency, Student, Competency } from "../../../infrastructure/services/EcoeService";
import { Ecoe } from "../../../domain/ecoe/Ecoe";

export const semesterLabelColor = (semester: number) => {
    switch (semester) {
        case 4:
            return { label: "4to semestre", color: "#DBE9FE", textColor: "#3255BE" };
        case 8:
            return { label: "8vo semestre", color: "#DCFCE7", textColor: "#2F7C53" };
        case 10:
            return { label: "10mo semestre", color: "#F3E8FF", textColor: "#8F3AD5" };
        default:
            return { label: `${semester}° semestre`, color: "#E0E0E0", textColor: "#555" };
    }
};

const primaryBlue = "#1565c0";
const primaryBlueHover = "#003c8f";

const EcoesCyclePage: React.FC = () => {
    const { cycle } = useParams<{ cycle: string }>();
    const navigate = useNavigate();

    const [ecoes, setEcoes] = useState<Ecoe[]>([]);
    const [selectedEcoe, setSelectedEcoe] = useState<Ecoe | null>(null);
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(false);
    
    // Estados para el modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [studentsWithoutEcoe, setStudentsWithoutEcoe] = useState<Student[]>([]);
    const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
    const [modalLoading, setModalLoading] = useState(false);
    const [addingStudents, setAddingStudents] = useState(false);
    const [removingStudentId, setRemovingStudentId] = useState<number | null>(null);
    const [filterText, setFilterText] = useState(""); // Estado para el filtro
    
    // Estados para el modal de confirmación de eliminación
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
    
    // Estados para el modal de evaluación
    const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
    const [currentStudentToEvaluate, setCurrentStudentToEvaluate] = useState<Student | null>(null);
    const [competencies, setCompetencies] = useState<Competency[]>([]);
    const [competenciesLoading, setCompetenciesLoading] = useState(false);
    const [submittingGrades, setSubmittingGrades] = useState(false);
    const [competencyGrades, setCompetencyGrades] = useState<{ [key: number]: number | null }>({});

    useEffect(() => {
        if (!cycle) return;

        setLoading(true);
        getAvailableEcoes(cycle)
            .then((ecoes) => {
                setEcoes(ecoes);
                if (ecoes.length > 0) {
                    setSelectedEcoe(ecoes[0]);
                } else {
                    setSelectedEcoe(null);
                    setStudents([]);
                }
            })
            .catch((e) => {
                console.error("Error al cargar ECOEs", e);
                setEcoes([]);
                setSelectedEcoe(null);
                setStudents([]);
                setLoading(false);
            });
    }, [cycle]);

    useEffect(() => {
        if (!selectedEcoe) {
            setStudents([]);
            return;
        }

        setLoading(true);

        const delay = setTimeout(() => {
            fetchStudentsByEcoeId(selectedEcoe.id)
                .then(setStudents)
                .catch((e) => {
                    console.error("Error al cargar estudiantes", e);
                    setStudents([]);
                })
                .finally(() => setLoading(false));
        }, 600); // retardo de 600ms

        return () => clearTimeout(delay);
    }, [selectedEcoe]);

    // Función para abrir el modal y cargar estudiantes sin ECOE
    const handleOpenModal = async () => {
        if (!cycle) return;
        
        setIsModalOpen(true);
        setModalLoading(true);
        
        try {
            const students = await getStudentsWithoutEcoe(cycle);
            setStudentsWithoutEcoe(students);
        } catch (error) {
            console.error("Error al cargar estudiantes sin ECOE", error);
            setStudentsWithoutEcoe([]);
        } finally {
            setModalLoading(false);
        }
    };

    // Función para cerrar el modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedStudents(new Set());
        setFilterText(""); // Limpiar filtro al cerrar
    };

    // Función para filtrar estudiantes sin ECOE
    const filteredStudentsWithoutEcoe = studentsWithoutEcoe.filter(student => {
        const searchText = filterText.toLowerCase();
        return (
            student.rut.toLowerCase().includes(searchText) ||
            student.name.toLowerCase().includes(searchText) ||
            student.email.toLowerCase().includes(searchText)
        );
    });

    // Función para manejar selección de estudiantes
    const handleToggleStudent = (studentId: string) => {
        const newSelected = new Set(selectedStudents);
        if (newSelected.has(studentId)) {
            newSelected.delete(studentId);
        } else {
            newSelected.add(studentId);
        }
        setSelectedStudents(newSelected);
    };

    // Función para seleccionar/deseleccionar todos
    const handleToggleAll = () => {
        if (selectedStudents.size === filteredStudentsWithoutEcoe.length) {
            setSelectedStudents(new Set());
        } else {
            setSelectedStudents(new Set(filteredStudentsWithoutEcoe.map(s => s.id || s.rut)));
        }
    };

    // Función para agregar estudiantes seleccionados
    const handleAddSelectedStudents = async () => {
        if (!selectedEcoe || selectedStudents.size === 0) return;
        
        setAddingStudents(true);
        
        try {
            // Obtener los IDs de los estudiantes seleccionados
            const selectedStudentData = studentsWithoutEcoe.filter(student => 
                selectedStudents.has(student.id || student.rut)
            );
            
            // Agregar cada estudiante al ECOE seleccionado
            const addPromises = selectedStudentData.map(student => {
                // Usar el ID del estudiante (no el RUT)
                const studentId = student.id || student.rut;
                return addStudentToEcoe(studentId, selectedEcoe.id.toString());
            });
            
            await Promise.all(addPromises);
            
            console.log(`${selectedStudents.size} estudiantes agregados exitosamente al ECOE`);
            
            // Cerrar el modal y limpiar selecciones
            handleCloseModal();
            
            // Recargar la lista de estudiantes del ECOE actual
            if (selectedEcoe) {
                const updatedStudents = await fetchStudentsByEcoeId(selectedEcoe.id);
                setStudents(updatedStudents);
            }
            
        } catch (error) {
            console.error("Error al agregar estudiantes al ECOE:", error);
            // Aquí podrías mostrar un mensaje de error al usuario
        } finally {
            setAddingStudents(false);
        }
    };

    // Función para abrir el diálogo de confirmación de eliminación
    const handleOpenDeleteConfirm = (student: Student) => {
        setStudentToDelete(student);
        setDeleteConfirmOpen(true);
    };

    // Función para cerrar el diálogo de confirmación
    const handleCloseDeleteConfirm = () => {
        setDeleteConfirmOpen(false);
        setStudentToDelete(null);
    };

    // Función para eliminar un estudiante del ECOE
    const handleRemoveStudent = async () => {
        if (!studentToDelete?.ecoeStudentId) {
            console.error("No se puede eliminar: ecoeStudentId no disponible");
            return;
        }

        setRemovingStudentId(studentToDelete.ecoeStudentId);
        setDeleteConfirmOpen(false);

        try {
            await removeStudentFromEcoe(studentToDelete.ecoeStudentId);
            
            console.log(`Estudiante ${studentToDelete.name} eliminado exitosamente del ECOE`);
            
            // Recargar la lista de estudiantes del ECOE actual
            if (selectedEcoe) {
                const updatedStudents = await fetchStudentsByEcoeId(selectedEcoe.id);
                setStudents(updatedStudents);
            }
            
        } catch (error) {
            console.error("Error al eliminar estudiante del ECOE:", error);
            // Aquí podrías mostrar un mensaje de error al usuario
        } finally {
            setRemovingStudentId(null);
            setStudentToDelete(null);
        }
    };

    // Función para abrir el modal de evaluación
    const handleOpenEvaluationModal = async (student: Student) => {
        setCurrentStudentToEvaluate(student);
        setIsEvaluationModalOpen(true);
        setCompetenciesLoading(true);
        
        // Resetear las calificaciones - inicialmente vacío, se llenará cuando se carguen las competencias
        setCompetencyGrades({});

        try {
            // Cargar las competencias desde la API
            const competenciesData = await getCompetencies();
            setCompetencies(competenciesData);
            
            // Inicializar las calificaciones basado en los IDs reales de las competencias
            const initialGrades: { [key: number]: number | null } = {};
            competenciesData.forEach(competency => {
                initialGrades[competency.id] = null;
            });
            setCompetencyGrades(initialGrades);
            
            console.log("Competencias cargadas:", competenciesData);
            console.log("Estado inicial de calificaciones:", initialGrades);
        } catch (error) {
            console.error("Error al cargar competencias:", error);
            setCompetencies([]);
            setCompetencyGrades({});
        } finally {
            setCompetenciesLoading(false);
        }
    };

    // Función para cerrar el modal de evaluación
    const handleCloseEvaluationModal = () => {
        setIsEvaluationModalOpen(false);
        setCurrentStudentToEvaluate(null);
        setCompetencies([]);
        setCompetenciesLoading(false);
        setSubmittingGrades(false);
        setCompetencyGrades({});
    };

    // Función para manejar cambios en las calificaciones
    const handleGradeChange = (competencyId: number, value: string) => {
        const numericValue = parseFloat(value);
        if (isNaN(numericValue) || numericValue < 1.0 || numericValue > 7.0) {
            setCompetencyGrades(prev => ({ ...prev, [competencyId]: null }));
        } else {
            setCompetencyGrades(prev => ({ ...prev, [competencyId]: numericValue }));
        }
    };

    // Función para validar si todas las calificaciones están completas
    const areAllGradesComplete = () => {
        // Si no hay competencias cargadas, no está completo
        if (competencies.length === 0) return false;
        
        // Verificar que todas las competencias tengan calificación
        return competencies.every(competency => {
            const grade = competencyGrades[competency.id];
            return grade !== null && grade !== undefined && grade >= 1.0 && grade <= 7.0;
        });
    };

    // Función para enviar las calificaciones
    const handleSubmitGrades = async () => {
        if (!areAllGradesComplete() || !currentStudentToEvaluate?.ecoeStudentId) return;
        
        setSubmittingGrades(true);
        console.log("=== DEBUG SUBMIT GRADES ===");
        console.log("Estudiante actual:", currentStudentToEvaluate);
        console.log("ecoeStudentId:", currentStudentToEvaluate?.ecoeStudentId, "tipo:", typeof currentStudentToEvaluate?.ecoeStudentId);
        console.log("Calificaciones completas:", competencyGrades);
        
        try {
            // Enviar cada calificación por competencia
            const evaluationPromises = Object.entries(competencyGrades).map(([competencyId, grade]) => {
                console.log(`Procesando entrada: competencyId="${competencyId}" (tipo: ${typeof competencyId}), grade=${grade} (tipo: ${typeof grade})`);
                
                if (grade !== null) {
                    const parsedCompetencyId = parseInt(competencyId);
                    console.log(`Enviando evaluación: ecoeStudentId=${currentStudentToEvaluate.ecoeStudentId}, competencyId=${parsedCompetencyId}, grade=${grade}`);
                    
                    return evaluateStudentCompetency(
                        currentStudentToEvaluate.ecoeStudentId!,
                        parsedCompetencyId,
                        grade
                    );
                }
                return Promise.resolve();
            });

            await Promise.all(evaluationPromises);
            
            console.log("Todas las calificaciones enviadas exitosamente");
            
            // Recargar la lista de estudiantes para actualizar las calificaciones
            if (selectedEcoe) {
                const updatedStudents = await fetchStudentsByEcoeId(selectedEcoe.id);
                setStudents(updatedStudents);
            }
            
            handleCloseEvaluationModal();
        } catch (error) {
            console.error("Error al enviar las calificaciones:", error);
            // Aquí podrías mostrar un mensaje de error al usuario
        } finally {
            setSubmittingGrades(false);
        }
    };

    if (!cycle) {
        return <Typography color="error">Ciclo no especificado</Typography>;
    }

    return (
        <Box>
            <Button
                variant="contained"
                onClick={() => navigate("/docente-ecoe/ecoes/")}
                sx={{
                    mb: 3,
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: 700,
                    bgcolor: primaryBlue,
                    color: "#fff",
                    minHeight: 40,
                    transition:
                        "background-color 0.4s ease, color 0.4s ease, box-shadow 0.4s ease, transform 0.3s ease",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    "&:hover": {
                        bgcolor: primaryBlueHover,
                        color: "#fff",
                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                        transform: "translateY(-2px)",
                    },
                }}
            >
                ← Volver a selección de ciclo
            </Button>

            <Typography variant="h4" fontWeight={700} sx={{ mb: 2, color: "#000" }}>
                ECOEs para ciclo {cycle.toLowerCase()}
            </Typography>

            {ecoes.length === 0 ? (
                <Typography variant="body1" color="text.secondary">
                    No hay ECOEs disponibles para este ciclo.
                </Typography>
            ) : (
                <>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                        <FormControl sx={{ minWidth: 123 }}>
                            <InputLabel id="select-ecoe-label">Seleccione ECOE</InputLabel>
                            <Select
                                labelId="select-ecoe-label"
                                value={selectedEcoe?.id ?? ""}
                                label="Seleccione ECOE"
                                onChange={(e) => {
                                    const ecoeId = Number(e.target.value);
                                    const newEcoe = ecoes.find((e) => e.id === ecoeId) || null;
                                    setSelectedEcoe(newEcoe);
                                }}
                                sx={{ textAlign: "center"}}
                                renderValue={(selected) => {
                                    const ecoe = ecoes.find(e => e.id === selected);
                                    return ecoe ? `Año: ${ecoe.year} | Semestre: ${ecoe.semester}` : "";
                                }}
                            >
                                {ecoes.map((ecoe) => (
                                    <MenuItem key={ecoe.id} value={ecoe.id} sx={{ justifyContent: "center", textAlign: "center" }}>
                                        {`${ecoe.year}-${ecoe.semester}`}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Button
                            variant="contained"
                            onClick={handleOpenModal}
                            sx={{
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 600,
                                bgcolor: primaryBlue,
                                color: "#fff",
                                minHeight: 36,
                                px: 3,
                                transition: "background-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease",
                                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                                "&:hover": {
                                    bgcolor: primaryBlueHover,
                                    boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.15)",
                                    transform: "translateY(-1px)",
                                },
                            }}
                        >
                            + Agregar estudiantes
                        </Button>
                    </Box>

                    {selectedEcoe && (
                        loading ? (
                            <Paper sx={{ p: 3, borderRadius: 3 }}>
                                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                                    Cargando estudiantes de ECOE...
                                </Typography>
                                <CircularProgress color="primary" />
                            </Paper>
                        ) : (
                            <Paper sx={{ p: 3, borderRadius: 3, maxHeight: 500, overflowY: "auto" }}>
                                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                                    Lista de estudiantes ingresados
                                </Typography>
                                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <thead>
                                        <tr style={{ background: "#fff" }}>
                                            <th style={{ textAlign: "left", padding: 8, color: "#888" }}>RUT</th>
                                            <th style={{ textAlign: "left", padding: 8, color: "#888" }}>Nombre</th>
                                            <th style={{ textAlign: "left", padding: 8, color: "#888" }}>Correo electrónico</th>
                                            <th style={{ textAlign: "center", padding: 8, color: "#888" }}>Calificaciones</th>
                                            <th style={{ textAlign: "center", padding: 8, color: "#888" }}>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map((s) => {
                                            const studentKey = s.id || s.rut;
                                            return (
                                                <tr key={studentKey} style={{ borderBottom: "1px solid #f0f0f0" }}>
                                                    <td style={{ padding: 8 }}>{s.rut}</td>
                                                    <td style={{ padding: 8 }}>{s.name}</td>
                                                    <td style={{ padding: 8 }}>{s.email}</td>
                                                    <td style={{ padding: 8, textAlign: "center" }}>
                                                        {s.grade > 0 ? (
                                                            <Box sx={{ 
                                                                display: "inline-flex", 
                                                                alignItems: "center", 
                                                                bgcolor: s.grade >= 4 ? "#dcfce7" : "#fef2f2", 
                                                                color: s.grade >= 4 ? "#166534" : "#dc2626",
                                                                px: 2,
                                                                py: 0.5,
                                                                borderRadius: 2,
                                                                fontWeight: 600,
                                                                fontSize: "0.875rem"
                                                            }}>
                                                                {s.grade.toFixed(1)}
                                                            </Box>
                                                        ) : (
                                                            <Typography variant="body2" color="text.secondary">
                                                                Sin calificar
                                                            </Typography>
                                                        )}
                                                    </td>
                                                    <td style={{ padding: 8, textAlign: "center" }}>
                                                        <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                                                            <Button
                                                                variant="outlined"
                                                                size="small"
                                                                sx={{
                                                                    textTransform: "none",
                                                                    fontSize: "0.75rem",
                                                                    minWidth: "auto",
                                                                    px: 1.5,
                                                                    py: 0.5,
                                                                    borderColor: primaryBlue,
                                                                    color: primaryBlue,
                                                                    "&:hover": {
                                                                        bgcolor: primaryBlue,
                                                                        color: "white",
                                                                    }
                                                                }}
                                                                onClick={() => handleOpenEvaluationModal(s)}
                                                            >
                                                                Evaluar
                                                            </Button>
                                                            <Button
                                                                variant="outlined"
                                                                size="small"
                                                                color="error"
                                                                disabled={removingStudentId === s.ecoeStudentId}
                                                                sx={{
                                                                    textTransform: "none",
                                                                    fontSize: "0.75rem",
                                                                    minWidth: "auto",
                                                                    px: 1.5,
                                                                    py: 0.5,
                                                                }}
                                                                onClick={() => handleOpenDeleteConfirm(s)}
                                                            >
                                                                {removingStudentId === s.ecoeStudentId ? (
                                                                    <CircularProgress size={12} color="inherit" />
                                                                ) : (
                                                                    'Eliminar'
                                                                )}
                                                            </Button>
                                                        </Box>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </Paper>
                        )
                    )}
                </>
            )}
            
            {/* Modal para evaluar competencias */}
            <Modal
                open={isEvaluationModalOpen}
                onClose={handleCloseEvaluationModal}
                aria-labelledby="evaluation-modal-title"
                aria-describedby="evaluation-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    maxWidth: 600,
                    bgcolor: 'background.paper',
                    borderRadius: 3,
                    boxShadow: 24,
                    p: 4,
                    maxHeight: '80vh',
                    overflow: 'auto'
                }}>
                    <Typography id="evaluation-modal-title" variant="h5" fontWeight={700} sx={{ mb: 2 }}>
                        Evaluar Competencias
                    </Typography>
                    
                    {currentStudentToEvaluate && (
                        <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                            <Typography variant="h6" fontWeight={600}>
                                {currentStudentToEvaluate.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                RUT: {currentStudentToEvaluate.rut}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Email: {currentStudentToEvaluate.email}
                            </Typography>
                        </Box>
                    )}

                    <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                        Calificaciones por Competencia
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Ingrese las calificaciones (1.0 - 7.0) para cada competencia:
                    </Typography>

                    <TableContainer component={Paper} sx={{ maxHeight: 400, mb: 3 }}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600 }}>Competencia</TableCell>
                                    <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>Calificación</TableCell>
                                    <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>Estado</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {competenciesLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={3} sx={{ textAlign: 'center', py: 3 }}>
                                            <CircularProgress size={24} />
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                Cargando competencias...
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : competencies.length > 0 ? (
                                    competencies.map((competency) => (
                                        <TableRow key={competency.id}>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {competency.name}
                                                </Typography>
                                                
                                            </TableCell>
                                            <TableCell sx={{ width: 120, textAlign: 'center' }}>
                                                <Select
                                                    value={competencyGrades[competency.id] ?? ""}
                                                    onChange={(e) => handleGradeChange(competency.id, String(e.target.value))}
                                                    displayEmpty
                                                    sx={{ textAlign: "center"}}
                                                >
                                                    <MenuItem value="" disabled>
                                                        Calificación
                                                    </MenuItem>
                                                    {Array.from({ length: 61 }, (_, i) => {
                                                        const grade = 1.0 + (i * 0.1);
                                                        return (
                                                            <MenuItem key={grade} value={grade}>
                                                                {grade.toFixed(1)}
                                                            </MenuItem>
                                                        );
                                                    })}
                                                </Select>
                                            </TableCell>
                                            <TableCell sx={{ width: 100, textAlign: 'center' }}>
                                                {competencyGrades[competency.id] ? (
                                                    <Box sx={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        bgcolor: competencyGrades[competency.id]! >= 4.0 ? '#dcfce7' : '#fef2f2',
                                                        color: competencyGrades[competency.id]! >= 4.0 ? '#166534' : '#dc2626',
                                                        px: 1,
                                                        py: 0.5,
                                                        borderRadius: 1,
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600
                                                    }}>
                                                        {competencyGrades[competency.id]! >= 4.0 ? 'Aprobado' : 'Reprobado'}
                                                    </Box>
                                                ) : (
                                                    <Typography variant="body2" color="text.secondary">
                                                        -
                                                    </Typography>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} sx={{ textAlign: 'center', py: 3 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                No se pudieron cargar las competencias
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {!areAllGradesComplete() && (
                        <Typography variant="body2" color="error" sx={{ mb: 2, fontStyle: 'italic' }}>
                            * Debe completar todas las calificaciones para enviar la evaluación
                        </Typography>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={handleCloseEvaluationModal}
                            sx={{ textTransform: 'none' }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleSubmitGrades}
                            disabled={!areAllGradesComplete()}
                            sx={{
                                textTransform: 'none',
                                bgcolor: primaryBlue,
                                '&:hover': {
                                    bgcolor: primaryBlueHover,
                                },
                            }}
                        >
                            Enviar Evaluación
                        </Button>
                    </Box>
                </Box>
            </Modal>
            
            {/* Modal para agregar estudiantes */}
            <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
                aria-labelledby="add-students-modal-title"
                aria-describedby="add-students-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80%',
                    maxWidth: 800,
                    bgcolor: 'background.paper',
                    borderRadius: 3,
                    boxShadow: 24,
                    p: 4,
                    maxHeight: '80vh',
                    overflow: 'auto'
                }}>
                    <Typography id="add-students-modal-title" variant="h5" fontWeight={700} sx={{ mb: 2 }}>
                        Agregar estudiantes al ciclo {cycle}
                    </Typography>
                    
                    {modalLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            {studentsWithoutEcoe.length === 0 ? (
                                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                                    No hay estudiantes disponibles para agregar a este ciclo.
                                </Typography>
                            ) : (
                                <>
                                    {/* Campo de filtro */}
                                    <TextField
                                        fullWidth
                                        label="Filtrar por RUT, nombre o email"
                                        variant="outlined"
                                        size="small"
                                        value={filterText}
                                        onChange={(e) => setFilterText(e.target.value)}
                                        sx={{ mb: 2 }}
                                        placeholder="Escriba para filtrar estudiantes..."
                                    />

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            {filteredStudentsWithoutEcoe.length} de {studentsWithoutEcoe.length} estudiantes
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={handleToggleAll}
                                            sx={{ textTransform: 'none' }}
                                        >
                                            {selectedStudents.size === filteredStudentsWithoutEcoe.length ? 'Deseleccionar todos' : 'Seleccionar todos'}
                                        </Button>
                                    </Box>
                                    
                                    <TableContainer component={Paper} sx={{ maxHeight: 400, mb: 3 }}>
                                        <Table stickyHeader size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            indeterminate={selectedStudents.size > 0 && selectedStudents.size < filteredStudentsWithoutEcoe.length}
                                                            checked={filteredStudentsWithoutEcoe.length > 0 && selectedStudents.size === filteredStudentsWithoutEcoe.length}
                                                            onChange={handleToggleAll}
                                                        />
                                                    </TableCell>
                                                    <TableCell sx={{ fontWeight: 600 }}>RUT</TableCell>
                                                    <TableCell sx={{ fontWeight: 600 }}>Nombre</TableCell>
                                                    <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {filteredStudentsWithoutEcoe.map((student) => {
                                                    const studentKey = student.id || student.rut;
                                                    return (
                                                        <TableRow key={studentKey} hover>
                                                            <TableCell padding="checkbox">
                                                                <Checkbox
                                                                    checked={selectedStudents.has(studentKey)}
                                                                    onChange={() => handleToggleStudent(studentKey)}
                                                                />
                                                            </TableCell>
                                                            <TableCell>{student.rut}</TableCell>
                                                            <TableCell>{student.name}</TableCell>
                                                            <TableCell>{student.email}</TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>

                                    {filteredStudentsWithoutEcoe.length === 0 && filterText && (
                                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                                            No se encontraron estudiantes con el filtro "{filterText}"
                                        </Typography>
                                    )}
                                </>
                            )}
                            
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                <Button
                                    variant="outlined"
                                    onClick={handleCloseModal}
                                    sx={{ textTransform: 'none' }}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleAddSelectedStudents}
                                    disabled={selectedStudents.size === 0 || addingStudents}
                                    sx={{
                                        textTransform: 'none',
                                        bgcolor: primaryBlue,
                                        '&:hover': {
                                            bgcolor: primaryBlueHover,
                                        },
                                    }}
                                >
                                    {addingStudents ? (
                                        <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                                    ) : null}
                                    {addingStudents 
                                        ? 'Agregando...' 
                                        : `Agregar ${selectedStudents.size} estudiante${selectedStudents.size !== 1 ? 's' : ''}`
                                    }
                                </Button>
                            </Box>
                        </>
                    )}
                </Box>
            </Modal>

            {/* Modal para evaluación de competencias */}
            <Modal
                open={isEvaluationModalOpen}
                onClose={handleCloseEvaluationModal}
                aria-labelledby="evaluation-modal-title"
                aria-describedby="evaluation-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    maxWidth: 600,
                    bgcolor: 'background.paper',
                    borderRadius: 3,
                    boxShadow: 24,
                    p: 4,
                    maxHeight: '80vh',
                    overflow: 'auto'
                }}>
                    <Typography id="evaluation-modal-title" variant="h5" fontWeight={700} sx={{ mb: 2 }}>
                        Evaluación de competencias - {currentStudentToEvaluate?.name}
                    </Typography>
                    
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            RUT: {currentStudentToEvaluate?.rut}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Email: {currentStudentToEvaluate?.email}
                        </Typography>
                    </Box>
                    
                    <TableContainer component={Paper} sx={{ maxHeight: 400, mb: 3 }}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600 }}>Competencia</TableCell>
                                    <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>Calificación</TableCell>
                                    <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>Estado</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {competenciesLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={3} sx={{ textAlign: 'center', py: 3 }}>
                                            <CircularProgress size={24} />
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                Cargando competencias...
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : competencies.length > 0 ? (
                                    competencies.map((competency) => (
                                        <TableRow key={competency.id}>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {competency.name}
                                                </Typography>
                                                
                                            </TableCell>
                                            <TableCell sx={{ width: 120, textAlign: 'center' }}>
                                                <Select
                                                    value={competencyGrades[competency.id] ?? ""}
                                                    onChange={(e) => handleGradeChange(competency.id, String(e.target.value))}
                                                    displayEmpty
                                                    sx={{ textAlign: "center"}}
                                                >
                                                    <MenuItem value="" disabled>
                                                        Calificación
                                                    </MenuItem>
                                                    {Array.from({ length: 61 }, (_, i) => {
                                                        const grade = 1.0 + (i * 0.1);
                                                        return (
                                                            <MenuItem key={grade} value={grade}>
                                                                {grade.toFixed(1)}
                                                            </MenuItem>
                                                        );
                                                    })}
                                                </Select>
                                            </TableCell>
                                            <TableCell sx={{ width: 100, textAlign: 'center' }}>
                                                {competencyGrades[competency.id] ? (
                                                    <Box sx={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        bgcolor: competencyGrades[competency.id]! >= 4.0 ? '#dcfce7' : '#fef2f2',
                                                        color: competencyGrades[competency.id]! >= 4.0 ? '#166534' : '#dc2626',
                                                        px: 1,
                                                        py: 0.5,
                                                        borderRadius: 1,
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600
                                                    }}>
                                                        {competencyGrades[competency.id]! >= 4.0 ? 'Aprobado' : 'Reprobado'}
                                                    </Box>
                                                ) : (
                                                    <Typography variant="body2" color="text.secondary">
                                                        -
                                                    </Typography>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} sx={{ textAlign: 'center', py: 3 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                No se pudieron cargar las competencias
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    
                    {!areAllGradesComplete() && (
                        <Typography variant="body2" color="error" sx={{ mb: 2, fontStyle: 'italic' }}>
                            * Debe completar todas las calificaciones para enviar la evaluación
                        </Typography>
                    )}
                    
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={handleCloseEvaluationModal}
                            sx={{ textTransform: 'none' }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleSubmitGrades}
                            disabled={!areAllGradesComplete() || submittingGrades}
                            sx={{
                                textTransform: 'none',
                                bgcolor: primaryBlue,
                                '&:hover': {
                                    bgcolor: primaryBlueHover,
                                },
                            }}
                        >
                            {submittingGrades ? (
                                <>
                                    <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                                    Guardando...
                                </>
                            ) : (
                                'Guardar calificaciones'
                            )}
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {/* Diálogo de confirmación para eliminar estudiante */}
            <Dialog
                open={deleteConfirmOpen}
                onClose={handleCloseDeleteConfirm}
                aria-labelledby="delete-confirm-dialog-title"
                aria-describedby="delete-confirm-dialog-description"
            >
                <DialogTitle id="delete-confirm-dialog-title">
                    Confirmar eliminación
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-confirm-dialog-description">
                        ¿Está seguro de que desea eliminar a <strong>{studentToDelete?.name}</strong> del ECOE?
                        <br /><br />
                        <strong>Advertencia:</strong> Esta acción eliminará al estudiante del ECOE y todas las competencias evaluadas asociadas a este estudiante se perderán permanentemente.
                        <br /><br />
                        Esta acción no se puede deshacer.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={handleCloseDeleteConfirm} 
                        sx={{ textTransform: 'none' }}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleRemoveStudent} 
                        color="error" 
                        variant="contained"
                        disabled={removingStudentId === studentToDelete?.ecoeStudentId}
                        sx={{ textTransform: 'none' }}
                    >
                        {removingStudentId === studentToDelete?.ecoeStudentId ? (
                            <>
                                <CircularProgress size={16} color="inherit" sx={{ mr: 1 }} />
                                Eliminando...
                            </>
                        ) : (
                            'Eliminar estudiante'
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default EcoesCyclePage;
