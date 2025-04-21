// GoogleAuthService.ts
import { IAuthService } from '../../application/auth/IAuthService';
import { AuthResponse } from '../../domain/auth/AuthEntity';
import { UserRole } from '../../domain/user/UserRole';
import { TeacherType } from '../../domain/user/TeacherType';
import axios from 'axios';

// Si no hay backend todavía
export class GoogleAuthService implements IAuthService {
  async loginWithGoogle(userType: UserRole, teacherType?: TeacherType, token?: string): Promise<AuthResponse> {
    console.log('Token recibido desde Google:', token);

    // Simulación (Hasta que tengamos el backend con los endpoints necesarios)
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      success: true,
      user: {
        name: 'Usuario de Prueba',
        institutionalEmail: userType === UserRole.ESTUDIANTE 
          ? 'estudiante@alumnos.ucn.cl'
          : 'docente@ucn.cl',
        role: userType,
        teacherType: teacherType
      }
    };
  }
  /*
  async loginWithGoogle(userType: UserRole, teacherType?: TeacherType, token?: string): Promise<AuthResponse> {
    try {
      // Verificamos que el token haya sido recibido
      if (!token) throw new Error('Token de Google no proporcionado');

      // Llamamos al backend con los datos necesarios para autenticar al usuario
      const response = await axios.post('http://localhost:3000/api/auth/google-login', {
        token,          // Token JWT que entrega Google
        userType,       // Rol del usuario (ESTUDIANTE o DOCENTE)
        teacherType     // Tipo de docente, si aplica
      });

      // El backend debe devolver un objeto con la estructura: { success, user, error }
      return response.data as AuthResponse;
    } catch (error) {
      console.error('Error en loginWithGoogle:', error);

      // Devolvemos una respuesta de error con formato compatible
      return {
        success: false,
        error: 'Error durante la autenticación con el servidor'
      };
    }
  }
  */

  async logout(): Promise<void> {
    return Promise.resolve();
  }

  async getCurrentUser(): Promise<AuthResponse | null> {
    return null;
  }
}

