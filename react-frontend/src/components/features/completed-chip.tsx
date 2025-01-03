import { Done } from "@mui/icons-material";
import { Chip } from "@mui/material";


// main use in data grid display of completed jobs/samples/tests
const CompletedChip = () => {
    return (
        <Chip
            label="Completed"
            variant="outlined"
            icon={<Done />}
            color="success"
            sx={{
                color: "green",
                backgroundColor: "#c9fdd7",
                border: "1px solid green"
            }}
        />
    );
};

export default CompletedChip;