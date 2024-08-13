import { Add } from "@mui/icons-material";
import { Box, Button, Container, TextField, Typography } from "@mui/material"
import { useState } from "react";
import ClientDialog from "./features/dialogs/client-dialog";


const Clients = () => {

    const [searchFilter, setSearchFilter] = useState<string>("");
    const [openDialog, setOpenDialog] = useState<boolean>(false);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchFilter(event.target.value);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return (
        <Container>
            <Typography variant="h4" sx={{ display: "flex", justifyContent: "center" }}>
                Clients
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-evenly",
                }}
            >
                <TextField
                    label="Search"
                    type="search"
                    variant="outlined"
                    value={searchFilter}
                    onChange={handleSearchChange}
                />
                <Button variant="contained" startIcon={<Add />} onClick={() => setOpenDialog(true)}>
                    Add
                </Button>
            </Box>
            {openDialog && <ClientDialog open={openDialog} handleClose={handleCloseDialog} />}
        </Container>
    )
};

export default Clients;