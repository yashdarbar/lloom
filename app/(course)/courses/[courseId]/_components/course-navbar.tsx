import NavBarRoutes from "@/components/navbar-routes";
//import { Chapter, Course, UserProgress } from "@prisma/client";
import CourseMobileSidebar from "./course-mobile-sidebar";
import { ChapterData, CourseData, UserProgressData } from "@/app/type/course";
interface CourseNavBarProps {
    course: CourseData & {
        chapters: (ChapterData & {
            userProgress: UserProgressData[] | null;
        })[];
    };
    progressCount: number;
}

const CourseNavBar = ({ course, progressCount }: CourseNavBarProps) => {
    return (
        <div className="flex items-center bg-white p-4 border-b shadow-sm dark:bg-black">
            <CourseMobileSidebar course={course} progressCount={progressCount}/>
            <NavBarRoutes />
        </div>
    );
};

export default CourseNavBar;
