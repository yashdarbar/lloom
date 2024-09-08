import { db } from "@/lib/db";
import { Attachment, Chapter } from "@prisma/client";


interface GetChapterProps {
    userId: string;
    courseId: string;
    chapterId: string;
}

export const GetChapter = async ({
    userId,
    chapterId,
    courseId,
}: GetChapterProps) => {
    try {
        const purchase = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                }
            }
        });

        const course = await db.course.findUnique({
            where: {
                id: courseId,
                isPublished: true
            },
            select: {
                price: true,
            }
        });

        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                isPublished: true
            }
        });

        if (!chapter || !course) {
            throw new Error("Chapter or course not found")
        }

        let muxData = null;
        let attachments: Attachment[] = [];
        let nextChapter : Chapter | null = null;

        if (purchase) {
            attachments = await db.attachment.findMany({
                where: {
                    courseId: courseId,
                }
            });
        }

        if (chapter.isFree || purchase) {
            muxData = await db.muxData.findUnique({
                where: {
                    chapterId: chapterId,
                }
            });

            nextChapter = await db.chapter.findFirst({
                where: {
                    courseId: courseId,
                    isPublished: true,
                    position: {
                        gt: chapter?.position
                    },
                },
                orderBy: {
                    position: "asc"
                }
            });
        }

        const userProgress = await db.userProgress.findUnique({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId,
                }
            }
        });

        muxData = await db.muxData.findFirst({
            where: {
                chapterId: chapterId,

            }
        });

        return {
            chapter,
            course,
            muxData,
            userProgress,
            purchase,
            nextChapter,
            attachments,
        };

    } catch (error) {
        console.log("[GET_CHAPETR]", error);
        return {
            chapter: null,
            attachments: [],
            muxData: null,
            course: null,
            nextChapter: null,
            userProgress: null,
            purchase: null,
        };
    }
};
