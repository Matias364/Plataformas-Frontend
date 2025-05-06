//Entidades e interfaces de autenticación
//La idea es usar una interfaz AuthCredentials para definir las credenciales (token, userType, teachertype de ser necesario)
// y una interfaz de AuthResponse para definir la respuesta (booleano, usuario y error)
//Esto permite que la implementación de la autenticación sea independiente del tipo de autenticación (Google, Facebook, etc.)
//Esto es útil para poder cambiar la implementación de la autenticación sin afectar el resto del código
import { UserRole } from '../user/UserRole';

export interface AuthCredentials {
  token: string;
  userType: UserRole;
}

export interface AuthResponse {
  success: boolean;
  accessToken?: string;
  //refreshToken?: string;
  error?: string;
}