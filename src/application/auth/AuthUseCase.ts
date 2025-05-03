//Caso de uso de autenticación
//metodos loginWithGoogle, logout y getCurrentUser
import { IAuthService } from './IAuthService';
import { AuthResponse } from '../../domain/auth/AuthEntity';
import { UserRole } from '../../domain/user/UserRole';
import { TeacherType } from '../../domain/user/TeacherType';

export class AuthUseCase {
  constructor(private authService: IAuthService) {}

  async loginWithGoogle(token?: string): Promise<AuthResponse> {
    return await this.authService.loginWithGoogle(token);
  }

  async logout(): Promise<void> {
    return await this.authService.logout();
  }

  async getCurrentUser(): Promise<AuthResponse | null> {
    return await this.authService.getCurrentUser();
  }
}