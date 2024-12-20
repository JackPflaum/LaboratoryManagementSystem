import { useState } from "react";
import { Typography, Box, Card, CardContent, CardHeader } from "@mui/material";
import DisplayGrid from "./features/display-grid";
import { useGetClientQuery, useGetJobsQuery } from "../queries/useQueries";
import { useNavigate, useParams } from "react-router-dom";
import CustomToolbar from "./features/custom-toolbar";
import ClientDialog from "./features/dialogs/client-dialog";
import EditIcon from '@mui/icons-material/Edit';
import { getJobsColumns } from "./features/grid-columns/jobs-columns";
import { JobAttributes } from "../types/interfaces";
import { useHasPermission } from "../hooks/custom-hooks";
import { UserPermissions } from "../types/enums";
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
        navigate(`/jobs/${row.id}`);
    };

    const columns = getJobsColumns(useHasPermission(UserPermissions.ADD_EDIT_JOBS) ? {
        viewAction,
    } : { viewAction });

    const clientInformation = [
        { label: "Email", data: clientData?.email ?? "" },
        { label: "Phone Number", data: clientData?.phoneNumber ?? "" },
        { label: "Address", data: clientData?.fullAddress ?? "" },
        { label: "Purchase Order Number", data: clientData?.purchaseOrderNumber ?? "" },
    ];

    const toolbarButtons = [
        { label: "Edit Client", icon: <EditIcon />, onClick: () => setOpenDialog(true) },
    ];

    return (
        <>
            <Box>
                <CustomInformationCard title={clientData?.name} data={clientInformation} />
                <CustomToolbar
                    toolbarButtons={toolbarButtons}
                    searchFilter={searchFilter}
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
