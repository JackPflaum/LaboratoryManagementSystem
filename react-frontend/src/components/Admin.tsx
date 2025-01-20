import { Add } from "@mui/icons-material";
import CustomToolbar from "./features/custom-toolbar";
import DeleteDialog from "./features/dialogs/delete-dialog";
import DisplayGrid from "./features/display-grid";
import { Button, Typography, Box, useTheme } from "@mui/material";
import { useDeleteUserMutation, useGetUsersQuery, useLogoutMutation } from "../queries/useQueries";
import { useState } from "react";
import UserDialog from "./features/dialogs/user-dialog";
import { UserAttributes } from "../types/interfaces";
import { getUsersColumns } from "./features/grid-columns/users-columns";
import { useAuthAdmin } from "../context/AdminAuthContext";
import PageTitle from "./features/page-title";
import { SearchLabel } from "../types/enums";
import Navbar from "./features/navbar";


interface AdminProps {
    toggleTheme: () => void;
};

const Admin = ({ toggleTheme }: AdminProps) => {

    const [searchFilter, setSearchFilter] = useState<string>("");
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [editingUser, setEditingUser] = useState<UserAttributes | undefined>(undefined);

    // const { handleLogout } = useAuthAdmin();
    const { mutate: logout } = useLogoutMutation();

    const isActiveUser = null;

    // get list of users
    const { data, isLoading } = useGetUsersQuery(searchFilter, isActiveUser);

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

    // edit existing user
    const editAction = (row: UserAttributes) => {
        setEditingUser(row);
        setOpenDialog(true);
    };

    const { mutate: deleteUser, isPending } = useDeleteUserMutation();

    // delete existing user
    const deleteAction = (row: UserAttributes) => {
        if (row) {
            setEditingUser(row);
            setOpenDeleteDialog(true);
        };
    };

    const columns = getUsersColumns({ editAction, deleteAction });

    const toolbarButtons = [
        { label: "Add", icon: <Add />, onClick: () => setOpenDialog(true) }
    ];

    const theme = useTheme();

    return (
        <Box sx={{
            flexGrow: 1,
            paddingLeft: 2,
            paddingRight: 2,
            height: "100vh",
            backgroundColor: theme.palette.background.default
        }}>
            <Navbar toggleTheme={toggleTheme} theme={theme} />
            <Box sx={{
                display: "flex",
                justifyContent: "flex-end",
                paddingTop: 10,
            }}>
                <Button onClick={() => logout()}>Logout</Button>
            </Box>
            <PageTitle title="Admin" />
            <CustomToolbar
                toolbarButtons={toolbarButtons}
                searchLabel={SearchLabel.SEARCH_EMAIL}
                searchFilter={searchFilter}
                handleSearchChange={handleSearchChange}
            />
            <DisplayGrid
                rows={data ?? []}
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
                    id={editingUser?.id}
                    title={editingUser?.activeEmployee === false ? "Reactivate" : undefined}
                    description={`${editingUser?.firstName} ${editingUser?.lastName}`} />
            )}
        </Box>
    )
};

export default Admin;