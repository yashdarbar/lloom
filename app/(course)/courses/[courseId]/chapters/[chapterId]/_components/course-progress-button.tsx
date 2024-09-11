"use client";

import { chapterProgress } from "@/app/(dashboard)/(routes)/teacher/actions/chapter-actions";
import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface CourseProgressButtonProps {
    courseId: string;
    chapterId: string;
    isCompleted?: boolean;
    nextChapterId?: string;
}

const CourseProgressButton = ({
    courseId,
    chapterId,
    isCompleted = false,
    nextChapterId,
}: CourseProgressButtonProps) => {
    const Icon = isCompleted ? XCircle : CheckCircle;

    const router = useRouter();
    const confetti = useConfettiStore();
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);
            const result = await chapterProgress(
                courseId,
                chapterId,
                isCompleted
            );

            if (result.success) {
                if (!isCompleted && !nextChapterId) {
                    confetti.onOpen();
                }
                if (!isCompleted && nextChapterId) {
                    router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
                }
                toast.success("Progress updated");
                router.refresh();
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
        // try {
        //     setIsLoading(true);
        //     await axios.put(
        //         `/api/courses/${courseId}/chapters/${chapterId}/progress`,
        //         { isCompleted: !isCompleted }
        //     );
        //     if (!isCompleted && !nextChapterId) {
        //         confetti.onOpen();
        //     }
        //     if (!isCompleted && nextChapterId) {
        //         router.push(
        //             `/api/courses/${courseId}/chapters/${nextChapterId}`
        //         );
        //     }
        //     toast.success("Progress updated");
        //     router.refresh();
        // } catch (error) {
        //     toast.error("Something went wrong");
        // } finally {
        //     setIsLoading(false);
        // }
    };

    return (
        <Button
            onClick={onClick}
            disabled={isLoading}
            type="button"
            variant={isCompleted ? "outline" : "success"}
            className="w-full md:w-auto"
        >
            {isCompleted ? "Not completed" : "Mart as complete"}
            <Icon className="h-4 w-4 ml-2" />
        </Button>
    );
};

export default CourseProgressButton;
