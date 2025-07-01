import { Course } from '../../domain/course/Course';

export interface ICourseService {
  getSubjectTeacher(): Promise<Course[]>;
  getTeacherCourses(): Promise<Course[]>; // New method for /courses/teacher
}
