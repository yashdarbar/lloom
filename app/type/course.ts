// import { Attachment } from "@prisma/client";
//import { Chapter, Course, MuxData } from "@/src/generated/client";
import { Attachment, Category } from "@prisma/client";
import { Chapter, Course, MuxData } from "@prisma/client";

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

export interface CategoryData extends Partial<Category> {
    id: string;
    name: string;
}