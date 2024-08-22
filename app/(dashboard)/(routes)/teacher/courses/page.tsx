import { Button } from "@/components/ui/button";
import Link from "next/link";
//import { DataTable } from "./_components/data-table";
//import { Course } from "@/src/app/generated/client";
//import { columns } from "./_components/columns";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
//import { db } from "@/lib/db";

const Courses = async () => {
    const { userId } = auth();

    if (!userId) {
        redirect("/");
    }

    // const courses = await db.course.findMany({
    //     where: {
    //         userId: userId,
    //     },
    //     orderBy: {
    //         createdAt: "desc",
    //     },
    // });

    return (
        <div className="dark:bg-black h-full">
            <div className="p-6">
                <Link href="/teacher/create">
                    <Button>New Course</Button>
                </Link>
                {/* <DataTable columns={columns} data={courses} /> */}
            </div>
        </div>
    );
};

export default Courses;
