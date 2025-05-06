export interface TokenPayloadDto {
    sub: string;
    email: string;
    role: string; // "estudiante", "docente_ecoe", etc.
  }