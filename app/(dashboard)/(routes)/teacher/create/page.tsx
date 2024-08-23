"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import {
    Form,
    FormField,
    FormItem,
    FormControl,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import Link from "next/link";
import { createCourse } from "../actions/create-actions";

const formSchema = z.object({
    title: z.string().min(2, {
        message: "Username must be at least 2 character",
    }),
});

const CreatePage = () => {
    //const form = useForm();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await createCourse(values);
            if (response?.success) {
                router.push(`/teacher/courses/${response?.success?.id}`);
                toast.success("Course created");
            } else {
                toast.error(response?.error || "Course not created");
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="max-w-5xl mx-auto mt-10 flex md:items-center md:justify-center h-full p-6 dark:bg-black">
            <div className="">
                <h1 className="text-2xl font-semibold">Name of the course</h1>
                <p className="text-sm text-slate-500">
                    What would you like to name your course? Don`&apos;`t worry,
                    you can change this later.
                </p>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8 mt-8"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Course title</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="title"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        This is your public display name.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2  ">
                            <Link href="/">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="mr-5"
                                >
                                    cancel
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                className="ml-5"
                                disabled={!isValid || isSubmitting}
                            >
                                Submit
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default CreatePage;
