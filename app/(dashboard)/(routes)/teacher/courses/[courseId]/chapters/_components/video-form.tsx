"use client";

import * as z from "zod";
import axios from "axios";
import { Pencil, PlusCircle, Video } from "lucide-react";
import  MuxPlayer  from "@mux/mux-player-react"

import { Button } from "@/components/ui/button";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter, MuxData } from "@/src/app/generated/client";
import { FileUpload } from "@/components/file-upload";

interface ChapterVideoFormProps {
    initialData: Chapter & { muxData?: MuxData | null };
    courseId: string;
    chapterId: string;
}

const formSchema = z.object({
    videoUrl: z.string().min(1),
});

const ChapterVideoForm = ({ initialData, courseId, chapterId }: ChapterVideoFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`,values);
            toast.success("chapter video uploaded successfully");
            toggleEdit();
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong!");
        }
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-black">
            <div className="font-medium flex items-center justify-between">
                Chapter video
                <Button variant="ghost" onClick={toggleEdit}>
                    {isEditing && <>Cancel</>}
                    {!isEditing && !initialData.videoUrl && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add a video
                        </>
                    )}
                    {!isEditing && initialData.videoUrl && (
                        <>
                            <Pencil className="h-4 w-4 mr-2 " />
                            Edit video
                        </>
                    )}
                </Button>
            </div>
            {!isEditing &&
                (!initialData.videoUrl ? (
                    <div className="h-60 flex items-center justify-center bg-slate-200 rounded-md dark:bg-gray-950">
                        <Video className="h-10 w-10 text-slate-500" />
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2">
                        <MuxPlayer
                        playbackId={initialData?.muxData?.playbackId || ""}
                        />
                    </div>
                ))}
            {isEditing && (
                <div>
                    <FileUpload
                        endpoint="chapterVideo"
                        onChange={(url) => {
                            if (url) {
                                onSubmit({ videoUrl: url });
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        Upload this chpater&apos;s video
                    </div>
                </div>
            )}
            {initialData && !isEditing && (
                <div className="text-xs text-muted-foreground mt-2">
                    Videos can take a few minutes to process. Refersh the page if video does not appear.
                </div>
            )}
        </div>
    );
};

export default ChapterVideoForm;
