import { ICourseService } from '../../application/course/ICourseService';
import { Course } from '../../domain/course/Course';
import { readFromStorage } from '../../storage/storage';
import axios from 'axios';

export class CourseService implements ICourseService {
  private readonly baseUrl = 'http://localhost:3001/api/v1';

  async getSubjectTeacher(): Promise<Course[]> {
    try {
      const accessToken = readFromStorage('access_token');
      console.log('Access Token:', accessToken);
      
      if (!accessToken) {
        throw new Error('No access token found');
      }

      // Cambiar endpoint a subjects-teacher
      const response = await axios.get(`${this.baseUrl}/courses/subjects-teacher`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Response Data:', response.data);
      if (response.status === 200) {
        return response.data || [];
      } else {
        throw new Error('Failed to fetch teacher courses');
      }
    } catch (error) {
      console.error('Error fetching teacher courses:', error);
      throw error;
    }
  }

  // New method for /courses/teacher
  async getTeacherCourses(): Promise<Course[]> {
    try {
      const accessToken = readFromStorage('access_token');
      if (!accessToken) {
        throw new Error('No access token found');
      }
      const response = await axios.get(`${this.baseUrl}/courses/teacher`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.status === 200) {
        // Map id to courseId (id is the root id)
        return (response.data || []).map((item: Course) => ({
          id: item.id, 
          semester: item.semester,
          year: item.year,
          subject: {
            id: item.subject.id,
            name: item.subject.name
          },
        }));
      } else {
        throw new Error('Failed to fetch teacher courses');
      }
    } catch (error) {
      console.error('Error fetching teacher courses:', error);
      throw error;
    }
  }

  async getSubjectCompetencies(subjectId: string): Promise<any[]> {
    try {
      const accessToken = readFromStorage('access_token');
      if (!accessToken) {
        throw new Error('No access token found');
      }
      const response = await axios.get(`${this.baseUrl}/subjects/${subjectId}/competencies`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.status === 200) {
        return response.data || [];
      } else {
        throw new Error('Failed to fetch subject competencies');
      }
    } catch (error) {
      console.error('Error fetching subject competencies:', error);
      throw error;
    }
  }
}
