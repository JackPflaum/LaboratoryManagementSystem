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
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { JobAttributes } from "../../../types/interfaces";
import { format } from "date-fns";


interface JobColumnProps {
    viewAction: (row: JobAttributes) => void;
    editAction?: (row: JobAttributes) => void;
    deleteAction?: (row: JobAttributes) => void;
};

export const formatDate = (date: Date) => {
    const formattedDate = format(new Date(date), "dd/MM/yyyy");
    return formattedDate;
};

export const isOverdue = (dueDate: string) => {
    const today = format(new Date(), "dd/MM/yyyy");
    return today > dueDate;
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
            valueGetter: (value, row: JobAttributes) => {
                return row.createdAt ? formatDate(row.createdAt) : "Not Available";
            },
        },
        {
            field: "dueDate",
            headerName: "Due Date",
            flex: 1,
            valueGetter: (value, row: JobAttributes) => {
                return formatDate(row.dueDate);
            },
            renderCell: (params) => {
                const overdue = isOverdue(params.value);
                return (
                    <Typography variant="body2" display="flex" alignItems="center" height="100%">
                        {params.value}
                        {overdue && <WarningAmberIcon sx={{ color: 'red', marginLeft: 1 }} />}
                    </Typography>
                );
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
