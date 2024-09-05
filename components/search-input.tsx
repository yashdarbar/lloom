"use client";

import qs from "query-string";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { usePathname, useSearchParams, useRouter } from "next/navigation";


const SearchInput = () => {
    const [value, setValue] = useState("");
    const debounceValue = useDebounce(value);

    const pathName = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    const currentCategoryId = searchParams.get("categoryId");

    useEffect(() => {
        const url = qs.stringifyUrl(
            {
                url: pathName,
                query: {
                    title: debounceValue,
                    categoryId: currentCategoryId,
                },
            },
            { skipEmptyString: true, skipNull: true }
        );

        router.push(url);
    }, [debounceValue, router, pathName, currentCategoryId]);

    return (
        <div className="relative">
            <Search className="h-4 w-4 top-3 left-3 text-slate-600 absolute" />
            <Input
                onChange={(e) => setValue(e.target.value)}
                value={value}
                className="w-full md:w-[300px] bg-slate-100 pl-9 rounded-full focus-visible:ring-slate-200 dark:text-black"
                placeholder="Search for a course"
            />
        </div>
    );
};

export default SearchInput;
