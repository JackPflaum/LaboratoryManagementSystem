import NavigationSidebar from "./NavigationSidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <NavigationSidebar mainComponent={<Outlet />} />
    )
};

export default Layout;