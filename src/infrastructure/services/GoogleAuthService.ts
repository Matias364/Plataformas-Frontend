import { IAuthService } from '../../application/auth/IAuthService';
import { AuthResponse } from '../../domain/auth/AuthEntity';
import { UserRole } from '../../domain/user/UserRole';
//import {jwtDecode} from 'jwt-decode';


import axios from 'axios';
import { saveUserData, clearUserData, readFromStorage } from '../../storage/storage';  
import { LOGIN_URL, USER_INFO_URL, VALIDATE_TOKEN_URL } from '../../constants';
import { TokenPayloadDto } from '../../domain/auth/TokenPayloadDTO';

export class GoogleAuthService implements IAuthService {
  async loginWithGoogle(userType: UserRole, code?: string): Promise<void> {
    try {
      if (!code) throw new Error('Código de Google no proporcionado');
      console.log(LOGIN_URL);
      // Hacemos el llamado al backend con los datos necesarios para autenticar al usuario
      const response = await axios.post(LOGIN_URL, {
        code,          // Token JWT que entrega Google
        userType,       // Rol del usuario (ESTUDIANTE o DOCENTE)
        
      });
      console.log("Respuesta completa del backend:", response);
      // Aquí, si la respuesta es exitosa, guardamos los tokens y los datos del usuario en localStorage
      if (response.status === 200) {
        //const { accessToken, refreshToken, user, expiresIn } = response.data; // Suponiendo que el backend te devuelve estos valores
        const { accessToken} = response.data;

        console.log("Acceso exitoso con token: ", accessToken);
        saveUserData("",accessToken,"",10); 
        // Guardamos el accessToken en localStorage
        // Suponiendo que el backend te devuelve estos valores
        // Guardamos en localStorage usando las funciones de storage
        //saveUserData(user, accessToken, refreshToken, expiresIn);
        

        
      }

      // Si no es exitoso, devuelve el error
      
    } catch (error) {
      console.error('Error en loginWithGoogle:', error);

      // Devolvemos una respuesta de error con formato compatible
      
    }
  }

  async logout(): Promise<void> {
    // Limpiamos los datos del usuario y tokens al hacer logout
    clearUserData();
    return Promise.resolve();
  }

  async getCurrentUser(): Promise<TokenPayloadDto | null> {
    const accessToken = readFromStorage('access_token');
    if (!accessToken) {
      return null; // Si no hay token, devolvemos null
    } 
    const userInfo = await fetch(USER_INFO_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    const data = await userInfo.json();
    console.log("Respuesta del backend:", data);
    const tokenPayload: TokenPayloadDto = {
      sub: data.payload.sub,
      email: data.payload.email,
      role: data.payload.role, 
  }
  return tokenPayload;
  }
}
