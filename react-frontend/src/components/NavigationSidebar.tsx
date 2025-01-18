import { Link, Outlet } from "react-router-dom";
import DashboardIcon from '@mui/icons-material/Dashboard';
import ScienceIcon from '@mui/icons-material/Science';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { useLogoutMutation } from "../queries/useQueries";
import { AppBar, Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Switch, Toolbar, Typography, useTheme } from "@mui/material";
import LightModeIcon from '@mui/icons-material/LightMode';
import NightlightIcon from '@mui/icons-material/Nightlight';


interface NavigationSidebarProps {
    toggleTheme: () => void;
};

const NavigationSidebar = ({ toggleTheme }: NavigationSidebarProps) => {

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

    const theme = useTheme();

    const drawerWidth = 240;

    const listItemButtonStyle = (itemTo: string) => ({
        testDecoration: "none",
        color: itemTo ? theme.palette.primary.main : "inherit",
    });

    const sharedListItemStyle = {
        display: "flex",
        alignItems: "center",
        width: "100%",
        color: theme.palette.primary.main,
        "&:hover": {
            color: theme.palette.secondary.main
        }
    };

    return (
        <Box sx={{ display: "flex" }}>
            <AppBar position="fixed" sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                backgroundColor: "rgb(8, 72, 99)"
            }}
            >
                <Toolbar sx={{ justifyContent: "space-between", backgroundColor: "rgb(0, 65, 92)" }}>
                    <Typography variant="h6" noWrap component="div">
                        Laboratory Management System
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {theme.palette.mode === "light" ? (
                            <LightModeIcon />
                        ) : (
                            <NightlightIcon />
                        )}
                        <Switch checked={theme.palette.mode === "dark"} onChange={toggleTheme} defaultChecked color="default" />
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
                        boxSizing: "border-box",
                        backgroundColor: theme.palette.background.default,
                    },
                }}>
                <Toolbar />
                <Box sx={{ overflow: "auto", padding: 2, backgroundColor: theme.palette.background.default, }}>
                    <List>
                        {navigationLinks.map((item) => (
                            <ListItem key={item.title} component={Link} to={item.to}
                                style={listItemButtonStyle(`/${item.to}`)}
                            >
                                <Box sx={sharedListItemStyle}>
                                    <ListItemIcon>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.title} />
                                </Box>
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
                                    <Box sx={sharedListItemStyle}>
                                        <ListItemIcon>
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={item.title} />
                                    </Box>
                                </ListItemButton>
                            ) : (
                                <ListItem key={item.title} component={Link} to={item.to}
                                    style={listItemButtonStyle(`/${item.to}`)}
                                >
                                    <Box sx={sharedListItemStyle}>
                                        <ListItemIcon>
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={item.title} />
                                    </Box>
                                </ListItem>
                            )
                        ))}
                    </List>
                </Box>
            </Drawer>
            <Box sx={{
                flexGrow: 1,
                padding: 2,
                background: theme.palette.background.default,
                height: `calc(100vh - 32px)`,
            }}>
                <Toolbar />
                <Outlet />
            </Box>
        </Box>

    )
};

export default NavigationSidebar;
