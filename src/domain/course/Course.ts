export interface Course {
  id: string;
  subject: {
    id: string;
    name: string;
  };
  year: number;
  semester: number;
  teacherId: string;
  

}
