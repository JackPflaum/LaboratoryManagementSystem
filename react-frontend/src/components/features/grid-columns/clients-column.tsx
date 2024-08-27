import { GridActionsCellItem, GridColDef, GridRowId, GridRowParams } from "@mui/x-data-grid";
import { ClientAttributes } from "../../../types/interfaces";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface ClientColumnProps {
    editAction?: (row: ClientAttributes) => void;
    deleteAction?: (row: ClientAttributes) => void;
}


// TODO: change to useMemo()

export function getClientsColumns({ editAction, deleteAction }: ClientColumnProps) {
    const columns: GridColDef[] = [
        {
            field: "name",
            headerName: "Client Name",
            width: 150
        },
        {
            field: "email",
            headerName: "Email",
            width: 150
        },
        {
            field: "phoneNumber",
            headerName: "Phone number",
            width: 150
        },
        {
            field: "fullAddress",
            headerName: "Address",
            width: 150,
        },
        {
            field: "purchaseOrderNumber",
            headerName: "Purchase Order Number",
            width: 150
        }
    ];


    if (editAction && deleteAction) {
        columns.unshift({
            field: 'actions',
            type: "actions",
            width: 100,
            getActions: (params: GridRowParams<ClientAttributes>) => [
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
            ]
        });
    }
    return columns;
};