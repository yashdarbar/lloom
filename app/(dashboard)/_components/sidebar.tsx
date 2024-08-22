import Logo from "./logo";
import SideBarRoutes from "./sidebar-routes";

const SideBar = () => {
    return (
        <div className="h-full flex flex-col border-r bg-white overflow-y-auto dark:bg-black">
            <div className="p-3">
                <Logo />
            </div>
            <div className="w-full flex flex-col">
                <SideBarRoutes />
            </div>
        </div>
    );
};

export default SideBar;
