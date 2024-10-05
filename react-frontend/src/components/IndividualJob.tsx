import { useState } from "react";
import { Typography, Box } from "@mui/material";
import DisplayGrid from "./features/display-grid";
import { useNavigate, useParams } from "react-router-dom";
import CustomToolbar from "./features/custom-toolbar";
import EditIcon from '@mui/icons-material/Edit';
import { useGetJobQuery, useGetSamplesQuery } from "../queries/useQueries";
import JobDialog from "./features/dialogs/job-dialog";
import { getSamplesColumns } from "./features/grid-columns/samples-columns";
import { UserPermissions } from "../types/enums";
import { useHasPermission } from "../hooks/custom-hooks";
import { JobAttributes, SampleAttributes } from "../types/interfaces";
import PageTitle from "./features/page-title";


const IndividualJob = () => {

    const [searchFilter, setSearchFilter] = useState<string>("");
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [editingJob, setEditingJob] = useState<JobAttributes | undefined>(undefined);
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchFilter(event.target.value);
    };

    const { id } = useParams<string>()

    // get job data
    const { data: jobData, isLoading: loading } = useGetJobQuery(id);

    // get list of samples for currently selected Job
    const { data: samplesData, isLoading } = useGetSamplesQuery(searchFilter);

    const navigate = useNavigate();

    // view selected sample on dedicated page
    const viewAction = (row: SampleAttributes) => {
        navigate(`/samples/${row.id}`);
    };

    // edit existing sample
    const editAction = (row: SampleAttributes) => {
        // setEditingSamples(row);
        setOpenDialog(true);
    };

    // delete existing sample
    const deleteAction = (row: SampleAttributes) => {
        setOpenDeleteDialog(true);
    };

    const columns = getSamplesColumns(useHasPermission(UserPermissions.ADD_EDIT_JOBS) ? {
        viewAction,
        editAction,
        deleteAction
    } : { viewAction });

    return (
        <>
            <Box>
                <PageTitle title={jobData?.jobNumber} />
                <Box>
                    <p>Client: {jobData?.client}</p>
                    <p>Due Date: {jobData?.dueDate.toString()}</p>
                    <p>Completed: {jobData?.completed}</p>
                    <p>Comments: {jobData?.comments}</p>
                </Box>
                <CustomToolbar
                    buttonTitle="Edit Job"
                    buttonIcon={<EditIcon />}
                    searchFilter={searchFilter}
                    handleSearchChange={handleSearchChange}
                    setOpenDialog={setOpenDialog}
                />
            </Box>
            <DisplayGrid
                rows={samplesData ?? []}
                columns={columns}
                isLoading={isLoading}
            />
            {openDialog && <JobDialog open={openDialog} handleClose={() => setOpenDialog(false)} data={editingJob} />}
        </>
    );
};

export default IndividualJob;
