import axios from "axios";

export interface Ecoe {
    id: number;
    name: string;
    cycle: 'BASICO' | 'PROFESIONAL' | 'FINAL';
    year: number;
    semester: number;
    description: string;
}

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
        const response = await axios.get<Student[]>(`${API_URL}/ecoes/${ecoeId}/students`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener estudiantes", error);
        throw new Error("No se pudieron obtener los estudiantes del ECOE");
    }
};
