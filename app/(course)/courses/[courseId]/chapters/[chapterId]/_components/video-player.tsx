"use client";

import MuxPlayer from "@mux/mux-player-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

import { cn } from "@/lib/utils";
import { useConfettiStore } from "@/hooks/use-confetti";
import { chapterProgress, updateChapterProgress } from "@/app/(dashboard)/(routes)/teacher/actions/chapter-actions";

interface VideoPlayerProps {
    chapterId: string;
    courseId: string;
    title: string;
    playbackId: string;
    isLocked: boolean;
    completeOnEnd: boolean;
    nextChapterId?: string;
}

const VideoPlayer = ({
    chapterId,
    courseId,
    title,
    nextChapterId,
    playbackId,
    isLocked,
    completeOnEnd,
}: VideoPlayerProps) => {
    const router = useRouter();
    const [isReady, setIsReady] = useState(false);
    const confetti = useConfettiStore();

    //console.log("playbackId", playbackId);


    const onEnd = async () => {
        try {
            if (completeOnEnd) {
                const result = await updateChapterProgress(
                    courseId,
                    chapterId,
                    true
                );
                if (!nextChapterId) {
                    confetti.onOpen();
                }

                toast.success("Progress updated");
                router.refresh();

                if (nextChapterId) {
                    router.push(`courses/${courseId}/chapters/${nextChapterId}`);
                }
            }
        } catch (error) {
            toast.error("something went wrong");
        }
    };

    return (
        <div className="relative aspect-video">
            {!isReady && !isLocked && (
                <div className="absolute flex inset-0 items-center justify-center bg-slate-800">
                    <Loader2 className="h-8 w-8 animate-spin text-secondary" />
                </div>
            )}
            {isLocked && (
                <div className="absolute flex inset-0 items-center justify-center flex-col bg-slate-800 text-secondary gap-y-2">
                    <Lock className="h-8 w-8" />
                    <p className="text-sm">This chapter is locked</p>
                </div>
            )}
            {!isLocked && (
                <MuxPlayer
                    className={cn(!isReady && "hidden")}
                    title={title}
                    onCanPlay={() => setIsReady(true)}
                    playbackId={playbackId}
                    onEnded={onEnd}
                    autoPlay
                />
            )}
        </div>
    );
};

export default VideoPlayer;
