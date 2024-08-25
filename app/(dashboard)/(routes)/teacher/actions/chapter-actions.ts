"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Chapter } from "@prisma/client";

//type ChapterProps = Chapter

export async function createChapter(courseId: string ,values: Partial<Chapter>) {
    try {
        const { userId } = auth();
        if (!userId || !courseId || !values.title) {
            return {
                error: "Unauthorized or Coure is not found",
            };
        }

        const courseOwner = db.course.findUnique({
            where: {
                id: courseId,
                userId: userId,
            },
        });

        if (!courseOwner) {
            return {
                error: "Unauthorized Course",
            };
        }

        const lastChapter = (await db.chapter.findFirst({
            where: {
                courseId: courseId,
            },
            orderBy: {
                position: "desc",
            },
        })) as Chapter | null;

        const newPosition = lastChapter ? lastChapter.position + 1 : 1;

        const chapter = await db.chapter.create({
            data: {
                title: values.title,
                courseId: courseId,
                position: newPosition,
            },
        });

        return {
            success: chapter,
        };
    } catch (error) {
        console.log("[CREATE_CHAPTER]", error);
        return {
            error: "CREATE_CHAPTER_ERROR",
        };
    }
}
