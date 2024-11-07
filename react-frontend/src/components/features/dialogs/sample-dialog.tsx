import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
} from "@mui/material";
import "react-datepicker/dist/react-datepicker.css";
import { SampleAttributes } from "../../../types/interfaces";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCreateSampleMutation, useUpdateSampleMutation } from "../../../queries/useQueries";
import { Type } from "../../../types/enums";


// sample details validation schema
const SampleSchema = yup.object().shape({
    type: yup.array().required("Sample type is required."),
    storage: yup.array().required("Storage location is required."),
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
            type: data?.type ?? undefined,
            storage: data?.storage ?? undefined,
            comments: data?.comments ?? undefined,
        }
    };

    const { handleSubmit, control, reset } = useForm<SampleAttributes>({
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
                                    size="small"
                                >
                                    {Object.values(Type).map((type) => (
                                        <MenuItem key={type} value={type}>
                                            {type}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>{fieldState.error?.message}</FormHelperText>
                            </FormControl>
                        )}
                    />
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
                                    size="small"
                                >
                                    {Object.values(Storage).map((storage) => (
                                        <MenuItem key={storage} value={storage}>
                                            {storage}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>{fieldState.error?.message}</FormHelperText>
                            </FormControl>
                        )}
                    />
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
