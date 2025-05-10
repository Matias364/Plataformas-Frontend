//Caso de uso de autenticación
//metodos loginWithGoogle, logout y getCurrentUser
import { IAuthService } from './IAuthService';

import { UserRole } from '../../domain/user/UserRole';

import { UserPayloadDto } from '../../domain/user/UserPayloadDto';


export class AuthUseCase {
  constructor(private authService: IAuthService) {}

  async loginWithGoogle(userType: UserRole, code?: string): Promise<void> {
    return await this.authService.loginWithGoogle(userType, code);
  }

  async logout(): Promise<void> {
    return await this.authService.logout();
  }

  async getCurrentUser(): Promise<UserPayloadDto | null> {
    return await this.authService.getCurrentUser();
  }
}