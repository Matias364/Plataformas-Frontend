import axios from 'axios';
import { Ecoe } from '../../domain/ecoe/Ecoe';
import { EcoeYear } from '../../domain/ecoe/EcoeYear';

export const getAvailableEcoes = async (): Promise<Ecoe[]> => {
    try {
        const response = await axios.get<Ecoe[]>('http://localhost:3002/api/v1/ecoes/available');
        return response.data;
    } catch (error) {
        console.error('Error fetching ecoes:', error);
        throw error;
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