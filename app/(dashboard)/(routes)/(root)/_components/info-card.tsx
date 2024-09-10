import { IconBagde } from "@/components/icon-bagde";
import { LucideIcon } from "lucide-react";

interface InfoCardProps {
    variant: "default" | "success";
    label: string;
    numberOfItems?: number;
    icon: LucideIcon;
}

const InfoCard = ({
    variant,
    icon: Icon,
    label,
    numberOfItems,
}: InfoCardProps) => {
    return (
        <div className="flex items-center gap-x-2 p-3 rounded-md border">
            <IconBagde variant={variant} icon={Icon} />
            <div>
                <p className="font-medium">{label}</p>
                <p className="text-gray-500 text-sm">{numberOfItems} {numberOfItems == 1 ? "Course" : "Courses"}</p>
            </div>
        </div>
    );
};

export default InfoCard;
