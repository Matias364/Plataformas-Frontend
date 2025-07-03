import axios from 'axios';
import { Ecoe } from '../../domain/ecoe/Ecoe';
import { EcoeYear } from '../../domain/ecoe/EcoeYear';

export interface Student {
    id?: string; // ID interno del estudiante
    rut: string;
    name: string;
    email: string;
    grade: number;
}

const API_URL = import.meta.env.VITE_BACKEND_ECOE_URL;

export const getAvailableEcoes = async (cycle: string): Promise<Ecoe[]> => {
    try {
        const response = await axios.get<Ecoe[]>(`${API_URL}/ecoes/by-cycle/${cycle}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener ECOEs", error);
        throw new Error("No se pudieron obtener los ECOEs");
    }
};

export const fetchStudentsByEcoeId = async (ecoeId: number): Promise<Student[]> => {
    try {
        // El endpoint devuelve el formato complejo con competencias
        const response = await axios.get(`${API_URL}/ecoes/${ecoeId}/students`);
        const studentsEcoeData = response.data;
        
        // Transformamos cada elemento al formato Student usando Promise.all para obtener info adicional
        const students = await Promise.all(
            studentsEcoeData.map(async (studentEcoeResult: any) => {
                try {
                    // Obtenemos información del estudiante desde el otro endpoint
                    const studentInfoResponse = await axios.get(`http://localhost:3001/api/v1/students/${studentEcoeResult.studentId}`);
                    const studentInfo = studentInfoResponse.data;
                    
                    return {
                        id: studentEcoeResult.studentId,
                        rut: studentInfo.rut || studentEcoeResult.studentId,
                        name: studentInfo.fullname || 'Nombre no disponible',
                        email: studentInfo.email || 'Email no disponible',
                        grade: studentEcoeResult.finalGrade || 0
                    };
                } catch (error) {
                    console.warn(`Error obteniendo info del estudiante ${studentEcoeResult.studentId}:`, error);
                    // Fallback con información básica
                    return {
                        id: studentEcoeResult.studentId,
                        rut: studentEcoeResult.studentId,
                        name: 'Información no disponible',
                        email: 'No disponible',
                        grade: studentEcoeResult.finalGrade || 0
                    };
                }
            })
        );
        
        return students;
    } catch (error) {
        console.error("Error al obtener estudiantes", error);
        throw new Error("No se pudieron obtener los estudiantes del ECOE");
    }
};

export const getStudentById = async (studentId: string): Promise<Student> => {
    try {
        const response = await axios.get(`http://localhost:3001/api/v1/students/${studentId}`);
        return {
            rut: response.data.rut || studentId,
            name: response.data.name || 'Nombre no disponible',
            email: response.data.email || 'Email no disponible',
            grade: response.data.grade || 0
        };
    } catch (error) {
        console.error("Error al obtener información del estudiante", error);
        throw new Error("No se pudo obtener la información del estudiante");
    }
};

export const getStudentEcoeYears = async (userId: string): Promise<EcoeYear[]> => {
    const response = await axios.get<EcoeYear[]>(`http://localhost:3001/api/v1/students/${userId}/ecoeYears`);
    if (response.status !== 200) {
        throw new Error('Error fetching ecoe years');
    }
    return response.data;
};

export const getStudentEcoeCompetencies = async (userId: string, ecoeId: number) => {
    const response = await axios.get(`http://localhost:3001/api/v1/students/${userId}/ecoe/${ecoeId}`);
    return response.data;
};

export const getStudentEcoeAvg = async (userId: string, ecoeId: number) => {
    const response = await axios.get(`http://localhost:3001/api/v1/students/${userId}/ecoe/${ecoeId}/avg`);
    return response.data;
};

export const getStudentsWithoutEcoe = async (cycle: string): Promise<Student[]> => {
    try {
        const response = await axios.get(`http://localhost:3002/api/v1/ecoes/students-without-ecoe/${cycle}`);
        const studentsData = response.data;
        
        // Obtenemos información detallada de cada estudiante usando Promise.all
        const students = await Promise.all(
            studentsData.map(async (studentData: any) => {
                try {
                    // El endpoint devuelve objetos con {id, rut, currentSemester}
                    const studentId = studentData.id || studentData.rut;
                    const studentInfoResponse = await axios.get(`http://localhost:3001/api/v1/students/${studentId}`);
                    const studentInfo = studentInfoResponse.data;
                    
                    return {
                        id: studentData.id || studentId, // Conservamos el ID original
                        rut: studentInfo.rut || studentData.rut || studentId,
                        name: studentInfo.fullname || studentInfo.name || 'Nombre no disponible',
                        email: studentInfo.email || 'Email no disponible',
                        grade: 0 // Los estudiantes sin ECOE no tienen calificación
                    };
                } catch (error) {
                    console.warn(`Error obteniendo info del estudiante ${studentData.id || studentData.rut}:`, error);
                    // Fallback con información básica
                    return {
                        id: studentData.id || studentData.rut || 'ID no disponible',
                        rut: studentData.rut || studentData.id || 'RUT no disponible',
                        name: 'Información no disponible',
                        email: 'No disponible',
                        grade: 0
                    };
                }
            })
        );
        
        return students;
    } catch (error) {
        console.error("Error al obtener estudiantes sin ECOE", error);
        throw new Error("No se pudieron obtener los estudiantes sin ECOE");
    }
};

export const addStudentToEcoe = async (studentId: string, ecoeId: string): Promise<void> => {
    try {
        console.log("Enviando datos al endpoint:", { studentId, ecoeId });
        
        const response = await axios.post(`http://localhost:3002/api/v1/ecoes/add-student-to-ecoe`, {
            studentId,
            ecoeId
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.status !== 200 && response.status !== 201) {
            throw new Error("Error al agregar estudiante al ECOE");
        }
        
        console.log("Estudiante agregado exitosamente:", response.data);
    } catch (error: any) {
        console.error("Error al agregar estudiante al ECOE", error);
        
        if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
            console.error("Response headers:", error.response.headers);
            
            // Intentar mostrar el mensaje de error específico del servidor
            const errorMessage = error.response.data?.message || error.response.data?.error || "Error desconocido del servidor";
            throw new Error(`Error ${error.response.status}: ${errorMessage}`);
        } else if (error.request) {
            console.error("Request error:", error.request);
            throw new Error("No se pudo conectar con el servidor");
        } else {
            console.error("Error:", error.message);
            throw new Error(error.message || "Error desconocido");
        }
    }
};
