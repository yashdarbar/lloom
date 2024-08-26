import { Chapter, Course } from "@prisma/client";

export interface CourseData extends Partial<Course> {
    id?: string;
}

export interface ChapterData extends Partial<Chapter> {
    id?: string;
}
