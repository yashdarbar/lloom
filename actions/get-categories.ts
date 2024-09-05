"use server";

import { db } from "@/lib/db";

export async function getCategories() {
    try {
        const catergoris = await db.category.findMany({
            orderBy: {
                name: "asc",
            },
        });
        console.log("categories", catergoris);
        return {
            success: catergoris
        };
    } catch (error) {
        console.log("[GET_CATEGORIES]", error);
        return {
            error: "Could not find"
        };
    }
}