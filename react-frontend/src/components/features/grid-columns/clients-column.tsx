import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

export function getClientsColumns(): GridColDef[] {
    return [
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
        },
    ]
};