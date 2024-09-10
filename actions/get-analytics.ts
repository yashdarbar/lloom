import { db } from "@/lib/db";
import { Purchase, Course } from "@prisma/client";

type PurchaseWithCourse = Purchase & {
    course: Course;
}

const groupByCourse = (purschases: PurchaseWithCourse[]) => {
    const grouped: { [courseTitle: string]: number} = {};

    purschases.forEach((purschase) => {
        const courseTitle = purschase.course.title;
        if (!grouped[courseTitle]) {
            grouped[courseTitle] = 0;
        }
        grouped[courseTitle] += purschase.course.price!;
    })

    return grouped;
}

export async function getAnalytics (userId: string) {
    try {
        const purschases = await db.purchase.findMany({
            where: {
                course: {
                    userId: userId,
                }
            },
            include: {
                course: true,
            }
        });

        const groupedEarnings = groupByCourse(purschases);
        const data = Object.entries(groupedEarnings).map(([courseTitle, total]) => ({
            name: courseTitle,
            total: total,
        }));

        const totalRevenue = data.reduce((acc, cur) => acc + cur.total, 0);
        const totalSales = purschases.length;

        return {
            data,
            totalRevenue,
            totalSales
        }

    } catch (error) {
        console.log("[GET_ANALYTICS_ERROR]", error);
        return {
            data: [],
            totalRevenue: 0,
            totalSales: 0,
        }
    }
}