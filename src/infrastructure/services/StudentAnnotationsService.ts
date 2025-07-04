import axios from 'axios';
import { StudentAnnotation, Teacher, AnnotationDisplay } from '../../domain/student/StudentAnnotations';

const STUDENT_API_URL = 'http://localhost:3001/api/v1';
const AUTH_API_URL = 'http://127.0.0.1:3000/api/v1';

export class StudentAnnotationsService {
    /**
     * Obtiene las anotaciones de un estudiante
     */
    static async getStudentAnnotations(studentId: string): Promise<StudentAnnotation[]> {
        try {
            const response = await axios.get<StudentAnnotation[]>(`${STUDENT_API_URL}/students/${studentId}/annotations`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener anotaciones del estudiante ${studentId}:`, error);
            throw new Error(`No se pudieron obtener las anotaciones del estudiante`);
        }
    }

    /**
     * Obtiene información de un profesor por su ID
     */
    static async getTeacherInfo(teacherId: string): Promise<Teacher> {
        try {
            const response = await axios.get<Teacher>(`${AUTH_API_URL}/auth/users/${teacherId}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener información del profesor ${teacherId}:`, error);
            throw new Error(`No se pudo obtener la información del profesor`);
        }
    }

    /**
     * Obtiene las anotaciones formateadas para mostrar en el modal
     */
    static async getAnnotationsForDisplay(studentId: string): Promise<AnnotationDisplay[]> {
        try {
            // Obtener anotaciones del estudiante
            const annotations = await this.getStudentAnnotations(studentId);
            
            // Obtener información de los profesores
            const annotationsDisplay: AnnotationDisplay[] = await Promise.all(
                annotations.map(async (annotation) => {
                    try {
                        const teacherInfo = await this.getTeacherInfo(annotation.course.teacherUserId);
                        
                        return {
                            id: annotation.id,
                            subjectName: annotation.course.subject.name,
                            comment: annotation.comment,
                            createdAt: annotation.createdAt,
                            teacherName: teacherInfo.fullname
                        };
                    } catch (error) {
                        console.warn(`Error obteniendo info del profesor ${annotation.course.teacherUserId}:`, error);
                        // Fallback con información básica
                        return {
                            id: annotation.id,
                            subjectName: annotation.course.subject.name,
                            comment: annotation.comment,
                            createdAt: annotation.createdAt,
                            teacherName: 'Profesor no disponible'
                        };
                    }
                })
            );

            return annotationsDisplay;
        } catch (error) {
            console.error(`Error al obtener anotaciones para mostrar del estudiante ${studentId}:`, error);
            throw error;
        }
    }

    /**
     * Formatea la fecha para mostrar
     */
    static formatDate(dateString: string): string {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-CL', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return dateString;
        }
    }
}
