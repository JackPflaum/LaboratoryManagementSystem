import { GridActionsCellItem, GridColDef, GridRowParams } from "@mui/x-data-grid";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { EditDeleteTestAttributes, TestAttributes, UserAttributes } from "../../../types/interfaces";


interface TestColumnProps {
    usersList?: UserAttributes[];
    editAction?: (row: EditDeleteTestAttributes) => void;
    deleteAction?: (row: EditDeleteTestAttributes) => void;
};


export function getTestsColumns({ usersList, editAction, deleteAction }: TestColumnProps) {
    console.log("USERSLIST: ", usersList);
    const columns: GridColDef[] = [
        {
            field: "userId",
            headerName: "Assigned User",
            flex: 1,
            // valueGetter: (params: GridRowParams<UserAttributes>) => {
            //     console.log("ROW DATA: ", params.row);
            //     // const user = usersList?.find((user) => user.id === params.row.id);
            //     // return user ? `${user.firstName} ${user.lastName}` : "Unknown User";
            // }
        },
        {
            field: "testName",
            headerName: "Test Name",
            flex: 1,
        },
        {
            field: "unit",
            headerName: "Unit",
            flex: 1,
        },
    ];


    const actionsColumn: GridColDef = {
        field: "actions",
        type: "actions",
        width: 100,
        getActions: (params: GridRowParams<EditDeleteTestAttributes>) => {
            const actions = [];

            if (editAction) {
                actions.push(
                    <GridActionsCellItem
                        key="edit"
                        label="Edit"
                        icon={<EditIcon />}
                        onClick={() => editAction(params.row)}
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
                    />
                );
            };
            return actions;
        }
    };

    columns.unshift(actionsColumn);

    return columns;
};
