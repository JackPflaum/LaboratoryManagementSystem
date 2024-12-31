import { useState } from "react";
import { Box } from "@mui/material";
import DisplayGrid from "./features/display-grid";
import { useParams } from "react-router-dom";
import CustomToolbar from "./features/custom-toolbar";
import EditIcon from '@mui/icons-material/Edit';
import { useDeleteSampleMutation, useGetJobQuery, useGetSamplesQuery } from "../queries/useQueries";
import JobDialog from "./features/dialogs/job-dialog";
import { getSamplesColumns } from "./features/grid-columns/samples-columns";
import { SearchLabel, UserPermissions } from "../types/enums";
import { useHasPermission } from "../hooks/custom-hooks";
import { ButtonConfig, SampleAttributes } from "../types/interfaces";
import DeleteDialog from "./features/dialogs/delete-dialog";
import SampleFormProvider from "./features/dialogs/SampleFormProvider";
import CustomInformationCard from "./features/custom-information-card";
import { Add } from "@mui/icons-material";
import { formatDate } from "./features/grid-columns/jobs-columns";
import ResultsDialog from "./features/dialogs/results-dialog";


const IndividualJob = () => {

    const [searchFilter, setSearchFilter] = useState<string>("");
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [editingSample, setEditingSample] = useState<SampleAttributes | undefined>(undefined);
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [sampleDialog, setSampleDialog] = useState<boolean>(false);
    const [editingResults, setEditingResults] = useState<SampleAttributes | undefined>(undefined);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchFilter(event.target.value);
    };

    const { jobNumber } = useParams<string>()

    // get job data
    const { data: jobData, isLoading: loading } = useGetJobQuery(jobNumber);

    const userId = undefined;

    // get list of samples for currently selected Job
    const { data: samplesData, isLoading } = useGetSamplesQuery(searchFilter, jobNumber, userId);

    // edit existing sample
    const editAction = (row: SampleAttributes) => {
        setEditingSample(row);
        setSampleDialog(true);
    };

    // add sample test results
    const editResultsAction = (row: SampleAttributes) => {
        setEditingResults(row);
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

    // Check user permissions
    const canAddEditJobs = useHasPermission(UserPermissions.ADD_EDIT_CLIENTS);

    const columns = getSamplesColumns(canAddEditJobs ? {
        editAction,
        editResultsAction,
        deleteAction
    } : { editResultsAction });

    const toolbarButtons: ButtonConfig[] = [
        ...(canAddEditJobs ? [
            { label: "Add Sample", icon: <Add />, onClick: () => setSampleDialog(true) },
            { label: "Edit Job", icon: <EditIcon />, onClick: () => setOpenDialog(true) },
        ] : [])
    ];

    const jobInformation = [
        { label: "Client", data: jobData?.client ?? "" },
        {
            label: "Due Date", data: jobData?.dueDate
                ? formatDate(jobData?.dueDate)
                : "N/A"
        },
        { label: "Completed", data: jobData?.completed ? "Yes" : "No" },
        { label: "Comments", data: jobData?.comments ?? "No comments" },
    ];

    return (
        <>
            <Box>
                <CustomInformationCard title={jobData?.jobNumber} data={jobInformation} />
                <CustomToolbar
                    toolbarButtons={toolbarButtons}
                    searchFilter={searchFilter}
                    searchLabel={SearchLabel.SEARCH_SAMPLE_NUMBER}
                    handleSearchChange={handleSearchChange}
                />
                {sampleDialog &&
                    <SampleFormProvider
                        open={sampleDialog}
                        handleClose={() => {
                            setSampleDialog(false)
                            setEditingSample(undefined);
                        }}
                        data={editingSample}
                        jobNumber={jobData?.jobNumber}
                    />
                }
            </Box>
            <DisplayGrid
                rows={samplesData ?? []}
                columns={columns}
                isLoading={isLoading}
            />
            {openDialog && <JobDialog open={openDialog} handleClose={() => setOpenDialog(false)} data={jobData} />}
            {editingResults &&
                <ResultsDialog
                    data={editingResults}
                    open={!!editingResults}
                    handleClose={() => setEditingResults(undefined)}
                />
            }
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