import { createTheme } from "@mui/material";

export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: 'rgb(0, 0, 0)',
        },
        secondary: {
            main: '#c0c0c0', // Silver in hex
        },
        background: {
            default: 'rgb(255, 255, 255)',
            paper: '#264653',
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    fontFamily: 'sans-serif', // Apply globally to body
                },
            },
        },
    },
});

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: 'rgb(255, 255, 255)',
        },
        secondary: {
            main: 'rgb(0, 32, 46)',
        },
        background: {
            default: 'rgb(69, 123, 157)',
            paper: '#264653'
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    fontFamily: "sans-serif"
                },
            },
        },
    },
});
