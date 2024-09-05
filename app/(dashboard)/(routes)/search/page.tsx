"use client";

import { db } from "@/lib/db";
import Categories from "./_components/categories";
import SearchInput from "@/components/search-input";
import { auth } from "@clerk/nextjs/server";
//import { redirect } from 'next/navigation';
import { getCourses } from "@/actions/get-courses";
//import CoursesList from "@/components/courses-list";
import { getCategories } from "@/actions/get-categories";
import { useEffect, useState } from "react";

interface SearchPageProps {
    searchParams: {
        //categoryId: string;
        title: string;
    };
}

const SearchPage = ({ searchParams }: SearchPageProps) => {
    const [categories, setCategories] = useState<{
        success?: { id: string; name: string }[];
        error?: undefined;
    }>();

    // const { userId } = auth();
    // if (!userId) {
    //     //redirect("/");
    //     return <div>djfa;f</div>;
    // }

    // const courses = await getCourses({
    //     userId,
    //     ...searchParams,
    // });

    useEffect(() => {
        const fetch = async () => {
            try {
                const one = await getCategories();
                if (!one.success) {
                    return;
                }
                setCategories(one);
            } catch (error) {
                console.log("error ctate", error);
            }
        };
        fetch();
    }, []);

    // const categories = await db.category.findMany({
    //   orderBy: {
    //     name: "asc"
    //   }
    // })

    //const categories = await getCategories();

    return (
        <>
            <div className="md:hidden md:mb-0 block pt-2 px-6">
                {/* <SearchInput /> */}
            </div>
            <div className="p-6 space-y-3">
                <Categories items={categories?.success} />
                {/* <CoursesList items={courses} /> */}
            </div>
        </>
    );
};

export default SearchPage;
