import { Box } from "@mui/material";
import React, { useState } from "react";
import { useDeleteJobMutation, useGetJobsQuery } from "../queries/useQueries";
import DisplayGrid from "./features/display-grid";
import { getJobsColumns } from "./features/grid-columns/jobs-columns";
import { useNavigate } from "react-router-dom";
import { SearchLabel, UserPermissions } from "../types/enums";
import { useHasPermission } from "../hooks/custom-hooks";
import { ButtonConfig, JobAttributes } from "../types/interfaces";
import JobDialog from "./features/dialogs/job-dialog";
import CustomToolbar from "./features/custom-toolbar";
import { Add } from "@mui/icons-material";
import DeleteDialog from "./features/dialogs/delete-dialog";
import PageTitle from "./features/page-title";


const Jobs = () => {

    const [searchFilter, setSearchFilter] = useState<string>("");
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [editingJob, setEditingJob] = useState<JobAttributes | undefined>(undefined);

    // get Grid data
    const { data: rows, isLoading } = useGetJobsQuery(searchFilter);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchFilter(event.target.value);
    };

    const handleCloseDialog = () => {
        setEditingJob(undefined);
        setOpenDialog(false);
    };

    const handleCloseDeleteDialog = () => {
        setEditingJob(undefined);
        setOpenDeleteDialog(false);
    };

    const navigate = useNavigate();

    // view selected Job on dedicated page
    const viewAction = (row: JobAttributes) => {
        navigate(`/jobs/${row.jobNumber}`);
    };

    // edit existing Job
    const editAction = (row: JobAttributes) => {
        setEditingJob(row);
        setOpenDialog(true);
    };

    const { mutate: deleteJob, isPending } = useDeleteJobMutation();

    // delete existing Job by opening dialog
    const deleteAction = (row: JobAttributes) => {
        setEditingJob(row);
        setOpenDeleteDialog(true);
    };

    const canAddEditJobs = useHasPermission(UserPermissions.ADD_EDIT_JOBS);

    // Data Grid columns
    const columns = getJobsColumns(canAddEditJobs ? {
        viewAction,
        editAction,
        deleteAction,
    } : { viewAction });

    const toolbarButtons: ButtonConfig[] = [
        ...(canAddEditJobs ? [{ label: "Add", icon: <Add />, onClick: () => setOpenDialog(true) }] : [])
    ];

    return (
        <Box>
            <Box>
                <PageTitle title="Jobs" />
                <CustomToolbar
                    toolbarButtons={toolbarButtons}
                    searchFilter={searchFilter}
                    searchLabel={SearchLabel.SEARCH_JOB_NUMBER}
                    handleSearchChange={handleSearchChange}
                />
            </Box>
            <DisplayGrid
                rows={rows ?? []}
                columns={columns}
                isLoading={isLoading}
            />
            {openDialog && <JobDialog open={openDialog} handleClose={handleCloseDialog} data={editingJob} />}
            {openDeleteDialog && (
                <DeleteDialog
                    open={openDeleteDialog}
                    handleClose={handleCloseDeleteDialog}
                    handleDelete={deleteJob}
                    isPending={isPending}
                    id={editingJob?.id}
                    description={editingJob?.jobNumber} />
            )}
        </Box>
    );
};

export default Jobs;
