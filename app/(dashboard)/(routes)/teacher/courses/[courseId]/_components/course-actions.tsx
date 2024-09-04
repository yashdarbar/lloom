"use client";

import ConfirmModel from "@/components/models/confirm-model";
import { Button } from "@/components/ui/button";
//import { useConfettiStore } from "@/hooks/use-confetti";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { coursePublish, courseUnpublish } from "../../../actions/create-actions";

interface CourseActionsProps {
    courseId: string | undefined;
    disabled: boolean;
    isPublished: boolean | null | undefined;
}

const CourseActions = ({
    courseId,
    isPublished,
    disabled,
}: CourseActionsProps) => {
    const router = useRouter();
    //const confetti = useConfettiStore();

    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);
            if (!courseId) {
                return "CourseId or chapterId not found";
            }
            if (isPublished) {
                const unpublish = await courseUnpublish(courseId);
                if (unpublish?.success) {
                    toast.success("Course is Unpublished");
                } else {
                    toast.error(unpublish?.error || "Something went wrong");
                }
            }
            if (!isPublished) {
                const publish = await coursePublish(courseId);
                if (publish?.success) {
                    toast.success("Course is Published");
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
                `/api/courses/${courseId}`
            );
            toast.success("Course deleted");
            router.refresh();
            router.push(`/teacher/courses`);
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

export default CourseActions;
