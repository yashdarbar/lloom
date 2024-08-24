"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

type CourseProps = {
    title?: string;
    description?: string | null;
    imageUrl?: string | null;
    categoryId?: string | null;
};

export async function createCourse(values: CourseProps) {
    try {
        const { userId } = auth();
        if (!userId || !values.title) {
            return { error: "Unauthorized or missing title" };
        }

        const courseTitle = await db.course.create({
            data: {
                userId,
                title: values.title,
                //description: values.description,
            },
        });
        //console.log("courseTititle" ,courseTitle);
        return {
            success: courseTitle,
        };
    } catch (error) {
        console.log("[CREATE_COURSE]", error);
        return {
            error: "CREATE_COURSE_ERROR",
        };
    }
}

export async function getCourse(courseId: string) {
    try {
        const { userId } = auth();

        if (!userId || !courseId) {
            return {
                error: "Unauthorized or missing course",
            };
        }

        const course = await db.course.findUnique({
            where: {
                userId,
                id: courseId,
            },
        });
        //revalidatePath(`/teacher/courses/${courseId}`);
        return {
            success: course,
        };
    } catch (error) {
        console.log("[GET_COURSE]", error);
        return {
            error: "GET_COURSE_ERROR",
        };
    }
}

export async function updateCourse(courseId: string, values: CourseProps) {
    try {
        const { userId } = auth();

        if (!userId || !courseId) {
            return {
                error: "Unauthorized or missing course",
            };
        }

        const updateCourse = await db.course.update({
            where: {
                id: courseId,
                userId,
            },
            data: {
                title: values.title,
                description: values.description,
                imageUrl: values.imageUrl,
                categoryId: values.categoryId,
            },
        });

        return {
            success: updateCourse,
        };
    } catch (error) {
        console.log("[UPDATE_COURSE]", error);
        return {
            error: "UPDATE_COURSE_ERROR",
        };
    }
}

export async function getCategory() {
    try {
        const category = await db.category.findMany({
            orderBy: {
                name: "asc",
            },
        });
        return {
            success: category,
        };
    } catch (error) {
        console.log("[GET_CATEGORY]", error);
        return {
            error: "GET_CATEGORY_ERROR",
        };
    }
}
