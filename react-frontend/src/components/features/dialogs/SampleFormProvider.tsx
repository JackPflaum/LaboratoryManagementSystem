import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Stack } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import SampleDialog from "./sample-dialog";
import AddTests from "./tests-dialog";
import { SampleAttributes } from "../../../types/interfaces";
import { useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCreateSampleMutation, useUpdateSampleMutation } from "../../../queries/useQueries";
import { Test, Unit } from "../../../types/enums";


// sample details validation schema
const SampleSchema = yup.object().shape({
    numberOfSamples: yup.number().required("Number of samples is required."),
    type: yup.string().required("Sample type is required."),
    storage: yup.string().required("Storage location is required."),
    comments: yup.string().optional(),
    tests: yup.array().of(
        yup.object().shape({
            userId: yup.number().required("User is required"),
            testName: yup.string().required("Test is required"),
            unit: yup.string().required("Unit is required"),
        })
    ).required("Adding a test is required"),
});


interface SampleDialogProps {
    data?: SampleAttributes;
    jobNumber?: string;
    open: boolean;
    handleClose: () => void;
};


const SampleFormProvider = ({ data, jobNumber, open, handleClose }: SampleDialogProps) => {
    // set error messages when submitting form
    const [error, setError] = useState<string>("");

    const mapDataToForm = (data?: SampleAttributes) => {
        return {
            jobNumber: jobNumber,
            numberOfSamples: 1,
            type: data?.type ?? "Liquid",
            storage: data?.storage ?? "Shelf#1",
            comments: data?.comments ?? undefined,
            tests: data?.tests?.map(test => ({
                id: test?.id,
                userId: test?.userId,
                testName: test?.testName,
                unit: test?.unit,
            })) ?? []
        };
    };

    const formMethods = useForm<SampleAttributes>({
        defaultValues: mapDataToForm(data),
        resolver: yupResolver(SampleSchema),
    });

    const { mutate: createSample, isPending: isCreating } = useCreateSampleMutation();

    const { mutate: updateSample, isPending: isUpdating } = useUpdateSampleMutation();

    const onSubmit = (formData: SampleAttributes) => {
        const formDataWithTests = {
            ...formData,
            tests: formData.tests ?? [],  // Ensure tests are included
        };

        // Save or update sample here
        if (data?.id) {
            updateSample({ formData: formDataWithTests, id: data.id }, {
                onSuccess: () => {
                    formMethods.reset();
                    handleClose();
                },
                onError: (error) => {
                    setError(error.message);
                }
            });
        } else {
            createSample(formDataWithTests, {
                onSuccess: () => {
                    formMethods.reset();
                    handleClose();
                },
                onError: (error) => {
                    setError(error.message);
                }
            });
        };
    };


    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogTitle>{!data ? "Add Sample" : `Edit Sample: ${data?.sampleNumber}`}</DialogTitle>
            <Divider />
            <DialogContent>
                <FormProvider {...formMethods}>
                    <Stack spacing={2}>
                        <SampleDialog editing={!!data} />
                        <Divider />
                        <AddTests sampleData={data} />
                    </Stack>
                </FormProvider>
            </DialogContent>
            {error && <Alert severity="error">{error}</Alert>}
            <DialogActions>
                <Button variant="contained" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="contained" onClick={formMethods.handleSubmit(onSubmit)}>
                    {isCreating || isUpdating ? "Saving Sample..." : "Save"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SampleFormProvider;
