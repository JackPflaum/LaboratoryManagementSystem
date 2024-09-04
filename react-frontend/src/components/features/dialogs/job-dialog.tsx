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
    OutlinedInput,
} from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ClientAttributes, JobAttributes } from "../../../types/interfaces";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useGetClientsQuery } from "../../../queries/useQueries";

// calculate 90 days from now
const currentDate = new Date();
const maxDate = new Date();
maxDate.setDate(currentDate.getDate() + 90);

// job details validation schema
const jobSchema = yup.object().shape({
    client: yup.string().trim().required(),
    comments: yup.string().trim().optional(),
    dueDate: yup.date()
        .required("Due date is required.")
        .min(new Date(), "Due date cannot be in the past.")
        .max(maxDate, "Due date cannot be more than 90days from now"),
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
    const { data: clientsList, isLoading } = useGetClientsQuery("");

    const mapDataToForm = (data?: JobAttributes) => {
        return {
            client: data?.client ?? "",
            // jobNumber: data?.jobNumber ?? "",
            comments: data?.comments ?? "",
            dueDate: data?.dueDate ?? null,
            // TODO: add rest of data
        }
    };

    const { handleSubmit, control, formState: { errors } } = useForm({
        defaultValues: mapDataToForm(data),
        // resolver: yupResolver(jobSchema),
    });

    const onSubmit = (formData: JobAttributes) => {
        console.log("Data", formData);
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>{!data ? "Add Job" : `Edit Job ${data.jobNumber}`}</DialogTitle>
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
                                    {/* {clientsList.map((client: ClientAttributes) => (
                                        <MenuItem key={client.id} value={client.name}>{client.name}</MenuItem>
                                    ))} */}
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
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Controller
                            name="dueDate"
                            control={control}
                            render={({ field, fieldState }) => (
                                <DatePicker
                                    label="Due Date"
                                    value={field.value}
                                    onChange={(e) => {
                                        field.onChange(e)
                                    }}

                                />
                            )}
                        />
                    </LocalizationProvider>
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
