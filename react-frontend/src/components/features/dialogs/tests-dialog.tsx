import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import DisplayGrid from "../display-grid";
import { SampleAttributes, UserAttributes } from "../../../types/interfaces";
import { useGetUsersQuery } from "../../../queries/useQueries";
import { getTestsColumns } from "../grid-columns/tests-columns";
import { Test, Unit } from "../../../types/enums";


interface AddTestsProps {
    sampleData?: SampleAttributes;
};

const AddTests = ({ sampleData }: AddTestsProps) => {

    // track the field values using "useWatch"
    const { watch, control } = useFormContext();

    const { fields, append, remove } = useFieldArray({ control, name: "tests" });

    const watchUserId = watch("userId");
    const watchTestName = watch("testName");
    const watchUnit = watch("unit");

    // const { data: rows, isLoading } = useGetTestsQuery(sampleData?.id);
    const isLoading = false;
    const rows: any = [];

    // get list of users for dropdown selection
    const { data: usersList, isLoading: usersLoading } = useGetUsersQuery("");

    const columns = getTestsColumns({});

    const handleAddTest = () => {
        // append actual values into tests array
        if (watchUserId && watchTestName && watchUnit) {
            append({
                userId: watchUserId,
                testName: watchTestName,
                unit: watchUnit,
            })
        };
    };

    return (
        <Box>
            <Typography>Add Tests</Typography>
            <Box display="flex" flexWrap="wrap" gap={4}>
                <Box flex={1}>
                    <Controller
                        name="userId"
                        control={control}
                        render={({ field, fieldState }) => (
                            <FormControl>
                                <InputLabel>Assigned User</InputLabel>
                                <Select
                                    label="Assigned User"
                                    {...field}
                                    error={!!fieldState.error}
                                    size="small"
                                    fullWidth
                                    sx={{
                                        minWidth: "200px"
                                    }}
                                // autoWidth
                                // input={<OutlinedInput label="Assigned User" />}
                                // readOnly={!!data}
                                >
                                    {/* Placeholder or non-selectable option */}
                                    <MenuItem value="{field.value}" disabled>
                                        Choose an Assigned User
                                    </MenuItem>

                                    {usersLoading ? (
                                        <MenuItem>...loading users</MenuItem>
                                    ) : (
                                        usersList?.map((user: UserAttributes) => (
                                            <MenuItem key={user.id} value={user.id}>
                                                {`${user.firstName} ${user.lastName}`}
                                            </MenuItem>
                                        )) ?? <MenuItem>No Users Found</MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        )}
                    />
                </Box>
                <Box flex={1} minWidth="100px">
                    <Controller
                        name="testName"
                        control={control}
                        render={({ field, fieldState }) => (
                            <FormControl>
                                <InputLabel>Test</InputLabel>
                                <Select
                                    label="Test"
                                    {...field}
                                    error={!!fieldState.error}
                                    size="small"
                                // autoWidth
                                // input={<OutlinedInput label="Test" />}
                                // readOnly={!!data}
                                >
                                    {Object.values(Test).map((test) => (
                                        <MenuItem key={test} value={test}>
                                            {test}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    />
                </Box>
                <Box flex={1} minWidth="100px">
                    <Controller
                        name="unit"
                        control={control}
                        render={({ field, fieldState }) => (
                            <FormControl>
                                <InputLabel>Unit</InputLabel>
                                <Select
                                    label="Unit"
                                    {...field}
                                    error={!!fieldState.error}
                                    size="small"
                                // autoWidth
                                // input={<OutlinedInput label="Unit" />}
                                // readOnly={!!data}
                                >
                                    {Object.values(Unit).map((unit) => (
                                        <MenuItem key={unit} value={unit}>
                                            {unit}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    />
                </Box>
                <Box flex={1} minWidth="100px">
                    <Button variant="contained" onClick={handleAddTest} >
                        Save Test
                    </Button>
                </Box>
            </Box>
            <DisplayGrid
                rows={fields.map((field, index) => ({
                    rowId: index,
                    ...field
                }))}
                columns={columns}
            />
        </Box >
    );

};

export default AddTests;