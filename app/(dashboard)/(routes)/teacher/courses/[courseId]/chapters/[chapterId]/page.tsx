import { IconBagde } from "@/components/icon-bagde";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import {
    ArrowLeft,
    Eye,
    LayoutDashboard,
    Video,
} from "lucide-react";
import { redirect } from "next/navigation";


import Link from "next/link";
import { getChapter } from "../../../../actions/chapter-actions";
import { ChapterData, MuxDataType } from "@/app/type/course";
import { ChapterTitleForm } from "../_components/chapter-title-form";
import ChapterDescriptionForm from "../_components/chapter-description-form";
import ChapterAccessForm from "../_components/chapter-access-form";
import ChapterVideoForm from "../_components/video-form";
import ChapterActions from "../_components/chapter-actions";
import Banner from "@/components/banner";


const ChapterId = async ({
    params,
}: {
    params: { courseId: string; chapterId: string };
}) => {
    const { userId } = auth();
    if (!userId) {
        return redirect("/");
    }

    // const chapterResult = await getChapter(params.courseId, params.chapterId);
    // if (!chapterResult || chapterResult.error) {
    //     return <div>Course not found</div>;
    // }

    // const chapter: ChapterData = chapterResult.success || {};

    // if (!chapter) {
    //     return redirect("/");
    // }
    const chapterResult = await getChapter(params.courseId, params.chapterId);
    if (!chapterResult || chapterResult.error || !chapterResult.success) {
        return <div>Chapter not found</div>;
    }

    const chapterData = chapterResult.success;

    // Ensure all required properties are present
    if (!chapterData.id || !chapterData.title || !chapterData.courseId) {
        return <div>Invalid chapter data</div>;
    }

    const chapter = {
        id: chapterData.id,
        title: chapterData.title,
        description: chapterData.description || null,
        videoUrl: chapterData.videoUrl || null,
        position: chapterData.position,
        isPublished: chapterData.isPublished || false,
        isFree: chapterData.isFree || false,
        courseId: chapterData.courseId,
        createdAt: chapterData.createdAt || new Date(),
        updatedAt: chapterData.updatedAt || new Date(),
        muxData: chapterData.muxData || null,
    };

    //const muxData: MuxDataType | null = chapterResult.success.muxData || null;

    const requiredFields = [
        chapter.title,
        chapter.description,
        chapter.videoUrl,
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `${completedFields}/${totalFields}`;

    const isCompleteFields = requiredFields.every(Boolean);

    return (
        <>
            {!chapter.isPublished && (
                <div className="">
                    <Banner
                        variant="warning"
                        label="This chapter is unpublished. It will not be visible in the course"
                    />
                </div>
            )}
            <div className="p-6 ">
                <div className="flex justify-between items-center">
                    <div className="w-full">
                        <Link
                            href={`/teacher/courses/${params.courseId}`}
                            className="flex items-center text-base hover:opacity-75 transition mb-6"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to the course
                        </Link>
                        <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col gap-y-2">
                                <h1 className="text-2xl font-medium">
                                    Chapter setup
                                </h1>
                                <span className="text-sm text-slate-700 dark:text-slate-300">
                                    Complete all fields: {completionText}
                                </span>
                            </div>
                            <ChapterActions
                                disabled={!isCompleteFields}
                                chapterId={chapter.id}
                                courseId={chapter.courseId}
                                isPublished={chapter.isPublished}
                            />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 mt-14 gap-6">
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBagde icon={LayoutDashboard} />
                                <h2 className="text-xl">
                                    Customize your chapter
                                </h2>
                            </div>
                            <ChapterTitleForm
                                initialData={chapter}
                                chapterId={chapter.id}
                                courseId={chapter.courseId}
                            />
                            <ChapterDescriptionForm
                                initialData={chapter}
                                chapterId={chapter.id}
                                courseId={chapter.courseId}
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBagde icon={Eye} />
                                <h2 className="text-xl">Access Settings</h2>
                            </div>
                            <ChapterAccessForm
                                initialData={chapter}
                                chapterId={chapter.id}
                                courseId={chapter.courseId}
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBagde icon={Video} />
                                <h2 className="text-xl">Add a video</h2>
                            </div>
                        </div>
                        <ChapterVideoForm
                            initialData={chapter}
                            chapterId={chapter.id}
                            courseId={chapter.courseId}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChapterId;
