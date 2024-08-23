import { Add } from "@mui/icons-material";
import { Box, Button, Container, TextField, Typography } from "@mui/material"
import { useState } from "react";
import ClientDialog from "./features/dialogs/client-dialog";
import DisplayGrid from "./features/display-grid";
import { useGetClientsQuery } from "../queries/useQueries";
import { getClientsColumns } from "./features/grid-columns/clients-column";


const Clients = () => {

    const [searchFilter, setSearchFilter] = useState<string>("");
    const [openDialog, setOpenDialog] = useState<boolean>(false);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchFilter(event.target.value);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const columns = getClientsColumns();

    const { data, isLoading } = useGetClientsQuery();

    console.log("DATA: ", data);


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
                    size="small"
                />
                <Button variant="contained" startIcon={<Add />} onClick={() => setOpenDialog(true)}>
                    Add
                </Button>
            </Box>
            <DisplayGrid
                rows={data ?? []}
                columns={columns}
                isLoading={isLoading}
            />
            {openDialog && <ClientDialog open={openDialog} handleClose={handleCloseDialog} />}
        </Container>
    )
};

export default Clients;