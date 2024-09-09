import { Chip } from "@mui/material";


// main use in data grid display of completed jobs/samples/tests
const CompletedChip = () => {
    return (
        <Chip
            label="Completed"
            variant="outlined"
            sx={{
                color: "green",
                backgroundColor: "#c9fdd7",
                border: "2px solid green"
            }}
        />
    );
};

export default CompletedChip;