import Image from "next/image";
import Link from "next/link";
import  { IconBagde }  from "@/components/icon-bagde";
import { BookOpen } from "lucide-react";
import { formatPrice } from "@/lib/format";
import CourseProgress from "@/components/course-progress";

interface CourseCardProps {
    id: string;
    title: string;
    imageUrl: string;
    chaptersLength: number;
    price: number;
    progress: number;
}

const CourseCard = ({
    id,
    title,
    imageUrl,
    chaptersLength,
    price,
    progress,
}: CourseCardProps) => {
    return (
        <Link href={`/courses/${id}`}>
            <div className="group hover:shadow-md dark:shadow-slate-300 border rounded-lg overflow-hidden transition p-3 h-full">
                <div className="relative w-full aspect-video rounded-md overflow-hidden">
                    <Image fill alt={title} src={imageUrl} />
                </div>
                <div className="flex flex-col pt-2">
                    <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
                        {title}
                    </div>
                    <p></p>
                    <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
                        <div className="flex items-center gap-x-1 text-slate-500">
                            <IconBagde icon={BookOpen} size="sm"/>
                            <span className="ml-1"> {chaptersLength} {chaptersLength === 1 ? "chapter": "chapters"}</span>
                        </div>
                    </div>
                    {progress !== null ? (
                        <CourseProgress value={progress} variant={progress === 100 ? "success" : "default"} size="sm"/>
                    ): (<p className="text-md md:text-sm text-slate-700">{formatPrice(price)}</p>)}
                </div>
            </div>
        </Link>
    );
};

export default CourseCard;
