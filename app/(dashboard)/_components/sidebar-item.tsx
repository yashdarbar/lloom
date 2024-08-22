"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";


interface SideBarItemProps {
    icon: LucideIcon;
    href: string;
    label: string;
}

const SideBarItem = ({ icon: Icon, href, label }: SideBarItemProps) => {
    const pathname = usePathname();
    const router = useRouter();

    const isActive = (pathname === "/" && href === "/") || pathname === href || pathname?.startsWith(`${href}/`);

    const onClick = () => {
        router.push(href);
    }

    return (
        <div className="w-full flex flex-col h-full">
            <button
                onClick={onClick}
                type="button"
                className={cn(
                    "flex items-center gap-x-1.5 text-[#7AB2B2] font-[500] text-sm pl-10 transition-all hover:text-[#4D869C] hover:bg-[#CDE8E5]",
                    isActive && "bg-[#CDE8E5] text-[#4D869C]"
                )}
            >
                <div className="flex items-center gap-x-2 py-4">
                    <div>
                        <Icon />
                    </div>
                    {label}
                </div>
                <div
                    className={cn(
                        "ml-auto opacity-0 h-full transition-all border-2 border-[#4D869C]",
                        isActive && "opacity-100"
                    )}
                />
            </button>
        </div>
    );
};

export default SideBarItem;
