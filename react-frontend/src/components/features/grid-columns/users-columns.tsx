import { GridActionsCellItem, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { UserAttributes } from "../../../types/interfaces";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


interface UserColumnProps {
    editAction: (row: UserAttributes) => void;
    deleteAction: (row: UserAttributes) => void;
};

export function getUsersColumns({ editAction, deleteAction }: UserColumnProps) {
    const columns: GridColDef[] = [
        {
            field: "name",
            headerName: "Name",
            width: 200,
        },
        {
            field: "workEmail",
            headerName: "Work Email",
            width: 200,
        },
        {
            field: "position",
            headerName: "Position",
            width: 200,
        },
        {
            field: "permissions",
            headerName: "Permissions",
            width: 200,
        },
        {
            field: "dateStarted",
            headerName: "Date Started",
            width: 200,
        },
    ];

    const actionColumn: GridColDef = {
        field: "actions",
        type: "actions",
        width: 100,
        getActions: (params: GridRowParams<UserAttributes>) => {
            const actions = [
                <GridActionsCellItem
                    key="edit"
                    label="Edit"
                    icon={<EditIcon />}
                    onClick={() => editAction(params.row)}
                    showInMenu
                />,
                <GridActionsCellItem
                    key="delete"
                    label="Delete"
                    icon={<DeleteIcon />}
                    onClick={() => deleteAction(params.row)}
                    showInMenu
                />
            ];

            return actions;
        }
    };

    columns.unshift(actionColumn);

    return columns;
};