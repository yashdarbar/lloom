"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, PlusCircle } from "lucide-react";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import ChaptersList from "./chapters-list";
import { CourseData } from "@/app/type/course";
import { getCourse } from "../../../actions/create-actions";
import { createChapter, reorderChapters } from "../../../actions/chapter-actions";
import Link from "next/link";

interface ChapterFormProps {
    initialData: CourseData;
    courseId: string | undefined;
}

interface ChapterData {
    id: string;
    title: string;
    description: string | null;
    videoUrl: string | null;
    position: number;
    isPublished: boolean;
    isFree: boolean;
    courseId: string;
    createdAt: Date;
    updatedAt: Date;
}

const formSchema = z.object({
    title: z.string().min(1),
});

const ChapterForm = ({ initialData, courseId }: ChapterFormProps) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: ""
        },
    });

    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [chapters, setChapters] = useState<ChapterData[]>([]);

    const { isSubmitting, isValid } = form.formState;

    const toggleCreating = () => setIsCreating((current) => !current);

    const router = useRouter();

    useEffect(()=>{
        const fetchChapters = async () => {
            if (courseId) {
                const courseResult = await getCourse(courseId);
                if (courseResult && "success" in courseResult && courseResult.success) {
                    setChapters(courseResult.success.chapters as ChapterData[] || [])
                }
            }
        };
        fetchChapters();
    }, [courseId])

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            if (!courseId) {
                return {
                    error: "Course not found",
                };
            }
            const chapter = await createChapter(courseId, {title: values.title});
            if (chapter?.success) {
                toast.success("Chapter updated successfully");
                toggleCreating();
                router.refresh();
            } else {
                toast.error(chapter?.error || "Chapter not updated");
            }
        } catch (error) {
            toast.error("Something went wrong!");
        }
    };

    const onReorder = async (updateData: { id: string; position: number;}[]) => {
        try {
            if (!courseId) {
                return {
                    error: "Course not found",
                };
            }
            setIsUpdating(true);
            const result = await reorderChapters({courseId, list: updateData});
            // await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
            //     list: updateData,
            // });
            if (result?.success) {
                toast.success("Chapters reordered");
            } else {
                toast.error(result?.error || "Chapter not reordered");
            }

            //router.refresh();
        } catch {
            toast.error("Something went wrong!");
        } finally {
            setIsUpdating(false);
        }
    }

    const onEdit = (id: string): string => {
        return `/teacher/courses/${courseId}/chapters/${id}`;

    }
    //console.log(isCreating);

    return (
        <div className="relative mt-6 border bg-slate-100 rounded-md p-4 dark:bg-black">
            {isUpdating && (
                <div className="absolute w-full h-full top-0 right-0 opacity-40 bg-slate-200 rounded-md flex justify-center items-center">
                    <Loader2 className="animate-spin h-6 w-6 text-sky-700"/>
                </div>
            )}
            <div className="font-medium flex items-center justify-between">
                Course chapters
                <Button variant="ghost" onClick={toggleCreating}>
                    {isCreating ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2 " />
                            Add chapter
                        </>
                    )}
                </Button>
            </div>
            {isCreating && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'Introduction to the course ...'"
                                            {...field}
                                            className="dark:bg-black"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            disabled={!isValid || isSubmitting}
                            type="submit"
                        >
                            Create
                        </Button>
                    </form>
                </Form>
            )}
            {!isCreating && (
                <div
                    className={cn(
                        "text-sm mt-2",
                        !chapters.length && "text-slate-500 italic"
                    )}
                >
                    {!chapters.length && "No chapters"}
                    <ChaptersList
                        onEdit={onEdit}
                        onReorder={onReorder}
                        items={chapters || []}
                    />
                </div>
            )}
            {!isCreating && (
                <p className="text-xs text-muted-foreground mt-4">
                    Drag and drop to reorder the chapters
                </p>
            )}
        </div>
    );
};

export default ChapterForm;
