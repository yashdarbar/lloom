import { Course } from "@prisma/client";

export interface CourseData extends Partial<Course> {
    id?: string;
}
