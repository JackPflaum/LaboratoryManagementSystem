import { Link, Outlet } from "react-router-dom";
import DashboardIcon from '@mui/icons-material/Dashboard';
import ScienceIcon from '@mui/icons-material/Science';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { useLogoutMutation } from "../queries/useQueries";
import { AppBar, Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Switch, Toolbar, Typography } from "@mui/material";
import { createTheme, PaletteMode } from "@mui/material/styles";
import { useEffect, useMemo, useState } from "react";
import LightModeIcon from '@mui/icons-material/LightMode';
import NightlightIcon from '@mui/icons-material/Nightlight';


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

    // get saved theme from storage or default to "light"
    const [themeMode, setThemeMode] = useState<PaletteMode>("light");

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") ?? "light";
        setThemeMode(savedTheme as PaletteMode);
    }, []);

    const theme = useMemo(() => createTheme({
        palette: {
            mode: themeMode,
            primary: { main: themeMode === "light" ? "#1976d2" : "#90caf9" },
        },
    }), [themeMode]);

    const toggleTheme = () => {
        const newTheme: PaletteMode = themeMode === "light" ? "dark" : "light";
        setThemeMode(newTheme);
        localStorage.setItem("theme", newTheme);
    };

    const drawerWidth = 240;

    const listItemButtonStyle = (itemTo: string) => ({
        listDecoration: "none",
        color: itemTo ? theme.palette.primary.main : "inherit"
    });

    return (
        <Box sx={{ display: "flex" }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar sx={{ justifyContent: "space-between" }}>
                    <Typography variant="h6" noWrap component="div">
                        Laboratory Management System
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {themeMode === "light" ? (
                            <LightModeIcon />
                        ) : (
                            <NightlightIcon />
                        )}
                        <Switch checked={themeMode === "dark"} onChange={toggleTheme} defaultChecked color="default" />
                    </Box>
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
                            <ListItem key={item.title} component={Link} to={item.to}
                                style={listItemButtonStyle(`/${item.to}`)}
                            >
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
                                <ListItemButton key={item.title} onClick={() => logoutUser()}
                                    style={listItemButtonStyle(`/${item.to}`)}
                                >
                                    <ListItemIcon>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.title} />
                                </ListItemButton>
                            ) : (
                                <ListItem key={item.title} component={Link} to={item.to}
                                    style={listItemButtonStyle(`/${item.to}`)}
                                >
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
            <Box sx={{
                flexGrow: 1,
                // p: 3,
                background: "rgb(30, 85, 92)",
                height: `calc(100vh - 32px)`,
                padding: 2,
            }}>
                <Toolbar />
                <Outlet />
            </Box>
        </Box>

    )
};

export default NavigationSidebar;
