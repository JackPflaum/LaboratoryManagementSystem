import { Drawer, Box, Divider, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { Outlet, Link } from "react-router-dom";
import DashboardIcon from '@mui/icons-material/Dashboard';
import ScienceIcon from '@mui/icons-material/Science';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';


const navigationLinks = [
    {
        title: "Dashboard",
        icon: <DashboardIcon />,
        path: "/dashboard"
    },
    {
        title: "Jobs",
        icon: <ScienceIcon />,
        path: "/jobs"
    },

    {
        title: "Clients",
        icon: <BusinessIcon />,
        path: "/clients"
    },
    {
        title: "User",
        icon: <PersonIcon />,
        path: "/users"
    }
];

// set width of navigation sidebar
const drawerWidth = 240;

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,    // necessary for Drawer content to appear below AppBar(toolbar)
    justifyContent: "flex-end",
}));


// custom Main component holds main content of website.
// the styling is adjusted based upon nav sidebar being open or closed.
const MainContent = styled("main", {
    shouldForwardProp: (prop) => prop !== "open"
})<{ open?: boolean }>(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
    }),
    ...(open && {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        }),
        marginLeft: `${drawerWidth}px`
    }),
}));


interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}


// custom MuiAppBar as AppBar holds navigation links.
// the sidebar transitions in and out.
const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
    transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        }),
    }),
}));


interface NavigationSidebarProps {
    mainComponent: React.ReactNode;
};

const NavigationSidebar = () => {
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

    return (
        <Box sx={{ display: "flex" }}>
            <AppBar position="fixed" open={drawerOpen}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={() => setDrawerOpen(true)}
                        sx={{ mr: 2, ...(drawerOpen && { display: "none" }) }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Laboratory Management System
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="temporary"
                anchor="left"
                open={drawerOpen}
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: "border-box"
                    }
                }}
            >
                <DrawerHeader>
                    <IconButton onClick={() => setDrawerOpen(false)}>
                        <ChevronLeftIcon />
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    {navigationLinks.map((link, index) => (
                        <ListItem key={link.title} disablePadding sx={{ display: "block" }}>
                            <ListItemButton component={Link} to={link.path}>
                                <ListItemIcon>
                                    {link.icon}
                                </ListItemIcon>
                                <ListItemText primary={link.title} />
                            </ListItemButton>
                        </ListItem>
                    ))}

                </List>
            </Drawer>
            <MainContent open={drawerOpen}>
                <DrawerHeader />
                <Outlet />
            </MainContent>
        </Box >
    )
};

export default NavigationSidebar;
