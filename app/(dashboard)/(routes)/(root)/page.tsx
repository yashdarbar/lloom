import { getDashBoardCourses } from "@/actions/get-dashboard-courses";
import CoursesList from "@/components/courses-list";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import InfoCard from "./_components/info-card";
import { CheckCircle, Clock } from "lucide-react";

export default async function DashboardCourses() {
    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    }

    const { coursesInProgress, completedCourses } = await getDashBoardCourses(
        userId
    );

    return (
        <div className="p-6 space-y-4 mt-[35px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoCard
                    icon={Clock}
                    variant={"default"}
                    label="In Progress"
                    numberOfItems={coursesInProgress.length}
                />
                <InfoCard
                    icon={CheckCircle}
                    variant={"success"}
                    label="Completed"
                    numberOfItems={completedCourses.length}
                />
            </div>
            <CoursesList items={[...coursesInProgress, ...completedCourses]} />
        </div>
    );
}
