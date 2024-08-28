"use client";

import ConfirmModel from "@/components/models/confirm-model";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { chapterPublish, chapterUnpublish } from "../../../../actions/chapter-actions";

interface ChapterActionsProps {
    chapterId: string | undefined;
    courseId: string | undefined;
    isPublished: boolean | undefined;
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
            if (!courseId || !chapterId) {
                return "CourseId or chapterId not found"
            }
            if (isPublished) {
                const unpublish = await chapterUnpublish(
                    chapterId,
                    courseId,
                );
                if (unpublish?.success) {
                    toast.success("Chapter is Unpublished");
                } else {
                    toast.error(unpublish?.error || "Something went wrong");
                }
            }
            if (!isPublished) {
                const publish = await chapterPublish(chapterId, courseId);
                if (publish?.success) {
                    toast.success("Chapter is Published");
                } else {
                    toast.error(publish?.error || "Something went wrong");
                }
            }
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
