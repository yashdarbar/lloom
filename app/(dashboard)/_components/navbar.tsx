import React from "react";
import MobileSidebar from "./mobile-sidebar";
import NavBarRoutes from "@/components/navbar-routes";


const NavBar = () => {
    return (
        <div className="dark:bg-black p-4 border-b h-full flex items-center bg-white shadow-sm">
            <MobileSidebar/>
            <NavBarRoutes />
        </div>
    );
};

export default NavBar;
