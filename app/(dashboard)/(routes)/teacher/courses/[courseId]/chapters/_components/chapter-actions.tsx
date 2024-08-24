"use client";

import ConfirmModel from "@/components/models/confirm-model";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface ChapterActionsProps {
    chapterId: string;
    courseId: string;
    isPublished: boolean;
    disabled: boolean;
}

const ChapterActions = ({
    chapterId,
    courseId,
    isPublished,
    disabled,
}: ChapterActionsProps) => {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);
            if (isPublished) {
                await axios.patch(
                    `/api/courses/${courseId}/chapters/${chapterId}/unpublish`
                );
                toast.success("Chapter is Unpublished");
            }
            if (!isPublished) {
                await axios.patch(
                    `/api/courses/${courseId}/chapters/${chapterId}/publish`
                );
                toast.success("Chapter is Published");
            }

            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setIsLoading(true);
            await axios.delete(
                `/api/courses/${courseId}/chapters/${chapterId}`
            );
            toast.success("Chapter deleted");
            router.refresh();
            router.push(`/teacher/courses/${courseId}`);
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-x-2">
            <Button
                size="sm"
                variant="outline"
                disabled={disabled || isLoading}
                onClick={onClick}
            >
                {isPublished ? "Unpublished" : "Published"}
            </Button>
            <ConfirmModel onConfirm={onDelete}>
                <Button size="sm" disabled={isLoading}>
                    <Trash className="h-4 w-4" />
                </Button>
            </ConfirmModel>
        </div>
    );
};

export default ChapterActions;
