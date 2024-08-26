"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { ChapterData } from "@/app/type/course";
import { updateChapter } from "../../../../actions/chapter-actions";

interface ChapterAccessFormProps {
    initialData: ChapterData;
    courseId: string | undefined;
    chapterId: string | undefined;
}

const formSchema = z.object({
    isFree: z.boolean().default(false),
});

const ChapterAccessForm = ({ initialData, courseId, chapterId }: ChapterAccessFormProps) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            isFree: !!initialData.isFree //double !! used to make it boolean
        },
    });

    const [isEditing, setIsEditing] = useState(false);

    const { isSubmitting, isValid } = form.formState;

    const toggleEdit = () => setIsEditing((current) => !current);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
        try {
            if (!chapterId) {
                return {
                    error: "Course not found",
                };
            }
            const chapterAccess = await updateChapter(chapterId, {
                isFree: values.isFree,
            });
            if (chapterAccess?.success) {
                toast.success("Chapter updated successfully");
                toggleEdit();
            } else {
                toast.error(chapterAccess?.error || "Something went wrong");
            }
        } catch (error) {
            toast.error("Something went wrong!");
        }
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-black">
            <div className="font-medium flex items-center justify-between">
                Chapter access
                <Button variant="ghost" onClick={toggleEdit}>
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2 " />
                            Edit access
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p
                    className={cn(
                        "text-sm mt-2",
                        !initialData.isFree && "text-slate-500 italic"
                    )}
                >
                    {initialData.isFree ? (
                        <>This chapter is free for preview.</>
                    ) : (<>This chapter is not free.</>)}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="isFree"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="leading-none">
                                        <FormDescription>
                                            Check this box if you want to make
                                            this chapter as free for review.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button
                                disabled={!isValid || isSubmitting}
                                type="submit"
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    );
};

export default ChapterAccessForm;
