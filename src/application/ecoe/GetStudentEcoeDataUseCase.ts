import { EcoeYear } from "../../domain/ecoe/EcoeYear";
import { getStudentEcoeAvg, getStudentEcoeCompetencies, getStudentEcoeYears } from "../../infrastructure/services/EcoeService";


export class GetStudentEcoeDataUseCase {
    async getYears(userId: string): Promise<EcoeYear[]> {
        return await getStudentEcoeYears(userId);
    }
    async getCompetencies(userId: string, ecoeId: number) {
        return await getStudentEcoeCompetencies(userId, ecoeId);
    }
    async getAvg(userId: string, ecoeId: number) {
        return await getStudentEcoeAvg(userId, ecoeId);
    }
}