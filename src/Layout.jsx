import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import NavBar from "./components/navBar";
import { GrDashboard } from "react-icons/gr";
import { FaMapMarkedAlt } from "react-icons/fa";
import { MdLocalShipping } from "react-icons/md";
import { Toaster,toast } from "react-hot-toast";
function Layout() {
    const [menu,setMenu] = useState(false)
    // useEffect(()=>{toast.success("Bienvenu Brayann",{position:'top-right'})},[])
    return (
        <div className="min-h-screen w-full bg-zinc-300 dark:bg-zinc-900 transition-colors duration-300">
            <Toaster />
            <div className="grid grid-cols-5 gap-2 p-4 auto-rows-[70px]">
                <div className="col-span-5 row-span-1 w-full">
                    <NavBar menu={menu} setMenu={setMenu}/>
                </div>
                <div className="flex items-center flex-row justify-evenly col-span-5 lg:row-span-10 lg:col-span-1  lg:flex-col lg:items-start lg:justify-start bg-black text-white dark:bg-[green] rounded-xl p-2 lg:gap-10 lg:p-4 lg:mr-[50px] lg:py-10">
                    <Link to={"/"} className="flex items-center gap-2 transition-transform duration-700 lg:hover:translate-x-2 hover:bg-[green] hover:btn ">
                        <GrDashboard size={25} className="dark:text-black text-white"/>
                        <span className="hidden md:flex dark:text-black font-bold">Dashboard</span>
                    </Link>
                    <Link to={"/"} className="flex items-center gap-2 transition-transform duration-700 lg:hover:translate-x-2 hover:bg-[green] hover:btn ">
                        <FaMapMarkedAlt size={25} className="dark:text-black text-white"/>
                        <span className="hidden md:flex dark:text-black font-bold">Trajets</span>
                    </Link>
                    <Link to={"/"} className="flex items-center gap-2 transition-transform duration-700 lg:hover:translate-x-2 hover:bg-[green] hover:btn ">
                        <MdLocalShipping size={25} className="dark:text-black text-white"/>
                        <span className="hidden md:flex dark:text-black font-bold">Lignes</span>
                    </Link>
                </div>
                <div className="flex items-start justify-start col-span-5 row-span-10 lg:col-span-4">
                    <Outlet />
                </div>
                
            </div>   
        </div>
    );
}

export default Layout;