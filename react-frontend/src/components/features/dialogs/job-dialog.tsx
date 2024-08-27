import {
    Alert,
    Button,
    Box,
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
    OutlinedInput
} from "@mui/material";
import { ClientAttributes, JobAttributes } from "../../../types/interfaces";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useGetClientsQuery } from "../../../queries/useQueries";

// job details validation schema
const jobSchema = yup.object().shape({
    name: yup.string().trim().required(),
});

interface JobDialogProps {
    data?: JobAttributes;
    open: boolean;
    handleClose: () => void;
}

const JobDialog = ({ data, open, handleClose }: JobDialogProps) => {
    // set error messages when submitting form
    const [error, setError] = useState<string>("");

    // get list of clients for dropdown selection
    const { data: clientsList, isLoading } = useGetClientsQuery();

    const mapDataToForm = (data?: JobAttributes) => {
        return {
            client: data?.client ?? "",
            // jobNumber: data?.jobNumber ?? "",
            comments: data?.comments ?? "",
            dueData: data?.dueDate ?? "",
            // TODO: add rest of data
        }
    };

    const { handleSubmit, control, formState: { errors } } = useForm({
        defaultValues: mapDataToForm(data),
        resolver: yupResolver(jobSchema),
    });

    const onSubmit = (formData: JobAttributes) => {
        console.log("Data", formData);
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>{!data ? "Add Job" : "Edit Job"}</DialogTitle>
            <Divider />
            <DialogContent>
                <Stack spacing={2}>
                    <Controller
                        name="client"
                        control={control}
                        render={({ field, fieldState }) => (
                            // TODO: Add Clients dropdown options
                            <FormControl>
                                <InputLabel>Client</InputLabel>
                                <Select
                                    value={field.value}
                                    label="Client"
                                    onChange={(e) => field.onChange(e)}
                                    autoWidth
                                    input={<OutlinedInput label="Client" />}
                                    renderValue={() => (
                                        <Box>
                                            {field.value}
                                        </Box>
                                    )}
                                >
                                    {clientsList.map((client: ClientAttributes) => (
                                        <MenuItem key={client.id} value={client.name}>{client.name}</MenuItem>
                                    ))}
                                </Select>
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
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default JobDialog;
