import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    OutlinedInput,
    FormHelperText,
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ClientAttributes, JobAttributes, SampleAttributes } from "../../../types/interfaces";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCreateJobMutation, useGetClientsQuery, useUpdateJobMutation } from "../../../queries/useQueries";
import { Type } from "../../../types/enums";


// sample details validation schema
const SampleSchema = yup.object().shape({
    type: yup.string().required("Sample type is required."),
    storage: yup.string().required("Storage location is required."),
    comments: yup.string().optional(),
});

interface SampleDialogProps {
    data?: SampleAttributes;
    open: boolean;
    handleClose: () => void;
}

const SampleDialog = ({ data, open, handleClose }: SampleDialogProps) => {
    // set error messages when submitting form
    const [error, setError] = useState<string>("");

    const mapDataToForm = (data?: SampleAttributes) => {
        return {
            type: data?.type ?? "",
            storage: data?.storage ?? "",
            comments: data?.comments ?? undefined,
        }
    };

    const { handleSubmit, control, reset, formState: { errors } } = useForm<SampleAttributes>({
        defaultValues: mapDataToForm(data),
        resolver: yupResolver(SampleSchema),
    });


    const { mutate: createSample, isPending: isCreating } = useCreateSampleMutation();

    const { mutate: updateSample, isPending: isUpdating } = useUpdateSampleMutation();

    const onSubmit = (formData: SampleAttributes) => {
        console.log("Data", formData);
        if (data?.id) {
            updateSample({ formData: formData, id: data.id }, {
                onSuccess: () => {
                    reset();
                    handleClose();
                },
                onError: (error) => {
                    setError(error.message);
                }
            });
        } else {
            createSample(formData, {
                onSuccess: () => {
                    reset();
                    handleClose();
                },
                onError: (error) => {
                    setError(error.message);
                }
            });
        };
    };


    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>{!data ? "Add Sample" : "Edit Sample"}</DialogTitle>
            <Divider />
            <DialogContent>
                <Stack spacing={2}>

                    // ------------------------------------------------------------------> TYPE
                    <Controller
                        name="type"
                        control={control}
                        render={({ field, fieldState }) => (
                            <FormControl>
                                <InputLabel>Type</InputLabel>
                                <Select
                                    label="Type"
                                    {...field}
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                    size="small"
                                >
                                    {Object.values(Type).map((type) => (
                                        <MenuItem key={type} value={type}>
                                            {type}
                                        </MenuItem>
                                    ))}

                                    // {sampleType.map((type) => (
                                    //     <MenuItem key={type.value} value={type.value}>
                                    //         {type.label}
                                    //     </MenuItem>
                                    // ))}
                                </Select>
                            </FormControl>
                        )}
                    />


                    // ------------------------------------------------------------------> STORAGE
                    <Controller
                        name="storage"
                        control={control}
                        render={({ field, fieldState }) => (
                            <FormControl>
                                <InputLabel>Storage</InputLabel>
                                <Select
                                    label="Storage"
                                    {...field}
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                    size="small"
                                >
                                    {Object.values(Storage).map((storage) => (
                                        <MenuItem key={storage} value={storage}>
                                            {storage}
                                        </MenuItem>
                                    ))}


                                    // {storageLocation.map((storage) => (
                                    //     <MenuItem key={storage.value} value={storage.value}>
                                    //         {storage.label}
                                    //     </MenuItem>
                                    // ))}
                                </Select>
                            </FormControl>
                        )}
                    />


                    // ------------------------------------------------------------------>
                    <Controller
                        name="comments"
                        control={control}
                        render={({ field, fieldState }) => (
                            <TextField
                                label="Comments"
                                multiline
                                rows={5}
                                value={field.value}
                                onChange={(e) => {
                                    field.onChange(e);
                                }}
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                                size="small"
                            />
                        )}
                    />
                </Stack>
            </DialogContent>
            {error && <Alert severity="error">{error}</Alert>}
            <DialogActions>
                <Button variant="contained" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="contained" onClick={handleSubmit(onSubmit)}>
                    {isCreating || isUpdating ? "Saving Sample..." : "Save"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SampleDialog;
