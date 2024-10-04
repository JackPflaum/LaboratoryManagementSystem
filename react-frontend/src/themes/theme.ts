import { createTheme } from "@mui/material";

export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#2196f3', // Blue in hex
        },
        secondary: {
            main: '#c0c0c0', // Silver in hex
        },
        background: {
            default: '#ffffff', // White in hex
            paper: '#e0e0e0', // Light grey in hex
        },
    },
});

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: 'rgb(128, 0, 128)', // Purple in rgb
        },
        secondary: {
            main: 'rgba(255, 165, 0, 0.8)', // Orange with some transparency in rgba
        },
        background: {
            default: 'hsl(0, 0%, 10%)', // Black in hsl
            paper: 'hsl(60, 100%, 50%)', // Yellow in hsl
        },
    },
});
