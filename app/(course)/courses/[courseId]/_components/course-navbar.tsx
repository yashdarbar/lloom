import NavBarRoutes from "@/components/navbar-routes";
import { Chapter, Course, UserProgress } from "@/src/app/generated/client";
import CourseMobileSidebar from "./course-mobile-sidebar";
interface CourseNavBarProps {
    course: Course & {
        chapters: (Chapter & {
            userProgress: UserProgress[] | null;
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
