import { Box } from "@mui/material"
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid"

interface DisplayGridProps {
    columns: GridColDef[];
    rows: GridRowsProp;
    isLoading?: boolean;
}

const DisplayGrid = ({ columns, rows, isLoading }: DisplayGridProps) => {
    const pageSize = 5;

    return (
        <Box>
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: pageSize,
                        },
                    },
                }}
                pageSizeOptions={[pageSize]}
                sx={{
                    backgroundColor: "white",
                    borderRadius: 4,
                }}
                loading={isLoading}
            />
        </Box>
    )
};

export default DisplayGrid;