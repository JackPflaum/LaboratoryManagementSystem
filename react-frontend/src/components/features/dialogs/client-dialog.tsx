import { useState } from "react";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material"
import { Controller, useForm } from "react-hook-form";
import { ClientAttributes } from "../../../types/interfaces";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup"
import { useCreateClientMutation, useUpdateClientMutation } from "../../../queries/useQueries";

// client details validation schema
const clientSchema = yup.object().shape({
    clientName: yup.string().trim().required("Client name is required"),
    email: yup.string().trim().required("Email is required").matches(/\S+@\S+\.\S/, "Invalid email address"),
    phoneNumber: yup.string().trim().optional(),
    addressLine: yup.string().optional(),
    suburb: yup.string().optional(),
    state: yup.string().optional(),
    postcode: yup.string().optional(),
    purchaseOrderNumber: yup.string().trim().optional(),
});

interface ClientDialogProps {
    data?: ClientAttributes;
    open: boolean;
    handleClose: () => void;
}

const ClientDialog = ({ data, open, handleClose }: ClientDialogProps) => {

    // set error messages when submitting form
    const [error, setError] = useState<string>("");

    // address dropdown options
    const australianStates = [
        { value: "", label: "Select State" },
        { value: "NSW", label: "New South Wales" },
        { value: "VIC", label: "Victoria" },
        { value: "QLD", label: "Queensland" },
        { value: "SA", label: "South Australia" },
        { value: "WA", label: "Western Australia" },
        { value: "TAS", label: "Tasmania" },
        { value: "NT", label: "Northern Territory" },
        { value: "ACT", label: "Australian Capital Territory" }
    ];

    // prefill input fields if data exists
    const mapDataToForm = (data?: ClientAttributes) => {
        return {
            clientName: data?.name ?? "",
            email: data?.email ?? "",
            phoneNumber: data?.phoneNumber ?? "",
            addressLine: data?.addressLine ?? "",
            suburb: data?.suburb ?? "",
            state: data?.state ?? "",
            postcode: data?.postcode ?? "",
            purchaseOrderNumber: data?.purchaseOrderNumber ?? "",
        }
    };

    const { handleSubmit, control, formState: { errors } } = useForm({
        defaultValues: mapDataToForm(data),
        resolver: yupResolver(clientSchema)
    });

    const { mutate: createClient } = useCreateClientMutation();

    const { mutate: updateClient } = useUpdateClientMutation();

    // handle client form submissions
    const onSubmit = (formData: ClientAttributes) => {
        console.log("Data", formData);
        if (data?.id) {
            // update client database
            updateClient({ data: formData, id: data.id }, {
                onSuccess: () => {
                    handleClose();
                },
                onError: (error) => {
                    setError(JSON.stringify(error));
                    console.log("Error:", error);
                }
            });
        } else {
            // create new client in the database
            createClient(formData, {
                onSuccess: () => {
                    handleClose();
                },
                onError: (error) => {
                    setError(`Error: ${JSON.stringify(error)}`);
                    console.log("Error: ", error);
                }
            });
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>{!data ? "Add Client" : "Edit Client"}</DialogTitle>
            <Divider />
            <DialogContent>
                <Stack spacing={2}>
                    <Controller
                        name="clientName"
                        control={control}
                        defaultValue={data?.name}
                        render={({ field, fieldState }) => (
                            <TextField
                                label="Name"
                                value={field.value}
                                onChange={(e) => {
                                    field.onChange(e)
                                }}
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                                size="small"
                            />
                        )}
                    />
                    <Controller
                        name="email"
                        control={control}
                        defaultValue={data?.email}
                        render={({ field, fieldState }) => (
                            <TextField
                                label="Email"
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
                        name="phoneNumber"
                        control={control}
                        defaultValue={data?.phoneNumber}
                        render={({ field, fieldState }) => (
                            <TextField
                                label="Phone Number"
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
                    <Grid container>
                        <Grid item xs={12} md={6} >
                            <Stack marginRight={2}>
                                <Controller
                                    name="addressLine"
                                    control={control}
                                    defaultValue={data?.addressLine}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            label="Address Line"
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
                                    name="suburb"
                                    control={control}
                                    defaultValue={data?.suburb}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            label="Suburb"
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
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Controller
                                name="state"
                                control={control}
                                defaultValue={data?.state || ""}
                                render={({ field, fieldState }) => (
                                    <FormControl size="small">
                                        <InputLabel>State</InputLabel>
                                        <Select
                                            label="State"
                                            {...field}
                                            error={!!fieldState.error}
                                            placeholder={fieldState.error?.message}
                                            sx={{ minWidth: "100px" }}
                                        >
                                            {australianStates.map((state) => (
                                                <MenuItem key={state.value} value={state.value}>
                                                    {state.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                )}
                            />
                            <Controller
                                name="postcode"
                                control={control}
                                defaultValue={data?.postcode}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        label="Postcode"
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
                        </Grid>
                    </Grid>
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
        </Dialog >
    );
};

export default ClientDialog;