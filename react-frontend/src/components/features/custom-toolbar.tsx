import { Box, TextField, Button } from "@mui/material";
import { ReactNode } from "react";

interface ButtonConfig {
    label: string;
    icon: ReactNode;
    onClick: () => void;
};

interface ClientToolbarProps {
    toolbarButtons: ButtonConfig[];
    searchLabel?: string;
    searchFilter: string;
    handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const CustomToolbar = ({ toolbarButtons, searchLabel, searchFilter, handleSearchChange }: ClientToolbarProps) => {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 4,
                marginBottom: 2
            }}
        >
            <TextField
                label={searchLabel ?? "Search"}
                type="search"
                variant="outlined"
                value={searchFilter}
                onChange={handleSearchChange}
                size="small"
            />
            <Box sx={{ display: "flex", gap: 1 }}>
                {toolbarButtons.map((button, index) => (
                    <Button
                        key={index}
                        variant="contained"
                        startIcon={button.icon}
                        onClick={button.onClick}
                    >
                        {button.label}
                    </Button>
                ))}
            </Box>
        </Box>
    );
};

export default CustomToolbar;