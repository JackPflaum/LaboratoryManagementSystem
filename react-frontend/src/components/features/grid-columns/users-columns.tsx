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
            field: "firstName",
            headerName: "First Name",
            flex: 1,
        },
        {
            field: "lastName",
            headerName: "Last Name",
            flex: 1,
        },
        {
            field: "workEmail",
            headerName: "Work Email",
            flex: 1,
        },
        {
            field: "position",
            headerName: "Position",
            flex: 1,
        },
        {
            field: "permissions",
            headerName: "Permissions",
            flex: 1,
        },
        {
            field: "dateStarted",
            headerName: "Date Started",
            flex: 1,
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