"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

type createCourseProps = {
    title: string | null;
}

export async function createCourse({ title }: createCourseProps) {
    try {
        const { userId } = auth();
        if (!userId || !title) {
            return;
        }

        const courseTitle = await db.course.create({
            data: {
                userId,
                title,
            },
        });
        console.log("courseTititle" ,courseTitle);
        return {
            success: courseTitle
        };

    } catch (error) {
        console.log("[CREATE_COURSE]", error);
        return {
            error: "CREATE_COURSE_ERROR"
        };
    }
}