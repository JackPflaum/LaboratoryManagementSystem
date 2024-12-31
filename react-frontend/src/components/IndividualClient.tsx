import { useState } from "react";
import { Typography, Box, Card, CardContent, CardHeader } from "@mui/material";
import DisplayGrid from "./features/display-grid";
import { useGetClientQuery, useGetJobsQuery } from "../queries/useQueries";
import { useNavigate, useParams } from "react-router-dom";
import CustomToolbar from "./features/custom-toolbar";
import ClientDialog from "./features/dialogs/client-dialog";
import EditIcon from '@mui/icons-material/Edit';
import { getJobsColumns } from "./features/grid-columns/jobs-columns";
import { ButtonConfig, JobAttributes } from "../types/interfaces";
import { useHasPermission } from "../hooks/custom-hooks";
import { SearchLabel, UserPermissions } from "../types/enums";
import PageTitle from "./features/page-title";
import CustomInformationCard from "./features/custom-information-card";


const IndividualClient = () => {

    const [searchFilter, setSearchFilter] = useState<string>("");
    const [openDialog, setOpenDialog] = useState<boolean>(false);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchFilter(event.target.value);
    };

    const { id } = useParams<string>()

    // get client data
    const { data: clientData, isLoading: loading } = useGetClientQuery(id);

    // get list of jobs for currently selected client
    const { data: jobsData, isLoading } = useGetJobsQuery(searchFilter, id);

    const navigate = useNavigate();

    const viewAction = (row: JobAttributes) => {
        navigate(`/jobs/${row.jobNumber}`);
    };

    const columns = getJobsColumns({ viewAction });

    const clientInformation = [
        { label: "Email", data: clientData?.email ?? "" },
        { label: "Phone Number", data: clientData?.phoneNumber ?? "" },
        { label: "Address", data: clientData?.fullAddress ?? "" },
        { label: "Purchase Order Number", data: clientData?.purchaseOrderNumber ?? "" },
    ];

    // Check user permissions
    const canEditClient = useHasPermission(UserPermissions.ADD_EDIT_CLIENTS);

    const toolbarButtons: ButtonConfig[] = [
        ...(canEditClient ? [
            { label: "Edit Client", icon: <EditIcon />, onClick: () => setOpenDialog(true) }] : [])
    ];

    return (
        <>
            <Box>
                <CustomInformationCard title={clientData?.name} data={clientInformation} />
                <CustomToolbar
                    toolbarButtons={toolbarButtons}
                    searchFilter={searchFilter}
                    searchLabel={SearchLabel.SEARCH_JOB_NUMBER}
                    handleSearchChange={handleSearchChange}
                />
            </Box>
            <DisplayGrid
                rows={jobsData ?? []}
                columns={columns}
                isLoading={isLoading}
            />
            {openDialog && <ClientDialog open={openDialog} handleClose={() => setOpenDialog(false)} data={clientData} />}
        </>
    );
};

export default IndividualClient;
