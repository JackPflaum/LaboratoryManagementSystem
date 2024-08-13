import { Box, Container, Typography } from "@mui/material";
import { useCallback } from "react";
import { useGetJobsData } from "../queries/useQueries";
import DisplayGrid from "./features/display-grid";
import { getJobsColumns } from "./grid-columns/jobs-columns";
import { useNavigate } from "react-router-dom";
import { GridRowId } from "@mui/x-data-grid";
import { JobAttributes } from "../types/interfaces";


const Jobs = () => {

    const useViewJob = () => {
        const navigate = useNavigate();
        return useCallback((id: GridRowId) => {
            navigate(`/jobs/${id}`);
        }, [navigate]);
    }

    // Data Grid columns
    const columns = getJobsColumns(useViewJob);

    // get Grid data
    const { data, isLoading, error } = useGetJobsData();
    console.log("Data: ", data);

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
            </Box>
            {/* <DisplayGrid
                rows={rows}
                columns={columns}
                isLoading={isLoading}
            /> */}
        </Container>
    );
};

export default Jobs;
