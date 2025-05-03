//Interfaz para el servicio de autenticación
//se definen los contratos de loginWithGoogle, logout y getCurrentUser
import { AuthResponse } from '../../domain/auth/AuthEntity';
import { UserRole } from '../../domain/user/UserRole';
import { TeacherType } from '../../domain/user/TeacherType';

export interface IAuthService {
  loginWithGoogle(token?: string): Promise<AuthResponse>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<AuthResponse | null>;
}