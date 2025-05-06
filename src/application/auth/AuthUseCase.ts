//Caso de uso de autenticación
//metodos loginWithGoogle, logout y getCurrentUser
import { IAuthService } from './IAuthService';
import { AuthResponse } from '../../domain/auth/AuthEntity';
import { UserRole } from '../../domain/user/UserRole';
import { TokenPayloadDto } from '../../domain/auth/TokenPayloadDTO';


export class AuthUseCase {
  constructor(private authService: IAuthService) {}

  async loginWithGoogle(userType: UserRole, code?: string): Promise<AuthResponse> {
    return await this.authService.loginWithGoogle(userType, code);
  }

  async logout(): Promise<void> {
    return await this.authService.logout();
  }

  async getCurrentUser(): Promise<TokenPayloadDto | null> {
    return await this.authService.getCurrentUser();
  }
}