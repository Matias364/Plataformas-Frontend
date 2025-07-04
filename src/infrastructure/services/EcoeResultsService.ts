import { EcoeStudentResult, StudentInfo, EcoeResultWithStudentInfo } from '../../domain/ecoe/EcoeResult';

export interface EcoeOption {
  id: number;
  name: string;
  cycle: string;
  semester: number;
  year: number;
}

export class EcoeResultsService {
  private static readonly ECOE_BASE_URL = 'http://localhost:3002/api/v1';
  private static readonly STUDENT_BASE_URL = 'http://localhost:3001/api/v1';

  static async getEcoes(): Promise<EcoeOption[]> {
    try {
      const response = await fetch(`${this.ECOE_BASE_URL}/ecoes`);
      if (!response.ok) {
        throw new Error('Error fetching ECOEs');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching ECOEs:', error);
      throw error;
    }
  }

  static async getEcoeStudents(ecoeId: number): Promise<EcoeStudentResult[]> {
    try {
      const response = await fetch(`${this.ECOE_BASE_URL}/ecoes/${ecoeId}/students`);
      if (!response.ok) {
        throw new Error('Error fetching ECOE students');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching ECOE students:', error);
      throw error;
    }
  }

  static async getStudentInfo(studentId: string): Promise<StudentInfo> {
    try {
      const response = await fetch(`${this.STUDENT_BASE_URL}/students/${studentId}`);
      if (!response.ok) {
        throw new Error('Error fetching student info');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching student info:', error);
      throw error;
    }
  }

  static async getEcoeResultsWithStudentInfo(ecoeId: number): Promise<EcoeResultWithStudentInfo[]> {
    try {
      const ecoeStudents = await this.getEcoeStudents(ecoeId);
      
      const studentsWithInfo = await Promise.all(
        ecoeStudents.map(async (student) => {
          try {
            const studentInfo = await this.getStudentInfo(student.studentId);
            // Handle null values for finalGrade and finalAchievementLevel
            const processedStudent = {
              ...student,
              rut: studentInfo.rut || 'N/A',
              fullname: studentInfo.fullname || 'N/A',
              email: studentInfo.email || 'N/A',
              id: studentInfo.id || student.studentId,
              finalGrade: student.finalGrade ?? 0,
              finalAchievementLevel: student.finalAchievementLevel ?? 'N/A'
            };
            return processedStudent;
          } catch (error) {
            console.error(`Error fetching info for student ${student.studentId}:`, error);
            // Return student with default info if fetch fails
            return {
              ...student,
              rut: 'N/A',
              fullname: 'N/A',
              email: 'N/A',
              id: student.studentId,
              finalGrade: student.finalGrade ?? 0,
              finalAchievementLevel: student.finalAchievementLevel ?? 'N/A'
            };
          }
        })
      );

      return studentsWithInfo;
    } catch (error) {
      console.error('Error getting ECOE results with student info:', error);
      throw error;
    }
  }
}
