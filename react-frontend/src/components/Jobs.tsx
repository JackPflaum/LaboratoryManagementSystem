import { Box, Container, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDeleteJobMutation, useGetJobsQuery } from "../queries/useQueries";
import DisplayGrid from "./features/display-grid";
import { getJobsColumns } from "./features/grid-columns/jobs-columns";
import { useNavigate } from "react-router-dom";
import { UserPermissions } from "../types/enums";
import { useHasPermission } from "../hooks/custom-hooks";
import { JobAttributes } from "../types/interfaces";
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
        navigate(`/jobs/${row.id}`);
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

    // Data Grid columns
    const columns = getJobsColumns(useHasPermission(UserPermissions.ADD_EDIT_JOBS) ? {
        viewAction,
        editAction,
        deleteAction,
    } : { viewAction, deleteAction });

    // get Grid data
    const { data: rows, isLoading } = useGetJobsQuery(searchFilter);

    // check if i  can Pass data directly into data grid -------------------------->?????
    // const rows = data?.map((data: JobAttributes) => ({
    //     jobNumber: data?.jobNumber,
    //     client: data?.client,
    //     created: data?.createdAt,
    //     dueDate: data?.dueDate,
    //     completed: data?.completed,
    // }));


    return (
        <Container>
            <Box>
                <PageTitle title="Jobs" />
                <CustomToolbar
                    buttonTitle="Add"
                    buttonIcon={<Add />}
                    searchFilter={searchFilter}
                    handleSearchChange={handleSearchChange}
                    setOpenDialog={setOpenDialog}
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
        </Container>
    );
};

export default Jobs;
