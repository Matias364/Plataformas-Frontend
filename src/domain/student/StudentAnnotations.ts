// Types for Student Annotations
export interface Subject {
    id: number;
    code: string;
    name: string;
    semester: number;
}

export interface Course {
    id: string;
    year: number;
    semester: number;
    teacherUserId: string;
    subject: Subject;
}

export interface StudentAnnotation {
    id: string;
    comment: string;
    createdAt: string;
    course: Course;
}

export interface Teacher {
    id: string;
    fullname: string;
    email: string;
}

export interface AnnotationDisplay {
    id: string;
    subjectName: string;
    comment: string;
    createdAt: string;
    teacherName: string;
}
