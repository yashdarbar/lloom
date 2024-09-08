import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Chapter, Course, UserProgress } from "@/src/app/generated/client";
import { redirect } from "next/navigation";
import CoursesSideItem from "./courses-sideItem";
import CourseProgress from "@/components/course-progress";

interface CourseSideBarProps {
    course: Course & {
        chapters: (Chapter & {
            userProgress: UserProgress[] | null;
        })[];
    };
    progressCount: number;
}

const CourseSideBar = async ({ course, progressCount }: CourseSideBarProps) => {
    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    }

    const purchase = await db.purchase.findUnique({
        where: {
            userId_courseId: {
                userId: userId,
                courseId: course.id,
            },
        },
    });

    return (
        <div className="h-full flex flex-col w-full border-r shadow-sm overflow-y-auto dark:bg-black">
            <div className="p-8 border-b shadow-sm flex flex-col">
                <h1 className="font-semibold">{course.title}</h1>
                {purchase && (
                    <div className="mt-10">
                        <CourseProgress
                            variant="success"
                            value={progressCount}
                            size="sm"
                        />
                    </div>
                )}
            </div>
            <div className="flex flex-col w-full">
                {course.chapters.map((chapter) => (
                    <CoursesSideItem
                        key={chapter.id}
                        id={chapter.id}
                        label={chapter.title}
                        courseId={course.id}
                        isLocked={!chapter.isFree && !purchase}
                        isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
                    />
                ))}
            </div>
        </div>
    );
};

export default CourseSideBar;
