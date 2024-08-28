import { Box } from "@mui/material"
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid"
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

interface DisplayGridProps {
    columns: GridColDef[];
    rows: GridRowsProp;
    isLoading?: boolean;
}

const DisplayGrid = ({ columns, rows, isLoading }: DisplayGridProps) => {
    const pageSize = 5;

    return (
        <Box sx={{ width: "100%", height: 340 }}>
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
                slots={{
                    noRowsOverlay: () => (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                color: "grey",
                            }}
                        >
                            <WarningAmberIcon />No Rows
                        </Box>
                    ),
                }}
            />
        </Box>
    )
};

export default DisplayGrid;