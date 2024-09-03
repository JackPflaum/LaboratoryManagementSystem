import { Box, Container, Typography } from "@mui/material";
import React, { useCallback, useState } from "react";
import { useGetJobsQuery } from "../queries/useQueries";
import DisplayGrid from "./features/display-grid";
import { getJobsColumns } from "./features/grid-columns/jobs-columns";
import { useNavigate } from "react-router-dom";
import { GridRowId } from "@mui/x-data-grid";
import { JobAttributes } from "../types/interfaces";
import { useViewJob } from "../hooks/custom-hooks";
import JobDialog from "./features/dialogs/job-dialog";
import ClientToolbar from "./features/client-toolbar";
import { Add } from "@mui/icons-material";


const Jobs = () => {

    const [searchFilter, setSearchFilter] = useState<string>("");
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [editingJob, setEditingJob] = useState<JobAttributes | undefined>(undefined);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchFilter(event.target.value);
    };

    // const useViewJob = () => {
    //     const navigate = useNavigate();
    //     return useCallback((id: GridRowId) => {
    //         navigate(`/jobs/${id}`);
    //     }, [navigate]);
    // }

    // Data Grid columns
    const columns = getJobsColumns(useViewJob);

    // get Grid data
    const { data, isLoading } = useGetJobsQuery(searchFilter);

    // const rows = data.map((data: JobAttributes) => ({
    //     jobNumber: data?.jobNumber,
    //     client: data?.client,
    //     created: data?.createdAt,
    //     dueDate: data?.dueDate,
    //     completed: data?.completed,
    // }));


    return (
        <Container>
            <Box>
                <Typography variant="h4" sx={{ display: "flex", justifyContent: "center" }}>
                    Jobs
                </Typography>
                <ClientToolbar
                    buttonTitle="Add"
                    buttonIcon={<Add />}
                    searchFilter={searchFilter}
                    handleSearchChange={handleSearchChange}
                    setOpenDialog={setOpenDialog}
                />
            </Box>
            <DisplayGrid
                rows={data}
                columns={columns}
                isLoading={isLoading}
            />
            {openDialog && <JobDialog open={openDialog} handleClose={() => setOpenDialog(false)} data={data} />}
        </Container>
    );
};

export default Jobs;
