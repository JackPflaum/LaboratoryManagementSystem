import { GridActionsCellItem, GridColDef, GridRowParams } from "@mui/x-data-grid";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { EditDeleteTestAttributes, TestColumnsAttributes, UserAttributes } from "../../../types/interfaces";


interface TestColumnProps {
    usersList?: UserAttributes[];
    editAction?: (row: EditDeleteTestAttributes) => void;
    deleteAction?: (row: EditDeleteTestAttributes) => void;
};

export function getTestsColumns({ usersList, editAction, deleteAction }: TestColumnProps) {
    const columns: GridColDef[] = [
        {
            field: "userId",
            headerName: "Assigned User",
            flex: 1,
            valueGetter: (row: TestColumnsAttributes) => {
                const user = usersList?.find((user) => user.id === row.userId);
                return `${user?.firstName} ${user?.lastName}`;
            }
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
