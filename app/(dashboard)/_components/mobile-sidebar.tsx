import { Menu } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import SideBar from "./sidebar";

const MobileSidebar = () => {
    return (
            <Sheet>
                <SheetTrigger className="md:hidden pr-4 hover:opacity-65 transition dark:bg-black">
                    <Menu />
                </SheetTrigger>
                <SheetContent side="left" className="bg-white p-0">
                    <SideBar/>
                </SheetContent>
            </Sheet>
    );
};

export default MobileSidebar;
