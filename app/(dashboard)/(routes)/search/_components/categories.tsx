"use client";

import React from "react";
import { IconType } from "react-icons";
import {
    FcEngineering,
    FcOldTimeCamera,
    FcSportsMode,
    FcSalesPerformance,
    FcMusic,
    FcMultipleDevices,
    FcGallery,
} from "react-icons/fc";
import CategoryItem from "./category-item";
import { CategoryData } from "@/app/type/course";

interface CategoriesProps {
    items: CategoryData[] | undefined;
}

const iconMap: Record<CategoryData["name"], IconType> = {
    "Filming": FcOldTimeCamera,
    "Engineering": FcEngineering,
    "Accounting": FcSalesPerformance,
    "Computer Science": FcMultipleDevices,
    "Graphic Design": FcGallery,
};

const Categories = ({ items }: CategoriesProps) => {


    return (
        <div className="flex items-center overflow-x-auto pb-2 gap-x-2">
            {items?.map((item) => (
                <CategoryItem
                    key={item.id}
                    label={item.name}
                    icon={iconMap[item.name]}
                    value={item.id}
                />
            ))}
        </div>
    );
};

export default Categories;
