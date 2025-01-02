import { useState } from "react";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Stack, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { SampleAttributes, TestAttributes } from "../../../types/interfaces";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useGetUsersQuery, useSaveResultsMutation } from "../../../queries/useQueries";
import { useAuthUser } from "../../../context/UserAuthContext";


const ResultsSchema = yup.object().shape({
    tests: yup.array().of(
        yup.object().shape({
            userId: yup.number().required("User is required"),
            testName: yup.string().required("Test name is required"),
            result: yup
                .number()
                .nullable()
                .transform((value, originalValue) => {
                    // if empty input then convert to null
                    if (originalValue === "") return null;
                    // otherwise return original value with no transformation needed
                    return value;
                })
                .typeError("Result must be a number"),
            unit: yup.string().required("Unit is required")
        })
    ).required("Tests are required")
});

interface ResultsDialogProps {
    data?: SampleAttributes;
    open: boolean;
    handleClose: () => void;
};

const ResultsDialog = ({ data, open, handleClose }: ResultsDialogProps) => {
    // set error messages when submitting form
    const [error, setError] = useState<string>("");

    const mapDataToForm = (data?: TestAttributes[]) => {
        return {
            tests: data?.map(test => ({
                id: test?.id,
                sampleId: test?.sampleId,
                userId: test?.userId,
                testName: test?.testName,
                result: test.result ?? null,
                unit: test?.unit,
            })) ?? []
        };
    };

    const { control, handleSubmit, formState: { errors } } = useForm<{ tests: TestAttributes[] }>({
        defaultValues: mapDataToForm(data?.tests),
        resolver: yupResolver(ResultsSchema)
    });

    const { mutate: saveResults, isPending: isSaving } = useSaveResultsMutation();

    const onSubmit = (formData: { tests: TestAttributes[] }) => {
        const formDataWithJobNumber = {
            ...formData,
            jobNumber: data?.jobNumber
        }
        saveResults(formDataWithJobNumber, {
            onSuccess: () => {
                handleClose();
            },
            onError: (error) => {
                setError(error.message);
            }
        });
    };

    const usersList = useGetUsersQuery("", null);

    const { user } = useAuthUser();

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogTitle>Results</DialogTitle>
            <Divider />
            <DialogContent>
                <Stack gap={2}>
                    {data?.tests.map((test, index) => (
                        <Stack key={index} direction="row" spacing={2} margin={2} alignItems="center">
                            <Typography sx={{ flex: 1 }}>
                                <strong>Assigned User: </strong>
                                {(() => {
                                    const user = usersList.data?.find((user) => user.id === test.userId);
                                    return user ? `${user.firstName} ${user.lastName}` : "User not found";
                                })()}
                            </Typography>
                            <Typography>{test.testName}:</Typography>
                            <Controller
                                name={`tests.${index}.result`}  // dynamically bind 'result' field to the correct index in the 'tests' array
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        label="Result"
                                        type="number"
                                        value={field.value}
                                        onChange={(e) => {
                                            field.onChange(e);
                                        }}
                                        disabled={user?.id !== test.userId}
                                        error={!!fieldState?.error}
                                        helperText={fieldState?.error?.message}
                                        size="small"
                                    />
                                )}
                            />
                            <Typography>{test.unit}</Typography>
                        </Stack>
                    ))}
                </Stack>
            </DialogContent>
            {error && <Alert severity="error">{error}</Alert>}
            <DialogActions>
                <Button variant="contained" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="contained" onClick={handleSubmit(onSubmit)}>
                    {isSaving ? "Saving Results..." : "Save"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ResultsDialog;