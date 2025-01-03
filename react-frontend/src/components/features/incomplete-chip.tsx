import { Close } from "@mui/icons-material";
import { Chip } from "@mui/material";


// main use in data grid display of incomplete jobs/samples/tests
const IncompleteChip = () => {
    return (
        <Chip
            label="Incomplete"
            variant="outlined"
            icon={<Close />}
            color="error"
            sx={{
                color: "#c82121",
                backgroundColor: "#ffaaa5",
                border: "1px solid red"
            }}
        />
    );
};

export default IncompleteChip;