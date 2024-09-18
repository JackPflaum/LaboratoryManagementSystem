import { GridActionsCellItem, GridColDef, GridRowParams } from "@mui/x-data-grid";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { SampleAttributes } from "../../../types/interfaces";


interface TestColumnProps {
    editAction?: (row: SampleAttributes) => void;
    deleteAction?: (row: SampleAttributes) => void;
};


export function getTestsColumns({ editAction, deleteAction }: TestColumnProps) {
    const columns: GridColDef[] = [
        {
            field: "user",
            headerName: "Assigned User",
            width: 200
        },
        {
            field: "testName",
            headerName: "Test Name",
            width: 200
        },
        {
            field: "result",
            headerName: "Result",
            width: 200
        },
        {
            field: "unit",
            headerName: "Unit",
            width: 200
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
