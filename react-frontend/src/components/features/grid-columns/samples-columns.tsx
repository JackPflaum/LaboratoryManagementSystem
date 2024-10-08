import { GridActionsCellItem, GridColDef, GridRowParams, GridRenderCellParams } from "@mui/x-data-grid";
import { Typography, Chip } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CompletedChip from "../completed-chip";
import IncompleteChip from "../incomplete-chip";
import { ClientAttributes, SampleAttributes } from "../../../types/interfaces";


interface SampleColumnProps {
    viewAction: (row: ClientAttributes) => void;
    editAction?: (row: ClientAttributes) => void;
    deleteAction?: (row: ClientAttributes) => void;
};


export function getSamplesColumns({ viewAction, editAction, deleteAction }: SampleColumnProps) {
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
            };
            return actions;
        }
    };

    columns.unshift(actionsColumn);

    return columns;
};
