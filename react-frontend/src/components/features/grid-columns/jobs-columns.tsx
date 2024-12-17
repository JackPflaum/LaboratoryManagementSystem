import { Typography } from "@mui/material";
import {
    GridColDef,
    GridRowParams,
    GridActionsCellItem,
    GridRenderCellParams
} from "@mui/x-data-grid";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CompletedChip from "../completed-chip";
import IncompleteChip from "../incomplete-chip";
import { JobAttributes } from "../../../types/interfaces";
import { format } from "date-fns";


interface JobColumnProps {
    viewAction: (row: JobAttributes) => void;
    editAction?: (row: JobAttributes) => void;
    deleteAction?: (row: JobAttributes) => void;
};

export const formatDate = (date: Date) => {
    const formattedDate = format(new Date(date), "dd-MM-yyyy");
    return formattedDate;
};

export function getJobsColumns({ viewAction, editAction, deleteAction }: JobColumnProps) {
    const columns: GridColDef[] = [
        {
            field: "jobNumber",
            headerName: "Job Number",
            flex: 1,
        },
        {
            field: "client",
            headerName: "Client",
            flex: 1,
        },
        {
            field: "createdAt",
            headerName: "Created",
            flex: 1,
            renderCell: (params) => {
                return formatDate(params.value);
            }
        },
        {
            field: "dueDate",
            headerName: "Due Date",
            flex: 1,
            renderCell: (params) => {
                return formatDate(params.value);
            }
        },
        {
            field: "completed",
            headerName: "Completed",
            flex: 1,
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

    const actionsColumn: GridColDef = {
        field: "actions",
        type: "actions",
        width: 100,
        getActions: (params: GridRowParams<JobAttributes>) => {
            const actions = [
                <GridActionsCellItem
                    key="view"
                    label="View"
                    icon={<VisibilityIcon />}
                    onClick={() => viewAction(params.row)}
                    showInMenu
                />
            ];

            if (editAction) {
                actions.push(
                    <GridActionsCellItem
                        key="edit"
                        label="Edit"
                        icon={<EditIcon />}
                        onClick={() => editAction(params.row)}
                        showInMenu
                    />
                );
            };

            if (deleteAction) {
                actions.push(
                    <GridActionsCellItem
                        key="delete"
                        label="Delete"
                        icon={<DeleteIcon />}
                        onClick={() => deleteAction(params.row)}
                        showInMenu
                    />
                );
            }
            return actions;
        }
    };

    columns.unshift(actionsColumn);

    return columns;
};
