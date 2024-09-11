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
//import { Course } from "@/src/app/generated/client";
import { Combobox } from "@/components/ui/combobox";
import { updateCourse } from "../../../actions/create-actions";

interface CategoryFormProps {
    initialData: {
            categoryId?: string | null;
            id?: string;
        } | null | undefined;
    courseId: string | undefined;
    options?: {
        label: string | undefined;
        value: string | undefined;
    }[];
}

const formSchema = z.object({
    categoryId: z.string().min(1, {
        message: "categoryId is required",
    }),
});

const CategoryForm = ({
    initialData,
    courseId,
    options,
}: CategoryFormProps) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            categoryId: initialData?.categoryId || "",
        },
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
            const categoryId = await updateCourse(courseId, values);
            if (categoryId?.success) {
                toast.success("Course updated successfully");
                router.refresh();
            } else {
                toast.error(categoryId?.error || "Course not updated");
            }
        } catch (error) {
            toast.error("Something went wrong!");
        }
    };

    const selectedOption = options?.find(
        (option) => option.value === initialData?.categoryId
    );

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-black">
            <div className="font-medium flex items-center justify-between">
                Course category
                <Button variant="ghost" onClick={toggleEdit}>
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2 " />
                            Edit category
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p
                    className={cn(
                        "text-sm mt-2",
                        !initialData?.categoryId && "text-slate-500 italic"
                    )}
                >
                    {selectedOption?.label || "No catergory"}
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
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Combobox
                                            options={options}
                                            value={field.value}
                                            onChange={field.onChange}
                                            // {...field}
                                        />
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

export default CategoryForm;
