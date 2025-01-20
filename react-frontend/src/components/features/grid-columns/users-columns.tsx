import { GridActionsCellItem, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { UserAttributes } from "../../../types/interfaces";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import { formatDate } from "./jobs-columns";
import { Chip } from "@mui/material";


interface UserColumnProps {
    editAction: (row: UserAttributes) => void;
    deleteAction: (row: UserAttributes) => void;
};

export function getUsersColumns({ editAction, deleteAction }: UserColumnProps) {
    const columns: GridColDef[] = [
        {
            field: "name",
            headerName: "Name",
            flex: 1,
            valueGetter: (value, row: UserAttributes) => {
                return `${row.firstName} ${row.lastName}`
            }
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
            flex: 2,
            valueGetter: (value, row: UserAttributes) => {
                return row.permissions.join(", ");
            },
            renderCell: (params) => {
                return params.row.permissions.map((permission: string) => (
                    <Chip
                        key={permission}
                        label={permission}
                        style={{
                            margin: 2,
                            color: "rgb(21, 41, 42)",
                            backgroundColor: "rgb(79, 156, 160)",
                        }}
                    />
                ))
            },
        },
        {
            field: "dateStarted",
            headerName: "Date Started",
            flex: 1,
            valueGetter: (value, row: UserAttributes) => {
                return formatDate(row.dateStarted);
            }
        },
        {
            field: "activeEmployee",
            headerName: "Actively Employed",
            flex: 1,
            renderCell: (params) => {
                if (params.value === true) {
                    return <DoneIcon fontSize="large" sx={{ color: "green" }} />
                } else {
                    return <CloseIcon fontSize="large" sx={{ color: "red" }} />
                };
            }
        }
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
                    label={params.row.activeEmployee ? "Delete" : "ReActivate"}
                    icon={params.row.activeEmployee ? <DeleteIcon /> : <RestoreFromTrashIcon />}
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