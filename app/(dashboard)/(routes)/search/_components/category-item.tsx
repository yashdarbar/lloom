"use client";

import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import qs from "query-string";
import React from "react";
import { IconType } from "react-icons";

interface CategoryItemProps {
    value?: string;
    icon?: IconType;
    label: string;
}

const CategoryItem = ({ label, value, icon: Icon }: CategoryItemProps) => {
    const pathName = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentCategoryId = searchParams.get("categoryId");
    const currentCategoryTitle = searchParams.get("title");

    const isSelected = currentCategoryId === value;

    const onClick = () => {
        const url = qs.stringifyUrl(
            {
                url: pathName,
                query: {
                    title: currentCategoryTitle,
                    categoryId: isSelected ? null : value,
                },
            },
            { skipEmptyString: true, skipNull: true }
        );

        router.push(url);
    };

    return (
        <div>
            <button
                onClick={onClick}
                className={cn(
                    "flex items-center border px-3 text-sm hover:border-sky-600 transition py-2 rounded-full gap-x-1",
                    isSelected && "bg-sky-200/20 border-sky-600 text-sky-600"
                )}
            >
                {Icon && <Icon size={20} />}
                <div className="truncate">{label}</div>
            </button>
        </div>
    );
};

export default CategoryItem;
