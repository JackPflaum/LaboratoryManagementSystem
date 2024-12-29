import { GridActionsCellItem, GridColDef, GridRowParams, GridRenderCellParams } from "@mui/x-data-grid";
import { Typography } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { Add } from "@mui/icons-material";
import DeleteIcon from '@mui/icons-material/Delete';
import CompletedChip from "../completed-chip";
import IncompleteChip from "../incomplete-chip";
import { SampleAttributes } from "../../../types/interfaces";


interface SampleColumnProps {
    editAction?: (row: SampleAttributes) => void;
    deleteAction?: (row: SampleAttributes) => void;
    viewJobAction?: (sample: SampleAttributes) => void;
    editResultsAction?: (row: SampleAttributes) => void;
};


export function getSamplesColumns({ editAction, deleteAction, viewJobAction, editResultsAction }: SampleColumnProps) {
    const columns: GridColDef[] = [
        {
            field: "sampleNumber",
            headerName: "Sample Number",
            flex: 1,
        },
        {
            field: "jobNumber",
            headerName: "Job Number",
            flex: 1,
        },
        {
            field: "type",
            headerName: "Type",
            flex: 1,
        },
        {
            field: "storage",
            headerName: "Storage",
            flex: 1,
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
        getActions: (params: GridRowParams<SampleAttributes>) => {
            const actions = [];

            if (editAction) {
                actions.push(
                    <GridActionsCellItem
                        key="edit"
                        label="Sample"
                        icon={<EditIcon />}
                        onClick={() => editAction(params.row)}
                        showInMenu
                    />
                );
            };

            if (editResultsAction) {
                actions.push(
                    <GridActionsCellItem
                        key="editingResults"
                        label="Results"
                        icon={<Add />}
                        onClick={() => editResultsAction(params.row)}
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
            };

            if (viewJobAction) {
                actions.push(
                    <GridActionsCellItem
                        key="viewJob"
                        label="View Job"
                        icon={<VisibilityIcon />}
                        onClick={() => viewJobAction(params.row)}
                        showInMenu
                    />
                )
            }
            return actions;
        }
    };

    columns.unshift(actionsColumn);

    return columns;
};
