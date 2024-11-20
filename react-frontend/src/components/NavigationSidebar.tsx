import { Link, Outlet } from "react-router-dom";
import DashboardIcon from '@mui/icons-material/Dashboard';
import ScienceIcon from '@mui/icons-material/Science';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { useLogoutMutation } from "../queries/useQueries";
import { AppBar, Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from "@mui/material";


const NavigationSidebar = () => {

    const navigationLinks = [
        {
            title: "Dashboard",
            icon: <DashboardIcon />,
            to: "dashboard"
        },
        {
            title: "Jobs",
            icon: <ScienceIcon />,
            to: "jobs"
        },

        {
            title: "Clients",
            icon: <BusinessIcon />,
            to: "clients"
        },
    ];

    const userLinks = [
        {
            title: "User",
            icon: <PersonIcon />,
            to: "user",
        },
        {
            title: "Logout",
            icon: <LogoutIcon />,
            to: "/"
        }
    ];

    const { mutate: logoutUser } = useLogoutMutation();

    const drawerWidth = 240;

    return (
        <Box sx={{ display: "flex" }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        Laboratory Management System
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]:
                    {
                        width: drawerWidth,
                        boxSizing: "border-box"
                    },
                }}>
                <Toolbar />
                <Box sx={{ overflow: "auto", padding: 2 }}>
                    <List>
                        {navigationLinks.map((item) => (
                            <ListItem key={item.title} component={Link} to={item.to}>
                                <ListItemIcon>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.title} />
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                    <List>
                        {userLinks.map((item) => (
                            item.title === "Logout" ? (
                                <ListItemButton key={item.title} onClick={() => logoutUser()}>
                                    <ListItemIcon>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.title} />
                                </ListItemButton>
                            ) : (
                                <ListItem key={item.title} component={Link} to={item.to}>
                                    <ListItemIcon>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.title} />
                                </ListItem>
                            )
                        ))}
                    </List>
                </Box>
            </Drawer>
            <Box sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <Outlet />
            </Box>
        </Box>

    )
};

export default NavigationSidebar;
