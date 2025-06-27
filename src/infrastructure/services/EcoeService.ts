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
        const response = await axios.get<Student[]>(`${API_URL}/ecoes/${ecoeId}/students`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener estudiantes", error);
        throw new Error("No se pudieron obtener los estudiantes del ECOE");
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

;
