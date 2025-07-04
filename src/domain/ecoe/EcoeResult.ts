export interface CompetencyEvaluated {
  id: number;
  competencyId: number;
  competencyName: string;
  grade: number;
  achievementLevel: string;
}

export interface EcoeStudentResult {
  id: string;
  studentId: string;
  ecoeId: number;
  competenciesEvaluated: CompetencyEvaluated[];
  finalGrade: number | null;
  finalAchievementLevel: string | null;
}

export interface StudentInfo {
  id: string;
  rut: string;
  fullname: string;
  email: string;
}

export interface EcoeResultWithStudentInfo extends EcoeStudentResult {
  rut: string;
  fullname: string;
  email: string;
}
