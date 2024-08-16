import { Typography, Chip } from "@mui/material";
import {
    GridColDef,
    GridRowParams,
    GridRowId,
    GridActionsCellItem,
    GridRenderCellParams
} from "@mui/x-data-grid";


export function getJobsColumns(useViewJob: (id: GridRowId) => void): GridColDef[] {
    return [
        {
            field: "actions",
            type: "actions",
            getActions: (params: GridRowParams) => [
                <GridActionsCellItem
                    key="view-action"
                    label="View"
                    showInMenu
                    onClick={() => useViewJob(params.id)}
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
            renderCell: (params: GridRenderCellParams) => (
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
};
