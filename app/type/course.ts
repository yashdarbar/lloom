import { Attachment } from "@/prisma/src/app/generated/client";
import { Chapter, Course, MuxData } from "@/prisma/src/app/generated/client";

export interface CourseData extends Partial<Course> {
    id: string;
    userId: string;
    title: string;
    description: string | null;
    imageUrl: string | null;
    price: number | null;
    isPublished: boolean | null;
    categoryId: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface AttachmentData extends Partial<Attachment> {
    id: string;
    name: string;
    url: string;
    courseId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ChapterData extends Partial<Chapter> {
    id: string;
    title: string;
    description: string | null;
    videoUrl: string | null;
    position: number;
    isPublished: boolean;
    isFree: boolean;
    courseId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface MuxDataType extends Partial<MuxData> {
    id: string;
    assetId: string;
    playbackId: string | null;
    chapterId: string;
}