import { useState } from "react";
import { Typography, Box, Button } from "@mui/material";
import ProfileDialog from "./features/dialogs/profile-dialog";
import { useNavigate, useParams } from "react-router-dom";
import { ProfileAttributes, SampleAttributes } from "../types/interfaces";
import { useGetSamplesQuery, useGetUserProfile as useGetUserProfileQuery, useGetUserQuery } from "../queries/useQueries";
import { useAuthUser } from "../context/UserAuthContext";
import EditIcon from '@mui/icons-material/Edit';
import DisplayGrid from "./features/display-grid";
import { getSamplesColumns } from "./features/grid-columns/samples-columns";
import { useHasPermission } from "../hooks/custom-hooks";
import { UserPermissions } from "../types/enums";
import { format } from "date-fns";

const ProfilePage = () => {
    const [editingProfile, setEditingProfile] = useState<boolean>(false);

    const handleCloseDialog = () => {
        setEditingProfile(false);
    };

    const { user } = useAuthUser();

    const userId = user?.id?.toString();

    const { data: userDetails, isLoading } = useGetUserQuery(userId);

    const { data: profileDetails, isLoading: loading } = useGetUserProfileQuery(userId);

    const { data: samplesData, isLoading: pending } = useGetSamplesQuery("", userId);


    const navigate = useNavigate();

    const viewJobAction = (sample: SampleAttributes) => {
        navigate(`job/${sample.jobNumber}`);
    };

    const editResultsAction = () => {
        //TODO: open results dialog and allow results mutation.
    };

    const columns = getSamplesColumns(useHasPermission(UserPermissions.ADD_EDIT_JOBS) ? {
        viewJobAction,
        editResultsAction
    } : { editResultsAction });

    return (
        <Box>
            <Typography component="h2">{`${userDetails?.firstName} ${userDetails?.lastName}`}</Typography>
            <p>User ID: {userDetails?.id}</p>
            <p>Laboratory Position: {userDetails?.position}</p>
            <p>Email: {userDetails?.workEmail}</p>
            <p>Phone Number: {profileDetails?.phoneNumber}</p>
            <p>Date started: {userDetails?.dateStarted ? format(new Date(userDetails.dateStarted), "dd-MM-yyyy") : 'N/A'}</p>
            <Button sx={{ marginBottom: 2 }} variant="contained" startIcon={<EditIcon />} onClick={() => setEditingProfile(true)}>
                Edit Profile
            </Button>
            {editingProfile && <ProfileDialog data={profileDetails} open={!!editingProfile} handleClose={handleCloseDialog} />}
            <DisplayGrid
                rows={samplesData ?? []}
                columns={columns}
                isLoading={pending}
            />
        </Box>
    );
};

export default ProfilePage;