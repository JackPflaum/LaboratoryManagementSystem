import { Box, Stack, Typography, Container } from "@mui/material"
import DashboardCard from "./features/dashboard-cards";
import DisplayGrid from "./features/display-grid";
import { GridRowsProp } from "@mui/x-data-grid"
import { useGetJobsData } from "../queries/useQueries";
import { CardData } from "../types/interfaces";
import { getJobsColumns } from "./grid-columns/jobs-columns";
import { useViewJob } from "../hooks/custom-hooks";

const Dashboard = () => {

    const { data, isLoading, error } = useGetJobsData();
    console.log("Data: ", data);

    const cardData: CardData[] = [
        {
            title: "Pending Jobs",
            count: data?.pendingJobsCount
        },
        {
            title: "Pending Samples",
            count: data?.pendingSamplesCount
        },
        {
            title: "Completed Jobs",
            count: data?.completedJobsCount
        }
    ];

    const columns = getJobsColumns(useViewJob);

    const rows: GridRowsProp = [
        { id: 1, jobNumber: 'J001', client: 'Client A', created: '2024-01-10', dueDate: '2024-02-15', completed: true },
        { id: 2, jobNumber: 'J002', client: 'Client B', created: '2024-01-15', dueDate: '2024-03-01', completed: false },
        { id: 3, jobNumber: 'J003', client: 'Client C', created: '2024-01-20', dueDate: '2024-03-10', completed: true },
        { id: 4, jobNumber: 'J004', client: 'Client D', created: '2024-01-25', dueDate: '2024-03-20', completed: false },
        { id: 5, jobNumber: 'J005', client: 'Client E', created: '2024-02-01', dueDate: '2024-04-01', completed: true },
        { id: 6, jobNumber: 'J006', client: 'Client F', created: '2024-02-05', dueDate: '2024-04-15', completed: false },
        { id: 7, jobNumber: 'J007', client: 'Client G', created: '2024-02-10', dueDate: '2024-05-01', completed: true },
        { id: 8, jobNumber: 'J008', client: 'Client H', created: '2024-02-15', dueDate: '2024-05-15', completed: false },
        { id: 9, jobNumber: 'J009', client: 'Client I', created: '2024-02-20', dueDate: '2024-06-01', completed: true },
    ];

    return (
        <Container>
            <Box>
                <Typography variant="h4" sx={{ display: "flex", justifyContent: "center" }}>
                    Dashboard
                </Typography>
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={{ xs: 1, sm: 2, md: 4 }}

                    sx={{
                        justifyContent: "space-evenly",
                        alignItems: "center",
                        marginTop: 4,
                        marginBottom: 6,
                    }}>
                    <DashboardCard cardData={cardData} />
                </Stack>
                <DisplayGrid
                    rows={rows}
                    columns={columns}
                    isLoading={isLoading}
                />
            </Box>
        </Container>
    );
};

export default Dashboard;
