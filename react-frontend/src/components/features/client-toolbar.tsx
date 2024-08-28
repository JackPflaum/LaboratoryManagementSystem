import { Box, TextField, Button } from "@mui/material";
import { ReactNode } from "react";

interface ClientToolbarProps {
    buttonTitle: string;
    buttonIcon: ReactNode;
    searchFilter: string;
    handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    setOpenDialog: (open: boolean) => void;
};

const ClientToolbar = ({ buttonTitle, buttonIcon, searchFilter, handleSearchChange, setOpenDialog }: ClientToolbarProps) => {
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
                label="Search"
                type="search"
                variant="outlined"
                value={searchFilter}
                onChange={handleSearchChange}
                size="small"
            />
            <Button variant="contained" startIcon={buttonIcon} onClick={() => setOpenDialog(true)}>
                {buttonTitle}
            </Button>
        </Box>
    );
};

export default ClientToolbar;