import { GridActionsCellItem, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { ClientAttributes } from "../../../types/interfaces";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface ClientColumnProps {
    viewAction: (row: ClientAttributes) => void;
    editAction?: (row: ClientAttributes) => void;
    deleteAction?: (row: ClientAttributes) => void;
};

// TODO: change to useMemo()

export function getClientsColumns({ viewAction, editAction, deleteAction }: ClientColumnProps) {

    const columns: GridColDef[] = [
        {
            field: "name",
            headerName: "Client Name",
            width: 200
        },
        {
            field: "email",
            headerName: "Email",
            width: 200
        },
        {
            field: "phoneNumber",
            headerName: "Phone number",
            width: 200
        },
        {
            field: "fullAddress",
            headerName: "Address",
            width: 200,
        },
        {
            field: "purchaseOrderNumber",
            headerName: "Purchase Order Number",
            width: 200
        }
    ];

    // Conditional actions column
    const actionsColumn: GridColDef = {
        field: 'actions',
        type: "actions",
        width: 100,
        getActions: (params: GridRowParams<ClientAttributes>) => {
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
            }

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
