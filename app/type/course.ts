import { Attachment } from "@/prisma/src/app/generated/client";
import { Chapter, Course, MuxData } from "@/prisma/src/app/generated/client";

export interface CourseData extends Partial<Course> {
    id?: string;
}

export interface AttachmentData extends Partial<Attachment> {
    id?: string;
}

export interface ChapterData extends Partial<Chapter> {
    id?: string;
}

export interface MuxDataType extends Partial<MuxData> {
    id: string;
    assetId: string;
    playbackId: string | null;
    chapterId: string;
}