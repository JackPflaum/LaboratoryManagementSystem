import LightModeIcon from '@mui/icons-material/LightMode';
import NightlightIcon from '@mui/icons-material/Nightlight';
import { AppBar, Box, Switch, Theme, Toolbar, Typography } from '@mui/material';

interface NavbarProps {
    toggleTheme: () => void;
    theme: Theme;
};

const Navbar = ({ toggleTheme, theme }: NavbarProps) => {
    return (
        <AppBar position="fixed" sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
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
    );
};

export default Navbar;