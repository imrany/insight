import { Outlet, Link, useLocation } from "react-router-dom";
import Sidebar from "@/components/Sidebar"

export default function Layout(){
    return(
        <>
            <Sidebar/>
            <div>
                <Outlet/>
            </div>
        </>
    )
}
