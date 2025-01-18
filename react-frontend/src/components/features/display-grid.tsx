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

    const dataGridStyles = {
        backgroundColor: "white",
        borderRadius: 4,
        '.MuiDataGrid-columnSeparator': {
            display: 'none',
        },
        '& .MuiDataGrid-columnHeader': {
            backgroundColor: 'white',  // Header background color
            color: 'black',
        },
        '& .MuiDataGrid-row': {
            backgroundColor: 'white',  // Row background color
        },
        '& .MuiDataGrid-footerContainer': {
            backgroundColor: 'white',  // Footer background color
        },
        '& .MuiDataGrid-cell': {
            color: 'black',  // Cell text color
        },
    };

    return (
        <Box sx={{ width: "100%", height: "calc(100vh - 300px)" }}>
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
                sx={dataGridStyles}
                loading={isLoading}
                disableColumnMenu={true}
                disableColumnResize={true}
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