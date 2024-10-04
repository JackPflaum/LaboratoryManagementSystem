import { Outlet } from "react-router-dom";
import BiotechIcon from '@mui/icons-material/Biotech';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ScienceIcon from '@mui/icons-material/Science';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuthUser } from "../context/UserAuthContext";
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { AppProvider } from "@toolpad/core";
import type { Navigation } from '@toolpad/core';
import { darkTheme, lightTheme } from "../themes/theme";

const NavigationSidebar = () => {

    const { user, isLoading } = useAuthUser();

    const navigationLinks: Navigation = [
        {
            kind: "header",
            title: "Main Items",
        },
        {
            title: "Dashboard",
            icon: <DashboardIcon />,
            segment: "dashboard"
        },
        {
            title: "Jobs",
            icon: <ScienceIcon />,
            segment: "jobs"
        },

        {
            title: "Clients",
            icon: <BusinessIcon />,
            segment: "clients"
        },
        {
            kind: "divider",
        }
    ];

    if (user) {
        console.log("USER:", user);
        navigationLinks.push({
            title: "User",
            icon: <PersonIcon />,
            segment: `user/${user.id}`,
        })
    };

    return (
        <AppProvider
            navigation={navigationLinks}
            branding={{
                // logo: <BiotechIcon />,
                title: "Laboratory Management System"
            }}
            theme={{ light: lightTheme, dark: darkTheme }}
        >
            <DashboardLayout disableCollapsibleSidebar>
                <Outlet />
            </DashboardLayout>
        </AppProvider>

    )
};

export default NavigationSidebar;
