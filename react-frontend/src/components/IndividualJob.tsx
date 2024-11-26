import { useState } from "react";
import { Box, Button } from "@mui/material";
import DisplayGrid from "./features/display-grid";
import { useNavigate, useParams } from "react-router-dom";
import CustomToolbar from "./features/custom-toolbar";
import EditIcon from '@mui/icons-material/Edit';
import { useDeleteSampleMutation, useGetJobQuery, useGetSamplesQuery } from "../queries/useQueries";
import JobDialog from "./features/dialogs/job-dialog";
import { getSamplesColumns } from "./features/grid-columns/samples-columns";
import { UserPermissions } from "../types/enums";
import { useHasPermission } from "../hooks/custom-hooks";
import { SampleAttributes } from "../types/interfaces";
import PageTitle from "./features/page-title";
import DeleteDialog from "./features/dialogs/delete-dialog";
import SampleFormProvider from "./features/dialogs/SampleFormProvider";


const IndividualJob = () => {

    const [searchFilter, setSearchFilter] = useState<string>("");
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [editingSample, setEditingSample] = useState<SampleAttributes | undefined>(undefined);
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [sampleDialog, setSampleDialog] = useState<boolean>(false);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchFilter(event.target.value);
    };

    const { id } = useParams<string>()

    // get job data
    const { data: jobData, isLoading: loading } = useGetJobQuery(id);

    // get list of samples for currently selected Job
    const { data: samplesData, isLoading } = useGetSamplesQuery(searchFilter, id);

    const navigate = useNavigate();

    // view selected sample on dedicated page
    const viewAction = (row: SampleAttributes) => {
        navigate(`/samples/${row.id}`);
    };

    // edit existing sample
    const editAction = (row: SampleAttributes) => {
        setEditingSample(row);
        setSampleDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setEditingSample(undefined);
        setOpenDeleteDialog(false);
    };

    const { mutate: deleteSample, isPending } = useDeleteSampleMutation();

    // delete existing sample
    const deleteAction = (row: SampleAttributes) => {
        setEditingSample(row);
        setOpenDeleteDialog(true);
    };

    const columns = getSamplesColumns(useHasPermission(UserPermissions.ADD_EDIT_JOBS) ? {
        viewAction,
        editAction,
        deleteAction
    } : { viewAction, deleteAction, editAction });

    return (
        <>
            <Box>
                <PageTitle title={jobData?.jobNumber} />
                <Box>
                    <p>Client: {jobData?.client}</p>
                    <p>Due Date: {jobData?.dueDate.toString()}</p>
                    <p>Completed: {jobData?.completed ? "Yes" : "No"}</p>
                    <p>Comments: {jobData?.comments ?? "No comments"}</p>
                </Box>
                <Button variant="contained" startIcon={<EditIcon />} onClick={() => setSampleDialog(true)}>
                    Add Sample
                </Button>
                {sampleDialog && <SampleFormProvider open={sampleDialog} handleClose={() => setSampleDialog(false)} data={editingSample} jobNumber={jobData?.jobNumber} />}
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
            {openDialog && <JobDialog open={openDialog} handleClose={() => setOpenDialog(false)} data={jobData} />}
            {openDeleteDialog && (
                <DeleteDialog
                    open={openDeleteDialog}
                    handleClose={handleCloseDeleteDialog}
                    handleDelete={deleteSample}
                    isPending={isPending}
                    id={editingSample?.id}
                    description={editingSample?.sampleNumber} />
            )}
        </>
    );
};

export default IndividualJob;
