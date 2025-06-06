import axios from 'axios';

export interface Ecoe{
    id: number;
    semester: number;
    description: string;
}

export const getAvailableEcoes = async (): Promise<Ecoe[]> => {
    try {
        const response = await axios.get<Ecoe[]>('http://localhost:3002/api/v1/ecoes/available');
        return response.data;
    } catch (error) {
        console.error('Error fetching ecoes:', error);
        throw error;
    }
}