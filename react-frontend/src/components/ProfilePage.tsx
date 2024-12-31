import { useState } from "react";
import { Alert, Box } from "@mui/material";
import ProfileDialog from "./features/dialogs/profile-dialog";
import { useNavigate } from "react-router-dom";
import { SampleAttributes } from "../types/interfaces";
import { useGetSamplesQuery, useGetUserProfile as useGetUserProfileQuery, useGetUserQuery } from "../queries/useQueries";
import { useAuthUser } from "../context/UserAuthContext";
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import EditIcon from '@mui/icons-material/Edit';
import DisplayGrid from "./features/display-grid";
import { getSamplesColumns } from "./features/grid-columns/samples-columns";
import { useHasPermission } from "../hooks/custom-hooks";
import { SearchLabel, UserPermissions } from "../types/enums";
import CustomInformationCard from "./features/custom-information-card";
import CustomToolbar from "./features/custom-toolbar";
import { formatDate } from "./features/grid-columns/jobs-columns";
import ResultsDialog from "./features/dialogs/results-dialog";
import ChangePassword from "./ChangePassword";

const ProfilePage = () => {
    const [editingProfile, setEditingProfile] = useState<boolean>(false);
    const [searchFilter, setSearchFilter] = useState<string>("");
    const [editingResults, setEditingResults] = useState<SampleAttributes | undefined>(undefined);
    const [updatingPassword, setUpdatingPassword] = useState<boolean>(false);

    // change password alert
    const [alert, setAlert] = useState<
        { message: string; severity: "error" | "info" | "success" | "warning" }
    >({ message: "", severity: "success" });

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchFilter(event.target.value);
    };

    const handleCloseDialog = () => {
        setEditingProfile(false);
    };

    const { user } = useAuthUser();

    const userId = user?.id?.toString();

    const { data: userDetails, isLoading } = useGetUserQuery(userId);

    // no jobNumber required
    const jobNumber = "";

    const { data: samplesData, isLoading: pending } = useGetSamplesQuery(searchFilter, jobNumber, userId);


    const navigate = useNavigate();

    const viewJobAction = (sample: SampleAttributes) => {
        navigate(`/jobs/${sample.jobNumber}`);
    };

    // add sample test results
    const editResultsAction = (row: SampleAttributes) => {
        setEditingResults(row);
    };

    const columns = getSamplesColumns(useHasPermission(UserPermissions.ADD_EDIT_JOBS) ? {
        viewJobAction,
        editResultsAction
    } : {
        viewJobAction,
    });

    const profileInformation = [
        { label: "User ID", data: userDetails?.id ?? "N/A" },
        { label: "Laboratory Position", data: userDetails?.position ?? "N/A" },
        { label: "Work Email", data: userDetails?.workEmail ?? "N/A" },
        { label: "Personal Email", data: userDetails?.profile?.personalEmail || "Not yet provided" },
        { label: "Phone Number", data: userDetails?.profile?.phoneNumber || "Not yet provided" },
        {
            label: "Date started",
            data: userDetails?.dateStarted
                ? formatDate(userDetails?.dateStarted)
                : 'N/A'
        },
    ];

    const toolbarButtons = [
        { label: "Update Password", icon: <VpnKeyIcon />, onClick: () => setUpdatingPassword(true) },
        { label: "Edit Profile", icon: <EditIcon />, onClick: () => setEditingProfile(true) }
    ];

    return (
        <Box>
            {alert.message && <Alert severity={alert.severity} sx={{ mb: 2 }}>{alert.message}</Alert>}
            <CustomInformationCard title={`${userDetails?.firstName} ${userDetails?.lastName}`} data={profileInformation} />
            <CustomToolbar
                toolbarButtons={toolbarButtons}
                searchFilter={searchFilter}
                searchLabel={SearchLabel.SEARCH_SAMPLE_NUMBER}
                handleSearchChange={handleSearchChange}
            />
            {updatingPassword &&
                <ChangePassword
                    open={updatingPassword}
                    handleClose={() => setUpdatingPassword(false)}
                    setAlert={setAlert}
                />
            }
            {editingProfile && <ProfileDialog data={userDetails} open={!!editingProfile} handleClose={handleCloseDialog} />}
            {editingResults &&
                <ResultsDialog
                    data={editingResults}
                    open={!!editingResults}
                    handleClose={() => setEditingResults(undefined)}
                />
            }
            <DisplayGrid
                rows={samplesData ?? []}
                columns={columns}
                isLoading={pending}
            />
        </Box>
    );
};

export default ProfilePage;