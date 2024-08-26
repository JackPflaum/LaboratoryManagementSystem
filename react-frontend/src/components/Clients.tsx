import { Add } from "@mui/icons-material";
import { Box, Button, Container, TextField, Typography } from "@mui/material"
import { useState } from "react";
import ClientDialog from "./features/dialogs/client-dialog";
import DisplayGrid from "./features/display-grid";
import { useGetClientsQuery } from "../queries/useQueries";
import { getClientsColumns } from "./features/grid-columns/clients-column";
import { ClientAttributes } from "../types/interfaces";
import { UserPermissions } from "../types/enums";
import { useHasPermission } from "../hooks/custom-hooks";


const Clients = () => {

    const [searchFilter, setSearchFilter] = useState<string>("");
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [editingClient, setEditingClient] = useState<ClientAttributes | undefined>(undefined);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchFilter(event.target.value);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const editAction = (row: ClientAttributes) => {
        setEditingClient(row);
        setOpenDialog(true);
    };

    const deleteAction = (id: number | undefined) => {
        // TODO: delete client
        console.log("Delete Client with Id: ", id);
    };

    console.log("HAS PERMISSION: ", useHasPermission(UserPermissions.ADD_EDIT_CLIENTS));

    // const columns = getClientsColumns(useHasPermission(UserPermissions.ADD_EDIT_CLIENTS) ? { editAction, deleteAction } : {})
    const columns = getClientsColumns({ editAction, deleteAction })

    const { data, isLoading } = useGetClientsQuery();

    return (
        <Container>
            <Typography variant="h4" sx={{ display: "flex", justifyContent: "center" }}>
                Clients
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-evenly",
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
                <Button variant="contained" startIcon={<Add />} onClick={() => setOpenDialog(true)}>
                    Add
                </Button>
            </Box>
            <DisplayGrid
                rows={data ?? []}
                columns={columns}
                isLoading={isLoading}
            />
            {openDialog && <ClientDialog open={openDialog} handleClose={handleCloseDialog} data={editingClient} />}
        </Container>
    )
};

export default Clients;