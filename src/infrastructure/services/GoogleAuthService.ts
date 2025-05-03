import { IAuthService } from '../../application/auth/IAuthService';
import { AuthResponse } from '../../domain/auth/AuthEntity';
import axios from 'axios';

export class GoogleAuthService implements IAuthService {
  async loginWithGoogle(token?: string): Promise<AuthResponse> {
    try {
      if (!token) throw new Error('Token de Google no proporcionado');

      // Hacemos el llamado al backend solo con el token para que el backend lo valide
      const response = await axios.post('http://localhost:3000/api/v1/login', {
        token,  // Solo enviamos el token
      });

      // Devolvemos la respuesta desde el backend
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
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('expires_at');
    return Promise.resolve();
  }

  async getCurrentUser(): Promise<AuthResponse | null> {
    // Recuperamos los datos del usuario desde localStorage
    const user = JSON.parse(localStorage.getItem('user_data') || 'null');
    return user ? { success: true, user } : null;
  }
}
