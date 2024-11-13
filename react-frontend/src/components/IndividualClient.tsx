import { useState } from "react";
import { Typography, Box } from "@mui/material";
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

    return (
        <>
            <Box>
                <PageTitle title={clientData?.name} />
                <Box>
                    <p>Email: {clientData?.email}</p>
                    <p>Phone Number: {clientData?.phoneNumber}</p>
                    <p>Address: {clientData?.fullAddress}</p>
                    <p>Purchase Order Number: {clientData?.purchaseOrderNumber}</p>
                </Box>
                <CustomToolbar
                    buttonTitle="Edit Client"
                    buttonIcon={<EditIcon />}
                    searchFilter={searchFilter}
                    handleSearchChange={handleSearchChange}
                    setOpenDialog={setOpenDialog}
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
