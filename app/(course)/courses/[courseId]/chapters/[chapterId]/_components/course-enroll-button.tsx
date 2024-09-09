"use client";

import { checkOut } from "@/app/(dashboard)/(routes)/teacher/actions/create-actions";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

interface CourseEnrollButtonProps {
    courseId: string;
    price: number;
}

const CourseEnrollButton = ({ price, courseId }: CourseEnrollButtonProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);
            if (!courseId) {
                return {
                    error: "Course not found",
                };
            }
            const response = await checkOut(courseId);
            if (response?.success) {
                // toast.success("Chapter updated successfully");
                // toggleEdit();
                window.location.assign(response.success.url!);
            } else {
                toast.error(response?.error || "Something went wrong");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Button
                onClick={onClick}
                disabled={isLoading}
                size="sm"
                className="w-full md:w-auto"
            >
                Enroll for {formatPrice(price)}
            </Button>
        </>
    );
};

export default CourseEnrollButton;
