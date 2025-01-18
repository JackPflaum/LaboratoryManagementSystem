import React, { useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserAuthProvider } from "./context/UserAuthContext";
import { AdminAuthProvider } from './context/AdminAuthContext';
import { ThemeProvider } from '@emotion/react';
import { darkTheme, lightTheme } from './themes/theme';

// Roboto font
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { PaletteMode } from '@mui/material';

// create a client instance
const queryClient = new QueryClient();

console.log("index.tsx refreshed");

const Index = () => {
    const [themeMode, setThemeMode] = useState<PaletteMode>("light");

    // get saved theme from storage or default to "light"
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") ?? "light";
        setThemeMode(savedTheme as PaletteMode);
    }, []);

    const toggleTheme = () => {
        const newTheme: PaletteMode = themeMode === "light" ? "dark" : "light";
        setThemeMode(newTheme);
        localStorage.setItem("theme", newTheme);
    };

    const theme = useMemo(() => (themeMode === "light" ? lightTheme : darkTheme), [themeMode]);

    return (
        <QueryClientProvider client={queryClient}>
            <UserAuthProvider>
                <AdminAuthProvider>
                    <ThemeProvider theme={theme}>
                        <App toggleTheme={toggleTheme} />
                    </ThemeProvider>
                </AdminAuthProvider>
            </UserAuthProvider>
        </QueryClientProvider>
    );
};

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(<Index />);

reportWebVitals();
