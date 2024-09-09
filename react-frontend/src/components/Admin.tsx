import { Add } from "@mui/icons-material";
import ClientToolbar from "./features/client-toolbar";
import DeleteDialog from "./features/dialogs/delete-dialog";
import DisplayGrid from "./features/display-grid";
import { Typography } from "@mui/material";
import { useDeleteUserMutation } from "../queries/useQueries";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import UserDialog from "./features/dialogs/user-dialog";


const Admin = () => {

    const [searchFilter, setSearchFilter] = useState<string>("");
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [editingUser, setEditingUser] = useState<UserAttributes | undefined>(undefined);

    // get list of users
    const { data, isLoading } = useGetUsersQuery(searchFilter);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchFilter(event.target.value);
    };

    const handleCloseDialog = () => {
        setEditingUser(undefined);
        setOpenDialog(false);
    };

    const handleCloseDeleteDialog = () => {
        setEditingUser(undefined);
        setOpenDeleteDialog(false);
    };

    const navigate = useNavigate();

    // edit existing user
    const editAction = (row: UserAttributes) => {
        setEditingAdmin(row);
        setOpenDialog(true);
    };

    const { mutate: deleteUser } = useDeleteUserMutation();

    // delete existing user
    const deleteAction = (row: UserAttributes) => {
        if (row) {
            setEditingUser(row);
            setOpenDeleteDialog(true);
        };
    };

    const columns = getUsersColumns({ editAction, deleteAction });

    return (
        <>
            <Typography variant="h4" sx={{ display: "flex", justifyContent: "center" }}>
                Admin
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
            {openDialog && <UserDialog open={openDialog} handleClose={handleCloseDialog} data={editingUser} />}
            {openDeleteDialog && (
                <DeleteDialog
                    open={openDeleteDialog}
                    handleClose={handleCloseDeleteDialog}
                    handleDelete={deleteUser}
                    isPending={isPending}
                    id={editingUser.id}
                    description={editingUser.fullname} />
            )}
        </>
    )
};

export default Admin;