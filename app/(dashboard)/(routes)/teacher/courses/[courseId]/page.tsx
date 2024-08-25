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
import { Attachment, Chapter, Course } from "@prisma/client";
//import Banner from "@/components/banner";

interface CourseData extends Partial<Course> {
    id?: string;
    attachments?: Attachment[];
    chapters?: Chapter[];
}

const CourseId = async ({ params }: { params: { courseId: string } }) => {
    const courseResult = await getCourse(params.courseId);
    if (!courseResult || courseResult.error) {
        return <div>Course not found</div>;
    }

    const course: CourseData = courseResult.success || {};
    course.attachments = course.attachments || [];
    course.chapters = course.chapters || [];

    const categories = await getCategory();
    if (!categories || categories.error) {
        return <div>Categories not found</div>;
    }

    const allTheFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.categoryId,
        //course?.success?.chapters.some((chapter) => chapter.isPublished),
    ];

    const totalFields = allTheFields.length;
    const completedFields = allTheFields.filter(Boolean).length;
    const completedText = `(${completedFields}/${totalFields})`;

    const isCompleteFields = allTheFields.every(Boolean);

    return (
        <>
            {/* {!course.isPublished && (
                <Banner
                    variant="warning"
                    label="This Course is unpublised. To make is publised complete all the required fields."
                />
            )} */}
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-2">
                        <h1 className="text-2xl font-medium">Course setup</h1>
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                            Complete all fields {completedText}
                        </span>
                    </div>
                    {/* <CourseActions
                        courseId={params.courseId}
                        disabled={!isCompleteFields}
                        isPublished={course.isPublished}
                    /> */}
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
                            options={categories?.success?.map((category) => ({
                                label: category.name,
                                value: category.id,
                            }))}
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
