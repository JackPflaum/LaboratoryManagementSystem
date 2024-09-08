import { useState } from "react";
import { Typography, Box } from "@mui/material";
import DisplayGrid from "./features/display-grid";
import { useParams } from "react-router-dom";
import ClientToolbar from "./features/client-toolbar";
import EditIcon from '@mui/icons-material/Edit';
import { useGetJobQuery } from "../queries/useQueries";
import JobDialog from "./features/dialogs/job-dialog";


const IndividualJob = () => {

    const [searchFilter, setSearchFilter] = useState<string>("");
    const [openDialog, setOpenDialog] = useState<boolean>(false);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchFilter(event.target.value);
    };

    const { id } = useParams<string>()

    // get job data
    const { data: jobData, isLoading: loading } = useGetJobQuery(id);

    // get list of samples for currently selected Job
    const { data: samplesData, isLoading } = useGetSamplesQuery(searchFilter);

    const columns = getSamplesColumns();

    return (
        <>
            <Box>
                <Typography variant="h4" sx={{ display: "flex", justifyContent: "center" }}>
                    {jobData?.jobNumber}
                </Typography>
                <Box>
                    <p>Client: {jobData?.client}</p>
                    <p>Due Date: {jobData?.dueDate.toString()}</p>
                    <p>Completed: {jobData?.completed}</p>
                    <p>Comments: {jobData?.comments}</p>
                </Box>
                <ClientToolbar
                    buttonTitle="Edit Job"
                    buttonIcon={<EditIcon />}
                    searchFilter={searchFilter}
                    handleSearchChange={handleSearchChange}
                    setOpenDialog={setOpenDialog}
                />
            </Box>
            <DisplayGrid
                rows={samplesData ?? []}
                columns={columns}
                isLoading={isLoading}
            />
            {openDialog && <JobDialog open={openDialog} handleClose={() => setOpenDialog(false)} data={jobData} />}
        </>
    );
};

export default IndividualJob;
