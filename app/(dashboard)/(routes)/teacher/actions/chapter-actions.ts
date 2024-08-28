"use server";

import { db } from "@/lib/db";
import Mux from "@mux/mux-node";
import { auth } from "@clerk/nextjs/server";
import { Chapter } from "@prisma/client";
import { revalidatePath } from "next/cache";

//type ChapterProps = Chapter
interface ReorderChaptersInput {
    courseId: string;
    list: { id: string; position: number }[];
}

const { video } = new Mux({
    // tokenId: process.env.MUX_TOKEN_ID as string,
    // tokenSecret: process.env.MUX_TOKEN_SECRET as string,
    tokenId: "f1e4c75e-74eb-45d5-87d3-1019c9580a23", //process.env.MUX_TOKEN_ID as string,
    tokenSecret:
        "jaz3JnDGoaAaSz78iiW2N9l2u4ms2xpqu+I//WsDePBCajyU3MSL435anXRgfg9diZy2c2WQgIr", //process.env.MUX_TOKEN_SECRET as string,
});

//console.log("mmxx", video);

export async function createChapter(
    courseId: string,
    values: Partial<Chapter>
) {
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

export async function reorderChapters({
    courseId,
    list,
}: ReorderChaptersInput) {
    try {
        const { userId } = auth();
        if (!userId) {
            return { error: "Unauthorized" };
        }

        const courseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId: userId,
            },
        });

        if (!courseOwner) {
            return { error: "Unauthorized" };
        }

        for (let item of list) {
            await db.chapter.update({
                where: {
                    id: item.id,
                },
                data: { position: item.position },
            });
        }

        revalidatePath(`/courses/${courseId}`);
        return { success: true };
    } catch (error) {
        console.log("[CHAPTER_REORDER]", error);
        return { error: "Something went wrong" };
    }
}

export async function getChapter(courseId: string, chapterId: string) {
    try {
        const { userId } = auth();

        if (!userId || !courseId || !chapterId) {
            return {
                error: "Unauthorized or missing chapter",
            };
        }
        //console.log("cid",courseId, userId, chapterId);

        const getChapter = await db.chapter.findUnique({
            where: {
                courseId: courseId,
                id: chapterId,
            },
            include: {
                muxData: true,
            },
        });
        //revalidatePath(`/teacher/courses/${courseId}`);
        //console.log("bruhh",getChapter);
        return {
            success: getChapter,
        };
    } catch (error) {
        console.log("[GET_CHAPTER]", error);
        return {
            error: "GET_CHAPTER_ERROR",
        };
    }
}

export async function updateChapter(
    chapterId: string,
    values: Partial<Chapter>
) {
    try {
        const { userId } = auth();

        if (!userId || !chapterId) {
            return {
                error: "Unauthorized or missing course",
            };
        }

        const updateChapter = await db.chapter.update({
            where: {
                id: chapterId,
                courseId: values.courseId,
            },
            data: {
                ...values,
            },
        });

        if (values.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: chapterId,
                },
            });

            if (existingMuxData) {
                await video.assets.delete(existingMuxData.assetId);
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id,
                    },
                });
            }

            const asset = await video.assets.create({
                input: [{ url: values.videoUrl }],
                playback_policy: ["public"],
            });

            await db.muxData.create({
                data: {
                    assetId: asset.id,
                    chapterId: chapterId,
                    playbackId: asset.playback_ids?.[0]?.id,
                },
            });
        }
        return {
            success: updateChapter,
        };
    } catch (error) {
        console.log("[UPDATE_CHAPTER]", error);
        return {
            error: "UPDATE_CHAPTER_ERROR",
        };
    }
}
