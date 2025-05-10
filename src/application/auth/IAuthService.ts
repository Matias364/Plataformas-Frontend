//Interfaz para el servicio de autenticación
//se definen los contratos de loginWithGoogle, logout y getCurrentUser
//import { AuthResponse } from '../../domain/auth/AuthEntity';

import { UserPayloadDto } from '../../domain/user/UserPayloadDto';
import { UserRole } from '../../domain/user/UserRole';


export interface IAuthService {
  loginWithGoogle(userType: UserRole, code?: string): Promise<void>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<UserPayloadDto | null>;
}