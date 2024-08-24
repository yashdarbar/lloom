"use client";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

interface ChapterTitleFormProps {
    initialData: {
        title: string;
    };
    courseId: string;
    chapterId: string;
}

const formSchema = z.object({
    title: z.string().min(1, {
        message: "Title is required.",
    }),
});

export const ChapterTitleForm = ({
    initialData,
    chapterId,
    courseId,
}: ChapterTitleFormProps) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    });

    const router = useRouter();

    const [isEditing, setIsEditing] = useState(false);

    const { isSubmitting, isValid } = form.formState;

    const toggleEdit = () => setIsEditing((current) => !current);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
            try {
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
                toast.success("Chapter updated successfully")
                toggleEdit();
                router.refresh();
            } catch (error) {
                toast.error("Something went wrong");
            }
    }

    return (
        <div className="mt-6 bg-slate-100 border rounded-md p-4 dark:bg-black">
            <div className="font-medium flex items-center justify-between">
                Chapter title
                <Button variant="ghost" onClick={toggleEdit}>
                    {isEditing ? (
                        <>Chancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit title
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && <p className="text-sm mt-2">{initialData.title}</p>}
            {isEditing && (
                <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4" >
                            <FormField control={form.control} name="title"
                            render={({field}) => (<FormItem>
                                <FormControl>
                                    <Input disabled={isSubmitting} placeholder="e.g. Introduction to the course'" {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>)}
                            />
                            <div className="flex items-center gap-x-2">
                                <Button disabled={!isValid || isSubmitting}
                                type="submit">
                                    Save
                                </Button>
                            </div>
                        </form>
                    </Form>
            )}
        </div>
    );
};
