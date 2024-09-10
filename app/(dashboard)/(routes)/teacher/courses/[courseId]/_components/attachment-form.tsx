"use client";

import * as z from "zod";
import axios from "axios";
import { File, Loader2, PlusCircle, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FileUpload } from "@/components/file-upload";
import { CourseData } from "@/app/type/course";
import {
    createAttachment,
    deleteAttachment,
    getCourse,
} from "../../../actions/create-actions";
//import { Attachment } from "@/prisma/src/app/generated/client";

interface AttachmentFormProps {
    initialData: CourseData;
    courseId: string | undefined;
}

interface AttachmentData {
    id: string;
    name: string;
    url: string;
    courseId: string;
    createdAt: string | Date;
    updatedAt: string | Date;
}

const formSchema = z.object({
    url: z.string().min(1),
});

const AttachmentForm = ({ initialData, courseId }: AttachmentFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const [deletingId, setDeletingId] = useState<string | null>(null);

    const [attachments, setAttachments] = useState<AttachmentData[]>([]);

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    useEffect(() => {
        const fetchAttachments = async () => {
            if (courseId) {
                const courseResult = await getCourse(courseId);
                if (
                    courseResult &&
                    "success" in courseResult &&
                    courseResult.success
                ) {
                    setAttachments(
                        (courseResult.success
                            .attachments as AttachmentData[]) || []
                    );
                }
            }
        };
        fetchAttachments();
    }, [courseId]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        //console.log(values);
        try {
            if (!courseId) {
                return {
                    error: "Course not found",
                };
            }
            const attachment = await createAttachment(courseId, {
                url: values.url,
            });
            if (attachment?.success) {
                toast.success("Course updated successfully");
                setAttachments((prev) => [
                    ...prev,
                    attachment.success as AttachmentData,
                ]);
                toggleEdit();
            } else {
                toast.error(attachment?.error || "Course not updated");
            }
        } catch (error) {
            toast.error("Something went wrong!");
        }
    };

    const onDelete = async (id: string) => {
        try {
            if (!id || !courseId) {
                return {
                    error: "Course not found",
                };
            }
            setDeletingId(id); // here we are updating the state so the user experience should be good. i wont make any changes but it just for the loader experience.
            const attachmentDelete = await deleteAttachment(courseId, id);
            if (attachmentDelete.success) {
                toast.success("Attachment deleted successfully");
            } else {
                toast.error(
                    attachmentDelete.error || "Attachment is not deleted"
                );
            }

            //router.refresh();
        } catch {
            toast.error("Something went wrong!");
        } finally {
            setDeletingId(null);
        }
    };

    //margin: 4px;
    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-black">
            <div className="font-medium flex items-center justify-between">
                Course resoures
                <Button variant="ghost" onClick={toggleEdit}>
                    {isEditing && <>Cancel</>}
                    {!isEditing && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add an file
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <>
                    {attachments.length === 0 && (
                        <p className="text-sm text-slate-500 mt-2 italic">
                            No attachments yet
                        </p>
                    )}
                    {attachments.length > 0 && (
                        <div className="space-y-2">
                            {attachments.map((attachment) => (
                                <div
                                    key={attachment.id}
                                    className="flex items-center p-3 w-full bg-sky-100 border-sky-200 text-sky-700 rounded-md"
                                >
                                    <File className="flex-shrink-0 h-4 w-4 mr-2" />
                                    <p className="text-xs line-clamp-1">
                                        {attachment.name}
                                    </p>
                                    {deletingId === attachment.id && (
                                        <div className="ml-auto">
                                            <Loader2 className="h4 w-4 animate-spin" />
                                        </div>
                                    )}
                                    {deletingId !== attachment.id && (
                                        <button
                                            onClick={() =>
                                                onDelete(attachment.id)
                                            }
                                            className="ml-auto hover:opacity-75 transition"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
            {isEditing && (
                <div>
                    <FileUpload
                        endpoint="courseAttachment"
                        onChange={(url) => {
                            if (url) {
                                onSubmit({ url: url });
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        Add anything your students might need to complete tha
                        course.
                    </div>
                </div>
            )}
        </div>
    );
};

export default AttachmentForm;
