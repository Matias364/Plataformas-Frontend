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
} from "@mui/material";
import { getAvailableEcoes, fetchStudentsByEcoeId, Student } from "../../../infrastructure/services/EcoeService";
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
                    <FormControl sx={{ minWidth: 123, mb: 3 }}>
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
                                            <th style={{ textAlign: "left", padding: 8, color: "#888" }}>Rut</th>
                                            <th style={{ textAlign: "left", padding: 8, color: "#888" }}>Nombre</th>
                                            <th style={{ textAlign: "left", padding: 8, color: "#888" }}>Correo electrónico</th>
                                            <th style={{ textAlign: "left", padding: 8, color: "#888" }}>Calificación</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map((s) => (
                                            <tr key={s.rut} style={{ borderBottom: "1px solid #f0f0f0" }}>
                                                <td style={{ padding: 8 }}>{s.rut}</td>
                                                <td style={{ padding: 8 }}>{s.name}</td>
                                                <td style={{ padding: 8 }}>{s.email}</td>
                                                <td style={{ padding: 8 }}>{s.grade > 0 ? s.grade.toFixed(1) : "-"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Paper>
                        )
                    )}
                </>
            )}
        </Box>
    );
};

export default EcoesCyclePage;
