"use server";

import { db } from "@/lib/db";

export const getProgress = async (
    userId: string,
    courseId: string
): Promise<number> => {
    try {
        const publishedChapters = await db.chapter.findMany({
            where: {
                courseId: courseId,
                isPublished: true,
            },
            select: {
                id: true,
            },
        });

        const publishedChaptersIds = publishedChapters.map(
            (chapter) => chapter.id
        );

        const validCompleteChapters = await db.userProgress.count({
            where: {
                userId: userId,
                isCompleted: true,
                chapterId: {
                    in: publishedChaptersIds,
                },
            },
        });

        const progressPercentage =
            (validCompleteChapters / publishedChapters.length) * 100;

        return progressPercentage;
    } catch (error) {
        console.log("[GET_PROGRESS]", error);
        return 0;
    }
};
