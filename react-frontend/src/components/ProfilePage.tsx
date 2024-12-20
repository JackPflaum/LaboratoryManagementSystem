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
import CustomInformationCard from "./features/custom-information-card";
import CustomToolbar from "./features/custom-toolbar";

const ProfilePage = () => {
    const [editingProfile, setEditingProfile] = useState<boolean>(false);
    const [searchFilter, setSearchFilter] = useState<string>("");

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchFilter(event.target.value);
    };

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

    const profileInformation = [
        { label: "User ID", data: userDetails?.id ?? "" },
        { label: "Laboratory Position", data: userDetails?.position ?? "" },
        { label: "Email", data: userDetails?.workEmail ?? "" },
        { label: "Phone Number", data: profileDetails?.phoneNumber ?? "" },
        {
            label: "Date started",
            data: userDetails?.dateStarted
                ? format(new Date(userDetails.dateStarted), "dd-MM-yyyy")
                : 'N/A',
        },
    ];

    const toolbarButtons = [
        { label: "Edit Profile", icon: <EditIcon />, onClick: () => setEditingProfile(true) }
    ];

    return (
        <Box>
            <CustomInformationCard title={`${userDetails?.firstName} ${userDetails?.lastName}`} data={profileInformation} />
            <CustomToolbar
                toolbarButtons={toolbarButtons}
                searchFilter={searchFilter}
                handleSearchChange={handleSearchChange}
            />
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