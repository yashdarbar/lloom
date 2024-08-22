import { LucideIcon } from "lucide-react"
import {cva, type VariantProps} from "class-variance-authority"
import { cn } from "@/lib/utils"

const backgroundIcon = cva(
    "rounded-full flex items-center justify-center",
    {
        variants: {
            variant: {
                default: "bg-sky-100",
                success: "bg-emerald-100",
            },
            size: {
                default: "p-2",
                sm: "p-1"
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default"
        }
    }
)

const iconVariants = cva("", {
    variants: {
        variant: {
            default: "text-sky-700",
            success: "text-emerald-700",
        },
        size: {
            default: "h-8 w-8",
            sm: "h-4 w-4"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default",
    }
})


type BackgroundIncoProps = VariantProps<typeof backgroundIcon>
type IconVariantsProps = VariantProps<typeof iconVariants>

interface IconBagdeProps extends BackgroundIncoProps, IconVariantsProps{
    icon: LucideIcon;
};

export const IconBagde = ({
    icon: Icon,
    variant,
    size,
}: IconBagdeProps) => {
    return (
        <div className={cn(backgroundIcon({variant, size}))}>
            <Icon className={cn(iconVariants({variant, size}))}/>
        </div>
    )
}