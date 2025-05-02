import { IAuthService } from '../../application/auth/IAuthService';
import { AuthResponse } from '../../domain/auth/AuthEntity';
import { UserRole } from '../../domain/user/UserRole';
import { TeacherType } from '../../domain/user/TeacherType';
import axios from 'axios';
import { saveUserData, clearUserData } from '../../storage/storage';  

export class GoogleAuthService implements IAuthService {
  async loginWithGoogle(userType: UserRole, teacherType?: TeacherType, token?: string): Promise<AuthResponse> {
    try {
      if (!token) throw new Error('Token de Google no proporcionado');

      // Hacemos el llamado al backend con los datos necesarios para autenticar al usuario
      const response = await axios.post('http://localhost:3000/api/v1/login', {
        token,          // Token JWT que entrega Google
        userType,       // Rol del usuario (ESTUDIANTE o DOCENTE)
        teacherType     // Tipo de docente, si aplica
      });

      // Aquí, si la respuesta es exitosa, guardamos los tokens y los datos del usuario en localStorage
      if (response.data.success) {
        const { accessToken, refreshToken, user, expiresIn } = response.data; // Suponiendo que el backend te devuelve estos valores

        // Guardamos en localStorage usando las funciones de storage
        saveUserData(user, accessToken, refreshToken, expiresIn);

        return {
          success: true,
          user: user,  
        };
      }

      // Si no es exitoso, devuelve el error
      return response.data;
    } catch (error) {
      console.error('Error en loginWithGoogle:', error);

      // Devolvemos una respuesta de error con formato compatible
      return {
        success: false,
        error: 'Error durante la autenticación con el servidor',
      };
    }
  }

  async logout(): Promise<void> {
    // Limpiamos los datos del usuario y tokens al hacer logout
    clearUserData();
    return Promise.resolve();
  }

  async getCurrentUser(): Promise<AuthResponse | null> {
    // Recuperamos los datos del usuario desde localStorage
    const user = JSON.parse(localStorage.getItem('user_data') || 'null');
    return user ? { success: true, user } : null;
  }
}
