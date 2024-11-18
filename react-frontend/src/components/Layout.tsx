import { Link, Outlet } from "react-router-dom";
import { useAuthUser } from "../context/UserAuthContext";
import { AdminContextAttributes, UserContextAttributes } from "../types/interfaces";
import NavigationSidebar from "./NavigationSidebar";

interface LayoutProps {
    user?: UserContextAttributes | null,
};

const Layout = ({ user }: LayoutProps) => {

    return (
        <NavigationSidebar user={user} />
    );
};

export default Layout;