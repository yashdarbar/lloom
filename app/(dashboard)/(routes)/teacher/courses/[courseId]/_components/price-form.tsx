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
import { Course } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/format";
import { updateCourse } from "../../../actions/create-actions";
import { CourseData } from "@/app/type/course";

interface PriceFormProps {
    initialData: CourseData;
    courseId: string | undefined;
}

const formSchema = z.object({
    price: z.coerce.number(),
});

const PriceForm = ({ initialData, courseId }: PriceFormProps) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            price: initialData?.price || undefined,
        },
    });

    const [isEditing, setIsEditing] = useState(false);

    const { isSubmitting, isValid } = form.formState;

    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
        try {
            if (!courseId) {
                return {
                    error: "Course not found",
                };
            }
            const price = await updateCourse(courseId, {price: values.price});
            if (price?.success) {
                toast.success("Course updated successfully");
            } else {
                toast.error(price?.error || "Course not updated");
            }
        } catch (error) {
            toast.error("Something went wrong!");
        }
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-black">
            <div className="font-medium flex items-center justify-between">
                Course price
                <Button variant="ghost" onClick={toggleEdit}>
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2 " />
                            Edit price
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p
                    className={cn(
                        "text-sm mt-2",
                        !initialData.price && "text-slate-500 italic"
                    )}
                >
                    {initialData.price ? formatPrice(initialData.price) : "No price"}
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
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step={0.01}
                                            disabled={isSubmitting}
                                            placeholder="Set your course price"
                                            {...field}
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

export default PriceForm;
