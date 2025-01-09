import { useState } from "react";
import { Box } from "@mui/material";
import DisplayGrid from "./features/display-grid";
import { useParams } from "react-router-dom";
import CustomToolbar from "./features/custom-toolbar";
import EditIcon from '@mui/icons-material/Edit';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
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
import { formatDate, isOverdue } from "./features/grid-columns/jobs-columns";
import ResultsDialog from "./features/dialogs/results-dialog";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PdfDialog from "./features/dialogs/pdf-dialog";


const IndividualJob = () => {

    const [searchFilter, setSearchFilter] = useState<string>("");
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [editingSample, setEditingSample] = useState<SampleAttributes | undefined>(undefined);
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [sampleDialog, setSampleDialog] = useState<boolean>(false);
    const [editingResults, setEditingResults] = useState<SampleAttributes | undefined>(undefined);
    const [pdfDialog, setPdfDialog] = useState<boolean>(false);

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
    const canViewReports = useHasPermission(UserPermissions.VIEW_REPORTS);

    const columns = getSamplesColumns(canAddEditJobs ? {
        editAction,
        editResultsAction,
        deleteAction,
    } : { editResultsAction });

    // exclude "dueDate" column on Job screen
    const filteredColumns = columns.filter(column => column.field !== "dueDate");

    // Configure toolbar buttons conditionally
    const toolbarButtons: ButtonConfig[] = [];

    // add "Create PDF" button if user has permission and job is complete
    if (canViewReports && jobData?.completed) {
        toolbarButtons.push(
            { label: "Create PDF", icon: <PictureAsPdfIcon />, onClick: () => setPdfDialog(true) }
        );
    };

    // add "Add Sample" and "Edit Job" buttons if user has the permission to add/edit jobs
    if (canAddEditJobs) {
        toolbarButtons.push(
            { label: "Add Sample", icon: <Add />, onClick: () => setSampleDialog(true) },
            { label: "Edit Job", icon: <EditIcon />, onClick: () => setOpenDialog(true) }
        );
    };

    // Determine overdue state for "Due Date"
    const dueDate = jobData?.dueDate ? formatDate(jobData.dueDate) : "Not Available";
    const overdue = isOverdue(dueDate);

    const jobInformation = [
        { label: "Client", data: jobData?.client ?? "Not Available" },
        {
            label: "Due Date",
            data: (
                <>
                    {dueDate}
                    {overdue && jobData?.completed !== true && (
                        <WarningAmberIcon sx={{ color: "red", marginLeft: 1, verticalAlign: "middle" }} />
                    )}
                </>
            )
        },
        {
            label: "Completed", data: jobData?.completed ? (
                <CheckCircleOutlineIcon sx={{ color: "green", marginLeft: 1, verticalAlign: "middle" }} />
            ) : (<HighlightOffIcon sx={{ color: "red", marginLeft: 1, verticalAlign: "middle" }} />)
        },
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
                columns={filteredColumns}
                isLoading={isLoading}
            />
            {pdfDialog &&
                <PdfDialog
                    open={pdfDialog}
                    handleClose={() => setPdfDialog(false)}
                    data={{ job: jobData, samples: samplesData }}
                />
            }
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