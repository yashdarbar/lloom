"use server";

//import { db } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import Mux from "@mux/mux-node";
import { auth } from "@clerk/nextjs/server";
import { Chapter } from "@/prisma/src/app/generated/client";
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

        const courseOwner = prisma.course.findUnique({
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

        const lastChapter = (await prisma.chapter.findFirst({
            where: {
                courseId: courseId,
            },
            orderBy: {
                position: "desc",
            },
        })) as Chapter | null;

        const newPosition = lastChapter ? lastChapter.position + 1 : 1;

        const chapter = await prisma.chapter.create({
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

        const courseOwner = await prisma.course.findUnique({
            where: {
                id: courseId,
                userId: userId,
            },
        });

        if (!courseOwner) {
            return { error: "Unauthorized" };
        }

        for (let item of list) {
            await prisma.chapter.update({
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

        const getChapter = await prisma.chapter.findUnique({
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

        const updateChapter = await prisma.chapter.update({
            where: {
                id: chapterId,
                courseId: values.courseId,
            },
            data: {
                ...values,
            },
        });

        if (values.videoUrl) {
            const existingMuxData = await prisma.muxData.findFirst({
                where: {
                    chapterId: chapterId,
                },
            });

            if (existingMuxData) {
                await video.assets.delete(existingMuxData.assetId);
                await prisma.muxData.delete({
                    where: {
                        id: existingMuxData.id,
                    },
                });
            }

            const asset = await video.assets.create({
                input: [{ url: values.videoUrl }],
                playback_policy: ["public"],
            });

            await prisma.muxData.create({
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

export async function chapterPublish(chapterId: string, courseId: string) {
    try {
        const { userId } = auth();

        if (!userId || !chapterId) {
            return {
                error: "Unauthorized or missing course",
            };
        }

        const courseOwner = await prisma.course.findUnique({
            where: {
                id: courseId,
                userId: userId,
            },
        });

        if (!courseOwner) {
            return { error: "Unauthorized" };
        }

        const chapter = await prisma.chapter.findUnique({
            where: {
                id: chapterId,
                courseId,
            },
        });

        const muxData = await prisma.muxData.findUnique({
            where: {
                chapterId,
            },
        });

        if (
            !chapter ||
            !muxData ||
            !chapter?.title ||
            !chapter.description ||
            !chapter.videoUrl
        ) {
            return {
                error: "Missing required parameters",
            };
        }

        const publishedChapter = await prisma.chapter.update({
            where: {
                id: chapterId,
                courseId,
            },
            data: {
                isPublished: true,
            },
        });

        return {
            success: publishedChapter,
        };
    } catch (error) {
        console.log("[CHAPTER_PUBLISH]", error);
        return {
            error: "CHAPTER_PUBLISH_ERROR",
        };
    }
}

export async function chapterUnpublish(chapterId: string, courseId: string) {
    try {
        const { userId } = auth();

        if (!userId || !chapterId) {
            return {
                error: "Unauthorized or missing course",
            };
        }

        const courseOwner = await prisma.course.findUnique({
            where: {
                id: courseId,
                userId: userId,
            },
        });

        if (!courseOwner) {
            return { error: "Course not found" };
        }

        const unpublishedChapter = await prisma.chapter.update({
            where: {
                id: chapterId,
                courseId,
            },
            data: {
                isPublished: false,
            },
        });

        const publishedChaptersInCourse = await prisma.chapter.findMany({
            where: {
                courseId,
                isPublished: true,
            },
        });

        if (!publishedChaptersInCourse.length) {
            await prisma.course.update({
                where: {
                    id: courseId,
                },
                data: {
                    isPublished: false,
                },
            });
        }

        return {
            success: unpublishedChapter,
        };
    } catch (error) {
        console.log("[CHAPTER_UNPUBLISH]", error);
        return {
            error: "CHAPTER_UNPUBLISH_ERROR",
        };
    }
}

export async function deleteChapter(chapterId: string, courseId: string) {
    try {
        const { userId } = auth();

        if (!userId || !chapterId) {
            return {
                error: "Unauthorized or missing course",
            };
        }

        const courseOwner = await prisma.course.findUnique({
            where: {
                id: courseId,
                userId: userId,
            },
        });

        if (!courseOwner) {
            return { error: "Course not found" };
        }

        const chapter = await prisma.chapter.findUnique({
            where: {
                id: chapterId,
            },
        });

        if (!chapter) {
            return { error: "Chapter not found" };
        }

        if (chapter.videoUrl) {
            const existingMuxData = await prisma.muxData.findFirst({
                where: {
                    chapterId,
                },
            });

            if (existingMuxData) {
                await video.assets.delete(existingMuxData.assetId);
                await prisma.muxData.delete({
                    where: {
                        id: existingMuxData.id,
                    },
                });
            }
        }

        const deleteChapter = await prisma.chapter.delete({
            where: {
                id: chapterId,
            },
        });

        return {
            success: deleteChapter,
        };
    } catch (error) {
        console.log("[CHAPTER_DELETE]", error);
        return {
            error: "CHAPTER_DELETE_ERROR",
        };
    }
}
