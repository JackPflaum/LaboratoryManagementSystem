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
import { ClientAttributes, JobAttributes } from "../../../types/interfaces";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCreateJobMutation, useGetClientsQuery, useUpdateJobMutation } from "../../../queries/useQueries";

// calculate 90 days from now
const currentDate = new Date();
const maxDate = new Date();
maxDate.setDate(currentDate.getDate() + 90);

// job details validation schema
const JobSchema = yup.object().shape({
    client: yup.string().trim().required("Client is required."),
    comments: yup.string().trim().optional(),
    dueDate: yup.date()
        .required("Due date is required.")
        // .min(new Date(), "Due date cannot be in the past.")
        .max(maxDate, "Due date cannot be more than 90days from now."),
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
        const defaultDueDate = new Date();
        defaultDueDate.setDate(currentDate.getDate() + 7);
        return {
            client: data?.client ?? "",
            comments: data?.comments ?? undefined,
            dueDate: data?.dueDate ?? defaultDueDate,
        }
    };

    const { handleSubmit, control, reset, formState: { errors } } = useForm<JobAttributes>({
        defaultValues: mapDataToForm(data),
        resolver: yupResolver(JobSchema),
    });


    const { mutate: createJob, isPending: isCreating } = useCreateJobMutation();

    const { mutate: updateJob, isPending: isUpdating } = useUpdateJobMutation();

    const onSubmit = (formData: JobAttributes) => {
        console.log("Data", formData);
        if (data?.id) {
            updateJob({ formData: formData, id: data.id }, {
                onSuccess: () => {
                    reset();
                    handleClose();
                },
                onError: (error) => {
                    setError(error.message);
                }
            });
        } else {
            createJob(formData, {
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
            <DialogTitle>{!data ? "Add Job" : `Edit Job ${data.jobNumber}`}</DialogTitle>
            <Divider />
            <DialogContent>
                <Stack spacing={2}>
                    <Controller
                        name="client"
                        control={control}
                        render={({ field, fieldState }) => (
                            <FormControl error={!!fieldState.error}>
                                <InputLabel>Client</InputLabel>
                                <Select
                                    value={field.value}
                                    label="Client"
                                    onChange={(e) => {
                                        field.onChange(e)
                                    }}
                                    autoWidth
                                    input={<OutlinedInput label="Client" />}
                                    disabled={!!data}
                                >
                                    {isLoading ? (
                                        <MenuItem>Loading...</MenuItem>
                                    ) : (
                                        clientsList?.map((client: ClientAttributes) => (
                                            <MenuItem key={client.id} value={client.name}>{client.name}</MenuItem>
                                        )) ?? <MenuItem>No Clients Found</MenuItem>
                                    )}
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
                    <Controller
                        name="dueDate"
                        control={control}
                        render={({ field, fieldState }) => (
                            <FormControl className="custom-datepicker">
                                <InputLabel htmlFor="dueDate">Due Date</InputLabel>
                                <DatePicker
                                    selected={field.value}
                                    onChange={(e) => {
                                        field.onChange(e)
                                        console.log("Date: ", field.value);
                                    }}
                                    dateFormat="d MMMM, yyyy"
                                />
                                <FormHelperText sx={{ color: "red" }}>{fieldState.error?.message}</FormHelperText>
                            </FormControl>
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
                    {isCreating || isUpdating ? "Saving Job..." : "Save"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default JobDialog;
