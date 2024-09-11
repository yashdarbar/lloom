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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { updateCourse } from "../../../actions/create-actions";
import { CourseData } from "@/app/type/course";


interface TitleFormProps {
    initialData: CourseData;
    courseId: string | undefined;
}

const formSchema = z.object({
    title: z.string().min(1, {
        message: "title is required",
    }),
});

const TitleForm = ({ initialData, courseId }: TitleFormProps) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: initialData?.title || "",
        }
    });


    const [isEditing, setIsEditing] = useState(false);

    const { isSubmitting, isValid } = form.formState;

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        //console.log(values);
        try {
            if (!courseId) {
                return {
                    error: "Course not found",
                };
            }
            const title = await updateCourse(courseId, {title: values.title});
            if (title?.success) {
                toast.success("Course updated successfully")
                router.refresh();
            } else {
                toast.error(title?.error || "Something went wrong");
            }
            //router.refresh();
        } catch (error) {
            toast.error("Something went wrong!");
        }
    };



    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-black">
            <div className="font-medium flex items-center justify-between">
                Course title
                <Button variant="ghost" onClick={toggleEdit}>
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2 " />
                            Edit title
                        </>
                    )}
                </Button>
            </div>
                {!isEditing && (<p className="text-sm mt-2">{initialData?.title}</p>)}
                {isEditing && (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4" >
                            <FormField control={form.control} name="title"
                            render={({field}) => (<FormItem>
                                <FormControl>
                                    <Input disabled={isSubmitting} placeholder="e.g. 'web Development, UI/UX'" {...field}/>
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


export default TitleForm;
