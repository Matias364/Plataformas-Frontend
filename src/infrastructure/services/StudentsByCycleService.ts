import axios from 'axios';
import { StudentEcoeResult, StudentInfo, StudentDisplay, CycleType } from '../../domain/student/StudentTypes';

const ECOE_API_URL = 'http://localhost:3002/api/v1';
const STUDENT_API_URL = 'http://localhost:3001/api/v1';

export class StudentsByCycleService {
    /**
     * Obtiene los estudiantes del último ECOE por ciclo
     */
    static async getStudentsLastByCycle(cycle: CycleType): Promise<StudentEcoeResult[]> {
        try {
            const response = await axios.get<StudentEcoeResult[]>(`${ECOE_API_URL}/ecoes/students-last-by-cycle/${cycle}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener estudiantes del ciclo ${cycle}:`, error);
            throw new Error(`No se pudieron obtener los estudiantes del ciclo ${cycle}`);
        }
    }

    /**
     * Obtiene información de un estudiante por su ID
     */
    static async getStudentInfo(studentId: string): Promise<StudentInfo> {
        try {
            const response = await axios.get<StudentInfo>(`${STUDENT_API_URL}/students/${studentId}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener información del estudiante ${studentId}:`, error);
            throw new Error(`No se pudo obtener la información del estudiante ${studentId}`);
        }
    }

    /**
     * Obtiene la lista completa de estudiantes para mostrar en la tabla
     */
    static async getStudentsForDisplay(cycle: CycleType): Promise<StudentDisplay[]> {
        try {
            // Obtener estudiantes del último ECOE por ciclo
            const studentResults = await this.getStudentsLastByCycle(cycle);
            
            // Obtener información detallada de cada estudiante
            const studentsDisplay: StudentDisplay[] = await Promise.all(
                studentResults.map(async (result) => {
                    try {
                        const studentInfo = await this.getStudentInfo(result.studentId);
                        
                        return {
                            rut: studentInfo.rut,
                            name: studentInfo.fullname,
                            email: studentInfo.email,
                            lastEcoe: `${result.ecoe.year}-${result.ecoe.semester}`,
                            averageEcoe: result.finalGrade,
                            achievementLevel: result.finalGrade !== null ? result.finalArchivementLevel : 'N/A',
                            studentId: result.studentId
                        };
                    } catch (error) {
                        console.warn(`Error obteniendo info del estudiante ${result.studentId}:`, error);
                        // Fallback con información básica
                        return {
                            rut: result.studentId,
                            name: 'Información no disponible',
                            email: 'No disponible',
                            lastEcoe: `${result.ecoe.year}-${result.ecoe.semester}`,
                            averageEcoe: result.finalGrade,
                            achievementLevel: result.finalGrade !== null ? result.finalArchivementLevel : 'N/A',
                            studentId: result.studentId
                        };
                    }
                })
            );

            return studentsDisplay;
        } catch (error) {
            console.error(`Error al obtener estudiantes para mostrar del ciclo ${cycle}:`, error);
            throw error;
        }
    }
}
