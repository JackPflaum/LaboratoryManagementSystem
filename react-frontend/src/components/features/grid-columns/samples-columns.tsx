import { GridActionsCellItem, GridColDef, GridRowParams, GridRenderCellParams } from "@mui/x-data-grid";
import { Typography } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CompletedChip from "../completed-chip";
import IncompleteChip from "../incomplete-chip";
import { SampleAttributes } from "../../../types/interfaces";


interface SampleColumnProps {
    editAction?: (row: SampleAttributes) => void;
    deleteAction?: (row: SampleAttributes) => void;
};


export function getSamplesColumns({ editAction, deleteAction }: SampleColumnProps) {
    const columns: GridColDef[] = [
        {
            field: "sampleNumber",
            headerName: "Sample Number",
            width: 200
        },
        {
            field: "jobNumber",
            headerName: "Job Number",
            width: 200
        },
        {
            field: "type",
            headerName: "Type",
            width: 200
        },
        {
            field: "storage",
            headerName: "Storage",
            width: 200
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
            };
            return actions;
        }
    };

    columns.unshift(actionsColumn);

    return columns;
};
