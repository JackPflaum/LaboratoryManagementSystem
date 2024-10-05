import { useState } from "react";
import { Typography, Box } from "@mui/material";
import DisplayGrid from "./features/display-grid";
import { useParams } from "react-router-dom";
import ClientToolbar from "./features/custom-toolbar";
import EditIcon from '@mui/icons-material/Edit';
import { useGetJobQuery, useGetSampleQuery, useGetTestsQuery } from "../queries/useQueries";
import SampleDialog from "./features/dialogs/sample-dialog";
import { getTestsColumns } from "./features/grid-columns/tests-columns";
import { UserPermissions } from "../types/enums";
import { useHasPermission } from "../hooks/custom-hooks";
import { JobAttributes, SampleAttributes, TestAttributes } from "../types/interfaces";
import PageTitle from "./features/page-title";


const IndividualSample = () => {

    const [searchFilter, setSearchFilter] = useState<string>("");
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [editingSample, setEditingSample] = useState<SampleAttributes | undefined>(undefined);
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchFilter(event.target.value);
    };

    const { id } = useParams<string>()

    // get sample data
    const { data: sampleData, isLoading: loading } = useGetSampleQuery(id);

    // get list of tests for currently selected Sample
    const { data: testsData, isLoading } = useGetTestsQuery(searchFilter);

    // edit test
    const editAction = (row: TestAttributes) => {
        // setEditingTests(row);
        setOpenDialog(true);
    };

    // delete existing test
    const deleteAction = (row: TestAttributes) => {
        setOpenDeleteDialog(true);
    };

    const columns = getTestsColumns(useHasPermission(UserPermissions.ADD_EDIT_RESULTS) ? {
        editAction,
        deleteAction
    } : {});

    return (
        <>
            <Box>
                <PageTitle title={`Sample: ${sampleData?.sampleNumber}`} />
                <Box>
                    <p>Job Number: {sampleData?.jobNumber}</p>
                    <p>Type: {sampleData?.type}</p>
                    <p>Storage: {sampleData?.storage}</p>
                    <p>Completed: {sampleData?.completed}</p>
                    <p>Comments: {sampleData?.comments}</p>
                </Box>
                <ClientToolbar
                    buttonTitle="Edit Sample"
                    buttonIcon={<EditIcon />}
                    searchFilter={searchFilter}
                    handleSearchChange={handleSearchChange}
                    setOpenDialog={setOpenDialog}
                />
            </Box>
            <DisplayGrid
                rows={testsData ?? []}
                columns={columns}
                isLoading={isLoading}
            />
            {openDialog && <SampleDialog open={openDialog} handleClose={() => setOpenDialog(false)} data={editingSample} />}
        </>
    );
};

export default IndividualSample;
