import { Chapter, Course, MuxData } from "@prisma/client";

export interface CourseData extends Partial<Course> {
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