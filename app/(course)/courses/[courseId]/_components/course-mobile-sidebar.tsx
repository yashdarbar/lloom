//import { UserProgress } from "@prisma/client";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import CourseSideBar from "./course-sidebar";
import { ChapterData, CourseData, UserProgressData } from "@/app/type/course";

interface CourseMobileSidebarProps {
    course: CourseData & {
        chapters: (ChapterData & {
            userProgress: UserProgressData[] | null;
        })[];
    };
    progressCount: number;
}

const CourseMobileSidebar = ({
    course,
    progressCount,
}: CourseMobileSidebarProps) => {
    return (
        <Sheet>
            <SheetTrigger className="md:hidden pr-4 hover:opacity-65 transition dark:bg-black">
                <Menu />
            </SheetTrigger>
            <SheetContent side="left" className="bg-white p-0">
                <CourseSideBar course={course} progressCount={progressCount} />
            </SheetContent>
        </Sheet>
    );
};

export default CourseMobileSidebar;
