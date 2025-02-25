import { Box, Stack } from "@mui/material"
import DashboardCard from "./features/dashboard-cards";
import DisplayGrid from "./features/display-grid";
import { useGetDashboardQuery, useGetJobsQuery } from "../queries/useQueries";
import { CardData, JobAttributes } from "../types/interfaces";
import { getJobsColumns } from "./features/grid-columns/jobs-columns";
import { useNavigate } from "react-router-dom";
import PageTitle from "./features/page-title";

const Dashboard = () => {

    const { data: dashboardData, isLoading: isPending } = useGetDashboardQuery();

    const { data, isLoading, error } = useGetJobsQuery("");

    const cardData: CardData[] = [
        {
            title: "Pending Jobs",
            count: !isPending ? dashboardData?.pendingJobsCount : "-",
            colour: "#fbc3bc"
        },
        {
            title: "Pending Samples",
            count: !isPending ? dashboardData?.pendingSamplesCount : "-",
            colour: "#b7e4c7",
        },
        {
            title: "Completed Jobs",
            count: !isPending ? dashboardData?.completedJobsCount : "-",
            colour: "#ade8f4",
        }
    ];

    const navigate = useNavigate();

    const viewAction = (row: JobAttributes) => {
        navigate(`/jobs/${row.jobNumber}`);
    };

    const columns = getJobsColumns({ viewAction });

    return (
        <Box>
            <PageTitle title="Dashboard" />
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
                rows={data ?? []}
                columns={columns}
                isLoading={isLoading}
            />
        </Box>
    );
};

export default Dashboard;
