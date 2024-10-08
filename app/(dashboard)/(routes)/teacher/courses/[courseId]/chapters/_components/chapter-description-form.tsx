"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Editor } from "@/components/editor";
import { Preview } from "@/components/preview";
import { ChapterData } from "@/app/type/course";
import { updateChapter } from "../../../../actions/chapter-actions";

interface ChapterDescriptionFormProps {
    initialData: ChapterData;
    courseId: string | undefined;
    chapterId: string | undefined;
}

const formSchema = z.object({
    description: z.string().min(1),
});

const ChapterDescriptionForm = ({ initialData, courseId, chapterId }: ChapterDescriptionFormProps) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: initialData?.description || ""
        },
    });

    const [isEditing, setIsEditing] = useState(false);

    const { isSubmitting, isValid } = form.formState;

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        //console.log(values);
        try {
            if (!chapterId) {
                return {
                    error: "Course not found",
                };
            }
            const description = await updateChapter(chapterId, {
                description: values.description,
            });
            if (description?.success) {
                toast.success("Chapter updated successfully");
                toggleEdit();
            } else {
                toast.error(description?.error || "Something went wrong");
            }
        } catch (error) {
            toast.error("Something went wrong!");
        }
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-black">
            <div className="font-medium flex items-center justify-between">
                Chapter description
                <Button variant="ghost" onClick={toggleEdit}>
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2 " />
                            Edit description
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <div
                    className={cn(
                        "text-sm mt-2",
                        !initialData.description && "text-slate-500 italic"
                    )}
                >
                    {!initialData.description && "No description"}
                    {initialData.description && (
                        <>
                            <Preview
                                value={initialData.description}
                            />

                        </>
                    )}
                </div>
            )}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Editor {...field} />
                                    </FormControl>
                                    <FormMessage />
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

export default ChapterDescriptionForm;
