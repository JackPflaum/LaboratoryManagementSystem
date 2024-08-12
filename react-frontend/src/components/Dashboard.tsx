import { useCallback } from "react";
import { Box, Stack, Typography, Chip, Container } from "@mui/material"
import DashboardCard from "./features/dashboard-cards";
import DisplayGrid from "./features/display-grid";
import { GridColDef, GridRowId, GridRowsProp, GridActionsCellItem, GridRowParams } from "@mui/x-data-grid"
import { useNavigate } from "react-router-dom";


const Dashboard = () => {

    const cardTitles = ["Pending Jobs", "Pending Samples", "Completed Jobs"];

    const navigate = useNavigate();

    const viewJob = useCallback((id: GridRowId) => {
        navigate(`/job/${id}`);
    }, [])

    const columns: GridColDef[] = [
        {
            field: "actions",
            type: "actions",
            getActions: (params: GridRowParams) => [
                <GridActionsCellItem
                    key="view-action"
                    label="View"
                    showInMenu
                    onClick={() => viewJob(params.id)}
                />
            ],
        },
        {
            field: "jobNumber",
            headerName: "Job Number",
            width: 150,
        },
        {
            field: "client",
            headerName: "Client",
            width: 150,
        },
        {
            field: "created",
            headerName: "Created",
            width: 150,
        },
        {
            field: "dueDate",
            headerName: "Due Date",
            width: 150,
        },
        {
            field: "completed",
            headerName: "Completed",
            width: 150,
            type: "boolean",
            renderCell: (params) => (
                <Typography variant="body2">
                    {params.value ? (
                        <Chip label="Completed"
                            variant="outlined"
                            sx={{
                                color: "green",
                                backgroundColor: "#c9fdd7",
                                border: "2px solid green"
                            }}
                        />
                    ) : (
                            <Chip label="Incomplete"
                                sx={{
                                    color: "#c82121",
                                    backgroundColor: "#ffaaa5",
                                    border: "2px solid red"
                                }}
                            />
                        )
                    }
                </Typography>
            ),
        },
    ];

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
                    <DashboardCard titles={cardTitles} />
                </Stack>
                <DisplayGrid
                    rows={rows}
                    columns={columns}
                />
            </Box>
        </Container>
    );
};

export default Dashboard;
