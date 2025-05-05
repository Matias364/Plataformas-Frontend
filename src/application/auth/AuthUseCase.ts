//Caso de uso de autenticación
//metodos loginWithGoogle, logout y getCurrentUser
import { IAuthService } from './IAuthService';
import { AuthResponse } from '../../domain/auth/AuthEntity';
import { UserRole } from '../../domain/user/UserRole';


export class AuthUseCase {
  constructor(private authService: IAuthService) {}

  async loginWithGoogle(userType: UserRole, code?: string): Promise<AuthResponse> {
    return await this.authService.loginWithGoogle(userType, code);
  }

  async logout(): Promise<void> {
    return await this.authService.logout();
  }

  async getCurrentUser(): Promise<AuthResponse | null> {
    return await this.authService.getCurrentUser();
  }
}