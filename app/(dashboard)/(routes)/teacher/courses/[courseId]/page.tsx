import { IconBagde } from "@/components/icon-bagde";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { DollarSign, File, LayoutDashboard, ListChecks } from "lucide-react";
import { redirect } from "next/navigation";
import TitleForm from "./_components/title-form";
import DescriptionForm from "./_components/description-form";
import ImageForm from "./_components/image-form";
import CategoryForm from "./_components/category-form";
import PriceForm from "./_components/price-form";
import AttachmentForm from "./_components/attachment-form";
import ChapterForm from "./_components/chapter-form";
import CourseActions from "./_components/course-actions";
import { getCategory, getCourse } from "../../actions/create-actions";
//import { Attachment, Chapter, Course } from "@/prisma/src/app/generated/client";
import Banner from "@/components/banner";
import { AttachmentData, ChapterData, CourseData } from "@/app/type/course";
//import Banner from "@/components/banner";

// interface Course extends Partial<CourseData> {
//     id: string;
//     attachments?: AttachmentData[];
//     chapters?: ChapterData[];
// }
interface Course extends CourseData {
    attachments: AttachmentData[];
    chapters: ChapterData[];
}

interface Category {
    id: string;
    name: string;
}


const CourseId = async ({ params }: { params: { courseId: string } }) => {
    const courseResult = await getCourse(params.courseId);
    if (!courseResult || courseResult.error || !courseResult.success) {
        return <div>Course not found</div>;
    }

    // const course: Course = courseResult.success || {};
    // course.attachments = course.attachments || [];
    // course.chapters = course.chapters || [];
    const courseData = courseResult.success;

    // Ensure all required properties are present
    if (!courseData.id || !courseData.userId || !courseData.title) {
        return <div>Invalid course data</div>;
    }

    const course: Course = {
        ...courseData,
        attachments: courseData.attachments || [],
        chapters: courseData.chapters || [],
        description: courseData.description || null,
        imageUrl: courseData.imageUrl || null,
        price: courseData.price || null,
        isPublished: courseData.isPublished || false,
        categoryId: courseData.categoryId || null,
        createdAt: courseData.createdAt || new Date(),
        updatedAt: courseData.updatedAt || new Date(),
    };

    const categories = await getCategory();
    if (!categories || categories.error) {
        return <div>Categories not found</div>;
    }

    const allTheFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.categoryId,
        course.chapters.some((chapter) => chapter.isPublished),
    ];

    const totalFields = allTheFields.length;
    const completedFields = allTheFields.filter(Boolean).length;
    const completedText = `(${completedFields}/${totalFields})`;

    const isCompleteFields = allTheFields.every(Boolean);

    return (
        <>
            {!course.isPublished && (
                <div className="">
                    <Banner
                        variant="warning"
                        label="This Course is unpublised. To make is publised complete all the required fields."
                    />
                </div>
            )}
            <div className="p-6 mt-[35px]">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-2">
                        <h1 className="text-2xl font-medium">Course setup</h1>
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                            Complete all fields {completedText}
                        </span>
                    </div>
                    <CourseActions
                        courseId={course.id}
                        disabled={!isCompleteFields}
                        isPublished={course.isPublished}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-14">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBagde icon={LayoutDashboard} />
                            <h2 className="text-xl">Customize your course</h2>
                        </div>
                        <TitleForm initialData={course} courseId={course.id} />
                        <DescriptionForm
                            initialData={course}
                            courseId={course.id}
                        />
                        <ImageForm initialData={course} courseId={course.id} />
                        <CategoryForm
                            initialData={course}
                            courseId={course.id}
                            options={
                                categories?.success?.map(
                                    (category: Category) => ({
                                        label: category.name,
                                        value: category.id,
                                    })
                                ) || []
                            }
                        />
                    </div>
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBagde icon={ListChecks} />
                                <h2 className="text-xl">Course chapters</h2>
                            </div>
                            <ChapterForm
                                initialData={course}
                                courseId={course.id}
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBagde icon={DollarSign} />
                                <h2 className="text-xl">Sell your course</h2>
                            </div>
                            <PriceForm
                                initialData={course}
                                courseId={course.id}
                            />
                        </div>

                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBagde icon={File} />
                                <h2 className="text-xl">
                                    Resourses & Attachments
                                </h2>
                            </div>
                            <AttachmentForm
                                initialData={course}
                                courseId={course.id}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CourseId;
