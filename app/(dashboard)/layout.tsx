import NavBar from "./_components/navbar";
import SideBar from "./_components/sidebar";


const dashBoardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="h-full dark:bg-black">
            <div className="h-[80px] w-full md:pl-56 fixed z-50 inset-y-0">
                <NavBar />
            </div>
            <div className="hidden md:flex h-full w-56 flex-col fixed z-50 inset-y-0">
                <SideBar />
            </div>
            <main className="md:ml-56 pt-[80px]">{children}</main>
        </div>
    );
};

export default dashBoardLayout;
