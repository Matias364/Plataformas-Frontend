// Types for Students by Cycle
export interface EcoeInfo {
    id: number;
    year: number;
    semester: number;
}

export interface StudentEcoeResult {
    id: number;
    studentId: string;
    ecoe: EcoeInfo;
    finalGrade: number | null;
    finalArchivementLevel: string;
}

export interface StudentInfo {
    id: string;
    rut: string;
    fullname: string;
    email: string;
}

export interface StudentDisplay {
    rut: string;
    name: string;
    email: string;
    lastEcoe: string;
    averageEcoe: number | null;
    achievementLevel: string;
    studentId: string;
}

export type CycleType = 'BASICO' | 'PROFESIONAL' | 'FINAL';
