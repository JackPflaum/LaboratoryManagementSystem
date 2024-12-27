import { Add } from "@mui/icons-material";
import { Typography } from "@mui/material"
import { useState } from "react";
import ClientDialog from "./features/dialogs/client-dialog";
import DisplayGrid from "./features/display-grid";
import { useDeleteClientMutation, useGetClientsQuery } from "../queries/useQueries";
import { getClientsColumns } from "./features/grid-columns/clients-column";
import { ClientAttributes } from "../types/interfaces";
import { SearchLabel, UserPermissions } from "../types/enums";
import { useHasPermission } from "../hooks/custom-hooks";
import { useNavigate } from "react-router-dom";
import CustomToolbar from "./features/custom-toolbar";
import DeleteDialog from "./features/dialogs/delete-dialog";
import PageTitle from "./features/page-title";


const Clients = () => {

    const [searchFilter, setSearchFilter] = useState<string>("");
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
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

    const handleCloseDeleteDialog = () => {
        setEditingClient(undefined);
        setOpenDeleteDialog(false);
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

    const { mutate: deleteClient, isPending } = useDeleteClientMutation();

    // delete existing client
    const deleteAction = (row: ClientAttributes) => {
        setEditingClient(row);
        setOpenDeleteDialog(true);
    };

    const columns = getClientsColumns(useHasPermission(UserPermissions.ADD_EDIT_CLIENTS) ? {
        viewAction,
        editAction,
        deleteAction
    } : { viewAction })

    const toolbarButtons = [
        { label: "Add", icon: <Add />, onClick: () => setOpenDialog(true) }
    ];

    return (
        <>
            <PageTitle title="Clients" />
            <CustomToolbar
                toolbarButtons={toolbarButtons}
                searchFilter={searchFilter}
                searchLabel={SearchLabel.SEARCH_CLIENT_NAME}
                handleSearchChange={handleSearchChange}
            />
            <DisplayGrid
                rows={data ?? []}
                columns={columns}
                isLoading={isLoading}
            />
            {openDialog && <ClientDialog open={openDialog} handleClose={handleCloseDialog} data={editingClient} />}
            {openDeleteDialog && (
                <DeleteDialog
                    open={openDeleteDialog}
                    handleClose={handleCloseDeleteDialog}
                    handleDelete={deleteClient}
                    isPending={isPending}
                    id={editingClient?.id}
                    description={editingClient?.name} />
            )}
        </>
    )
};

export default Clients;