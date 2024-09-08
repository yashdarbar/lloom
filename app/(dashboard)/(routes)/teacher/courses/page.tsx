import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { coursess } from "../actions/create-actions";
import { CourseData } from "@/app/type/course";


const Courses = async () => {
    const { userId } = auth();

    if (!userId) {
        redirect("/");
    }

    const coursesResponse = await coursess(userId);
    //const courses = "success" in coursesResponse ? coursesResponse.success : [];
    const courses: CourseData[] = "success" in coursesResponse && Array.isArray(coursesResponse.success) ? coursesResponse.success : [];

    return (
        <div className="dark:bg-black h-full">
            <div className="p-6 mt-5">
                {/* <Link href="/teacher/create">
                    <Button>New Course</Button>
                </Link> */}
                <DataTable columns={columns} data={courses} />
            </div>
        </div>
    );
};

export default Courses;
