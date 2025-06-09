import React, { useState } from "react";
import { Box, Typography, Button, Paper, TextField, Select, MenuItem, Chip, IconButton } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface Student {
    rut: string;
    name: string;
    email: string;
    grade: number; // 0 = sin evaluar
}

const mockStudentsByEcoe: Record<number, Student[]> = {
    1: [
        { rut: "20345788-2", name: "Carlos Martínez", email: "estudiante@alumnos.ucn.cl", grade: 0 },
        { rut: "21567824-7", name: "Maria Gonzalez", email: "estudiante@alumnos.ucn.cl", grade: 0 },
        { rut: "21876398-0", name: "Juan Perez", email: "estudiante@alumnos.ucn.cl", grade: 0 },
        { rut: "20879675-4", name: "Patricia Lopez", email: "estudiante@alumnos.ucn.cl", grade: 6.4 },
        { rut: "21985638-3", name: "Roberto Garcia", email: "estudiante@alumnos.ucn.cl", grade: 5.5 },
    ],
    2: [
        { rut: "12345678-9", name: "Ana Torres", email: "ana@alumnos.ucn.cl", grade: 0 },
        { rut: "98765432-1", name: "Luis Soto", email: "luis@alumnos.ucn.cl", grade: 4.2 },
    ],
    3: [
        { rut: "11223344-5", name: "Pedro Paredes", email: "pedro@alumnos.ucn.cl", grade: 0 },
        { rut: "55667788-9", name: "Lucia Rojas", email: "lucia@alumnos.ucn.cl", grade: 6.0 },
    ]
};

const getStatus = (grade: number) => {
    if (grade > 1.0) return { label: "Evaluado", color: "#D1FADF", text: "#2E7D32", bg: "#E6F4EA" };
    return { label: "Pendiente", color: "#FEF0C7", text: "#B54708", bg: "#FEF0C7" };
};

interface ManageEcoeProps {
    ecoe: { id: number; semester: number; description: string };
    onBack: () => void;
}

const ManageEcoe: React.FC<ManageEcoeProps> = ({ ecoe, onBack }) => {
    const [students] = useState<Student[]>(mockStudentsByEcoe[ecoe.id] || []);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<'todos' | 'evaluado' | 'pendiente'>('todos');

    const filteredStudents = students.filter(s => {
        const matchesRut = s.rut.toLowerCase().includes(search.toLowerCase());
        const status = getStatus(s.grade).label.toLowerCase();
        const matchesStatus = filter === 'todos' || (filter === 'evaluado' && status === 'evaluado') || (filter === 'pendiente' && status === 'pendiente');
        return matchesRut && matchesStatus;
    });

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <IconButton onClick={onBack} sx={{ mr: 1 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Box>
                    <Typography variant="h4" fontWeight={700} color="#000000">
                        Gestion de ECOE {ecoe.semester === 4 ? 'Basico' : ecoe.semester === 8 ? 'Profesional' : 'Final'}
                    </Typography>
                    <Typography color="text.secondary" fontSize={16}>
                        Evaluación de competencias {ecoe.semester === 4 ? 'basicas' : ecoe.semester === 8 ? 'profesionales' : 'finales'} de enfermería
                    </Typography>
                </Box>
            </Box>
            <Paper sx={{ p: 3, mt: 2, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box>
                        <Typography variant="h6" fontWeight={700}>Estudiantes</Typography>
                        <Typography color="text.secondary" fontSize={14}>
                            Seleccione Estudiante a evaluar o editar calificación
                        </Typography>
                    </Box>
                    <Button variant="contained" sx={{ bgcolor: "#1976d2", color: "#fff", borderRadius: 2 }} disabled>
                        Ingresar
                    </Button>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <TextField
                        placeholder="Buscar estudiantes."
                        size="small"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        sx={{ width: 300, bgcolor: "#F9FAFB" }}
                    />
                    <Select
                        value={filter}
                        onChange={e => setFilter(e.target.value as any)}
                        size="small"
                        sx={{ width: 120, bgcolor: "#F9FAFB" }}
                    >
                        <MenuItem value="todos">Todos</MenuItem>
                        <MenuItem value="evaluado">Evaluado</MenuItem>
                        <MenuItem value="pendiente">Pendiente</MenuItem>
                    </Select>
                </Box>
                <Box sx={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: "#fff" }}>
                                <th style={{ textAlign: 'left', padding: 8, color: "#888" }}>Rut</th>
                                <th style={{ textAlign: 'left', padding: 8, color: "#888" }}>Nombre</th>
                                <th style={{ textAlign: 'left', padding: 8, color: "#888" }}>Correo electronico</th>
                                <th style={{ textAlign: 'left', padding: 8, color: "#888" }}>Estado</th>
                                <th style={{ textAlign: 'left', padding: 8, color: "#888" }}>Calificacion</th>
                                <th style={{ textAlign: 'left', padding: 8, color: "#888" }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((s, idx) => {
                                const status = getStatus(s.grade);
                                return (
                                    <tr key={s.rut} style={{ borderBottom: "1px solid #f0f0f0" }}>
                                        <td style={{ padding: 8 }}>{s.rut}</td>
                                        <td style={{ padding: 8 }}>{s.name}</td>
                                        <td style={{ padding: 8 }}>{s.email}</td>
                                        <td style={{ padding: 8 }}>
                                            <Chip
                                                label={status.label}
                                                sx={{
                                                    bgcolor: status.bg,
                                                    color: status.text,
                                                    fontWeight: 600,
                                                    fontSize: 13,
                                                    px: 1.5
                                                }}
                                            />
                                        </td>
                                        <td style={{ padding: 8 }}>
                                            {s.grade > 1.0 ? s.grade.toFixed(1) : "-"}
                                        </td>
                                        <td style={{ padding: 8 }}>
                                            {s.grade > 1.0 ? (
                                                <Button variant="contained" sx={{ bgcolor: "#FFA500", color: "#fff", borderRadius: 2, fontWeight: 600, px: 2, textTransform: 'none' }} disabled>
                                                    Editar
                                                </Button>
                                            ) : (
                                                <Button variant="contained" sx={{ bgcolor: "#22C55E", color: "#fff", borderRadius: 2, fontWeight: 600, px: 2, textTransform: 'none' }} disabled>
                                                    Evaluar
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </Box>
            </Paper>
        </Box>
    );
};

export default ManageEcoe;