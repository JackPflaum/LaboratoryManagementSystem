import { Typography } from "@mui/material";
import {
    GridColDef,
    GridRowParams,
    GridRowId,
    GridActionsCellItem,
    GridRenderCellParams
} from "@mui/x-data-grid";
import VisibilityIcon from '@mui/icons-material/Visibility';
import CompletedChip from "../completed-chip";
import IncompleteChip from "../incomplete-chip";


export function getJobsColumns(useViewJob: (id: GridRowId) => void): GridColDef[] {
    return [
        {
            field: "actions",
            type: "actions",
            getActions: (params: GridRowParams) => [
                <GridActionsCellItem
                    key="view-action"
                    label="View"
                    icon={<VisibilityIcon />}
                    showInMenu
                    onClick={() => useViewJob(params.id)}
                />
            ],
        },
        {
            field: "jobNumber",
            headerName: "Job Number",
            width: 200,
        },
        {
            field: "client",
            headerName: "Client",
            width: 200,
        },
        {
            field: "created",
            headerName: "Created",
            width: 200,
        },
        {
            field: "dueDate",
            headerName: "Due Date",
            width: 200,
        },
        {
            field: "completed",
            headerName: "Completed",
            width: 200,
            type: "boolean",
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant="body2">
                    {params.value ? (
                        <CompletedChip />
                    ) : (
                        <IncompleteChip />
                    )}
                </Typography>
            ),
        },
    ];
};
