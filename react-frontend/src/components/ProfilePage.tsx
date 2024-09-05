import { useState } from "react";
import { Typography, Box } from "@mui/material";
import ProfileDialog from "./features/dialogs/profile-dialog";

const ProfilePage = () => {
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [editingProfile, setEditingProfile] = useState<ProfileAttributes | undefined>(undefined);

    const handleCloseDialog = () => {
        setEditingProfile(undefined);
        setOpenDialog(false);
    };

    const { id } = useParams<string>();

    const { data, isLoading: loading } = useGetUserProfile(id);

    return (
        <Box>
            <Typography component="h2">{data?.name}</Typography>
            <p>User ID: {data?.id}</p>
            <p>Laboratory Position: {data?.laboratoryPosition}</p>
            <p>Email: {data?.email}</p>
            <p>Phone Number: {data?.phoneNumber}</p>
            <p>Date started: {data?.dateStarted}</p>
            {editingProfile && <ProfileDialog data={data} open={openDialog} handleClose={handleCloseDialog} />}
        </Box>
    );
};

export default ProfilePage;