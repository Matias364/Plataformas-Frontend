import { Course } from '../../domain/course/Course';
import { Subject } from '../../domain/course/Subject';

export interface ICourseService {
  getSubjectTeacher(): Promise<Subject[]>;
  getTeacherCourses(): Promise<Course[]>; // New method for /courses/teacher
}
