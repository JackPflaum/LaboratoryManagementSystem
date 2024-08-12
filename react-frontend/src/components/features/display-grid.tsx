import { Box } from "@mui/material"
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid"

interface DisplayGridProps {
    columns: GridColDef[];
    rows: GridRowsProp;
}

const DisplayGrid = ({ columns, rows }: DisplayGridProps) => {
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
            />
        </Box>
    )
};

export default DisplayGrid;