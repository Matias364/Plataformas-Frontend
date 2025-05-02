//Entidades e interfaces de autenticación
//La idea es usar una interfaz AuthCredentials para definir las credenciales (token, userType, teachertype de ser necesario)
// y una interfaz de AuthResponse para definir la respuesta (booleano, usuario y error)
//Esto permite que la implementación de la autenticación sea independiente del tipo de autenticación (Google, Facebook, etc.)
//Esto es útil para poder cambiar la implementación de la autenticación sin afectar el resto del código
import { UserRole } from '../user/UserRole';
import { TeacherType } from '../user/TeacherType';

export interface AuthCredentials {
  token: string;
  userType: UserRole;
  teacherType?: TeacherType;
}

export interface AuthResponse {
  success: boolean;
  user?: {
    name: string;               // Nombre del usuario
    institutionalEmail: string; // Email institucional (verificado por el dominio)
    role: UserRole;             // Rol del usuario (Estudiante o Docente)
    teacherType?: TeacherType;  // Tipo de docente (si es aplicable)
    emailVerified: boolean;     // Si el correo está verificado
    hd: string;                 // Dominio del correo (ej. "ucn.cl")
    picture: string;            // Foto de perfil del usuario
  };
  error?: string;
}