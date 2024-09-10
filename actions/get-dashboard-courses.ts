import { db } from "@/lib/db";
import { Course, Category, Chapter } from "@prisma/client"
import { getProgress } from "./get-progress";


type CourseWithProgressWithCategory = Course &  {
    chapters: Chapter[],
    progress: number | null,
    category: Category
}

type DashBoardCourses = {
    completedCourses: CourseWithProgressWithCategory[],
    coursesInProgress: CourseWithProgressWithCategory[],
}

export async function getDashBoardCourses(userId: string): Promise<DashBoardCourses> {
    try {
        const purchaseCourses = await db.purchase.findMany({
            where: {
                userId: userId
            },
            select: {
                course: {
                    include: {
                        category: true,
                        chapters: {
                            where: {
                                isPublished: true,
                            }
                        }
                    }
                }
            }
        });

        const courses= purchaseCourses.map((purchase)=>(purchase.course)) as unknown as CourseWithProgressWithCategory[];

        for (const course of  courses) {
            const progress = await getProgress(userId, course.id);
            course["progress"] = progress;
        }

        const completedCourses = courses.filter((course)=> course.progress === 100);
        const coursesInProgress = courses.filter((course)=> (course.progress ?? 0) < 100);

        return {
            completedCourses,
            coursesInProgress,
        }
    } catch (error) {
        console.log("[GET_DASHBOARD_COURSE]", error);
        return {
            completedCourses:[],
            coursesInProgress: [],
        }
    }
}


// type CourseWithProgressWithCategory = Course & {
//     chapters: Chapter[],
//     progress: number | null;
//     chategory: Category;
// }

// type DashBoardCourses = {
//     completedCourses: CourseWithProgressWithCategory[],
//     coursesInProgress: CourseWithProgressWithCategory[],
// }

// export const getDashBoardCourses = async (userId: string):Promise<DashBoardCourses> {
//     try {
//         const purchaseCourses = await db.purchase.findMany({
//             where: { userId: userId},
//             select: {
//                 course: {
//                     include: {
//                         category: true,
//                         chapters: {
//                             where: {
//                                 isPublished: true,
//                             }
//                         }
//                     }
//                 }
//             }
//         });

//         const courses = purchaseCourses.map((purchase) => purchase.course) as unknown as CourseWithProgressWithCategory[];

//         for (let course of courses) {
//             const progress = await getProgress(userId, course.id);
//             course["progress"] = progress;
//         }

//         const completedCourses = courses.filter((course) => course.progress === 100);
//         const coursesInProgress = courses.filter((course) => (course.progress ?? 0) < 100);

//         return {
//             completedCourses,
//             coursesInProgress,
//         }
//     } catch (error) {
//         console.log("[GET_DASHBOARD_COURSE]", error);
//         return {
//             completedCourses:[],
//             coursesInProgress: [],
//         }
//     }
// }