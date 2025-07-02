import axios from 'axios';
import { Ecoe } from '../../domain/ecoe/Ecoe';
import { EcoeYear } from '../../domain/ecoe/EcoeYear';

export interface Student {
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
                        rut: studentInfo.rut || studentEcoeResult.studentId,
                        name: studentInfo.fullname || 'Nombre no disponible',
                        email: studentInfo.email || 'Email no disponible',
                        grade: studentEcoeResult.finalGrade || 0
                    };
                } catch (error) {
                    console.warn(`Error obteniendo info del estudiante ${studentEcoeResult.studentId}:`, error);
                    // Fallback con información básica
                    return {
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
                        rut: studentInfo.rut || studentData.rut || studentId,
                        name: studentInfo.fullname || studentInfo.name || 'Nombre no disponible',
                        email: studentInfo.email || 'Email no disponible',
                        grade: 0 // Los estudiantes sin ECOE no tienen calificación
                    };
                } catch (error) {
                    console.warn(`Error obteniendo info del estudiante ${studentData.id || studentData.rut}:`, error);
                    // Fallback con información básica
                    return {
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
