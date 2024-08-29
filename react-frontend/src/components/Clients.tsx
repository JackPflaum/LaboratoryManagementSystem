import { Add } from "@mui/icons-material";
import { Typography } from "@mui/material"
import { useState } from "react";
import ClientDialog from "./features/dialogs/client-dialog";
import DisplayGrid from "./features/display-grid";
import { useGetClientsQuery } from "../queries/useQueries";
import { getClientsColumns } from "./features/grid-columns/clients-column";
import { ClientAttributes } from "../types/interfaces";
import { UserPermissions } from "../types/enums";
import { useHasPermission } from "../hooks/custom-hooks";
import { useNavigate } from "react-router-dom";
import ClientToolbar from "./features/client-toolbar";


const Clients = () => {

    const [searchFilter, setSearchFilter] = useState<string>("");
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [editingClient, setEditingClient] = useState<ClientAttributes | undefined>(undefined);

    // get list of clients
    const { data, isLoading } = useGetClientsQuery(searchFilter);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchFilter(event.target.value);
    };

    const handleCloseDialog = () => {
        setEditingClient(undefined);
        setOpenDialog(false);
    };

    const navigate = useNavigate();

    // view selected client on dedicated page
    const viewAction = (row: ClientAttributes) => {
        navigate(`/clients/${row.id}`);
    };

    // edit existing client
    const editAction = (row: ClientAttributes) => {
        setEditingClient(row);
        setOpenDialog(true);
    };

    // delete existing client
    const deleteAction = (row: ClientAttributes) => {
        // TODO: delete client
        console.log("Delete Client with Id: ", row.id);
    };

    const columns = getClientsColumns(useHasPermission(UserPermissions.ADD_EDIT_CLIENTS) ? {
        viewAction,
        editAction,
        deleteAction
    } : { viewAction })

    return (
        <>
            <Typography variant="h4" sx={{ display: "flex", justifyContent: "center" }}>
                Clients
            </Typography>
            <ClientToolbar
                buttonTitle="Add"
                buttonIcon={<Add />}
                searchFilter={searchFilter}
                handleSearchChange={handleSearchChange}
                setOpenDialog={setOpenDialog}
            />
            <DisplayGrid
                rows={data}
                columns={columns}
                isLoading={isLoading}
            />
            {openDialog && <ClientDialog open={openDialog} handleClose={handleCloseDialog} data={editingClient} />}
        </>
    )
};

export default Clients;