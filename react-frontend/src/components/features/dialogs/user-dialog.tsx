import { yupResolver } from "@hookform/resolvers/yup";
import {
    Alert,
    Box,
    Checkbox,
    Button,
    InputLabel,
    ListItemText,
    MenuItem,
    Select,
    TextField,
    Stack,
    OutlinedInput,
    FormControl,
    Chip,
    Dialog,
    DialogTitle,
    Divider,
    DialogContent,
    DialogActions,
    FormHelperText,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { ref } from "yup";
import { UserAttributes } from "../../../types/interfaces";
import { useCreateUserMutation, useUpdateUserMutation } from "../../../queries/useQueries";
import { useState } from "react";
import { UserPermissions } from "../../../types/enums";
import DatePicker from "react-datepicker";

const currentDate = new Date();

// creating User schema
const UserSchema = yup.object().shape({
    firstName: yup.string().trim().required("First name is required"),
    lastName: yup.string().trim().required("Last name is required"),
    workEmail: yup.string()
        .required("Email is required")
        .matches(/\S+@\S+\.\S/, "Invalid email address"),
    position: yup.string().required("Employee position is required"),
    permissions: yup.array().of(yup.string().required()).required(),
    dateStarted: yup.date().required("Starting date is required"),
    password: yup.string()
        .required("Password is required")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
            "Must contain at least 8 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character."
        ),
    confirmPassword: yup.string()
        .required("Please confirm password")
        .oneOf([ref("password")], "Passwords do not match")
});


// Select mui component styling
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

interface UserDialogProps {
    open: boolean;
    handleClose: () => void;
    data?: UserAttributes;
};

const UserDialog = ({ open, handleClose, data }: UserDialogProps) => {
    // form submission errors and success messages
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");

    // used for DatePicker
    const [click, setClick] = useState<boolean>(false);

    const permissionOptions = [
        { name: UserPermissions.ADD_EDIT_CLIENTS, value: UserPermissions.ADD_EDIT_CLIENTS },
        { name: UserPermissions.ADD_EDIT_JOBS, value: UserPermissions.ADD_EDIT_JOBS },
        { name: UserPermissions.ADD_EDIT_RESULTS, value: UserPermissions.ADD_EDIT_RESULTS },
        { name: UserPermissions.VIEW_REPORTS, value: UserPermissions.VIEW_REPORTS }
    ];

    const mapDataToForm = (data?: UserAttributes) => {
        return {
            firstName: data?.firstName ?? "",
            lastName: data?.lastName ?? "",
            workEmail: data?.workEmail ?? "",
            position: data?.position ?? "",
            permissions: data?.permissions ?? [],
            dateStarted: data?.dateStarted ?? new Date(),
            password: data ? "!1xXXXXXXXX" : "",
            confirmPassword: data ? "!1xXXXXXXXX" : "",
        };
    };

    const { handleSubmit, control, reset } = useForm({
        resolver: yupResolver(UserSchema),
        defaultValues: mapDataToForm(data),
    });

    const { mutate: createUser, isPending: isCreating } = useCreateUserMutation();

    const { mutate: updateUser, isPending: isUpdating } = useUpdateUserMutation();

    const onSubmit = (formData: UserAttributes) => {
        if (data?.id) {
            const { password, confirmPassword, ...restOfData } = formData;
            const updatedData = { ...restOfData };
            updateUser({ data: updatedData, id: data.id }, {
                onSuccess: () => {
                    setSuccess("User has been updated successfully.");
                    handleClose();
                },
                onError: (error) => {
                    setError(error.message)
                    setTimeout(() => {
                        setError("");
                    }, 5000);
                }
            })
        } else {
            createUser(formData, {
                onSuccess: () => {
                    setSuccess("New user has been created successfully.");
                    handleClose();
                    reset();
                },
                onError: (error) => {
                    setError(error.message);
                    setTimeout(() => {
                        setError("");
                    }, 5000);
                }
            });
        };
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            {success && <Alert severity="success" onClose={() => setSuccess("")}>{success}</Alert>}
            <DialogTitle>{!data ? "Add User" : "Edit User"}</DialogTitle>
            <Divider />
            <DialogContent>
                <Stack spacing={2}>
                    <Controller
                        name="firstName"
                        control={control}
                        render={({ field, fieldState }) => (
                            <TextField
                                label="First Name"
                                {...field}
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                                size="small"
                                fullWidth
                            />
                        )}
                    />
                    <Controller
                        name="lastName"
                        control={control}
                        render={({ field, fieldState }) => (
                            <TextField
                                label="Last Name"
                                {...field}
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                                size="small"
                                fullWidth
                            />
                        )}
                    />
                    <Controller
                        name="workEmail"
                        control={control}
                        render={({ field, fieldState }) => (
                            <TextField
                                label="Work Email"
                                {...field}
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                                size="small"
                                fullWidth
                            />
                        )}
                    />
                    <Controller
                        name="position"
                        control={control}
                        render={({ field, fieldState }) => (
                            <TextField
                                label="Employee Position"
                                {...field}
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                                size="small"
                                fullWidth
                            />
                        )}
                    />
                    <Controller
                        name="permissions"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth>
                                <InputLabel id="multiple-checkbox-label">Permissions</InputLabel>
                                <Select
                                    labelId="multiple-checkbox-label"
                                    id="multiple-checkbox"
                                    multiple
                                    value={field.value}
                                    onChange={(event) => {
                                        const { target: { value } } = event;
                                        field.onChange(typeof value === "string" ? value.split(",") : value);
                                        console.log("field.value: ", field.value);

                                    }}
                                    input={<OutlinedInput label="Permissions" />}
                                    renderValue={(selected) => {
                                        // map the names from permissionOptions into
                                        // selectedNames if the permissionOptions value
                                        // is included in the current selection
                                        const selectedNames = permissionOptions
                                            .filter(option => {
                                                return selected.includes(option.value)
                                            })
                                            .map(option => {
                                                return option.name
                                            })

                                        return (
                                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                                {selectedNames.map((value) => (
                                                    <Chip key={value} label={value} />
                                                ))}
                                            </Box>
                                        )
                                    }}
                                    size="small"
                                    fullWidth
                                    MenuProps={MenuProps}
                                >
                                    {permissionOptions.map((permission) => (
                                        <MenuItem key={permission.name} value={permission.value}>
                                            <Checkbox checked={field.value.indexOf(permission.value) > -1} />
                                            <ListItemText primary={permission.name} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    />
                    <Controller
                        name="dateStarted"
                        control={control}
                        render={({ field, fieldState }) => (
                            <FormControl
                                fullWidth
                                variant="outlined"
                                size="small"
                            >
                                <DatePicker
                                    selected={field.value}
                                    dateFormat="d MMMM, yyyy"
                                    onChange={(date) => field.onChange(date)}  // This will update the form value
                                    customInput={
                                        <TextField
                                            label="Date Started"
                                            value={field.value}
                                            onClick={() => setClick(true)}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            error={!!fieldState.error}
                                            variant="outlined"
                                            fullWidth
                                            size="small"
                                        />
                                    }
                                />
                                <FormHelperText sx={{ color: "red" }}>{fieldState.error?.message}</FormHelperText>
                            </FormControl>
                        )}
                    />
                    <Controller
                        name="password"
                        control={control}
                        render={({ field, fieldState }) => (
                            <TextField
                                label="Password"
                                {...field}
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                                type="password"
                                size="small"
                                fullWidth
                                disabled={!!data}
                            />
                        )}
                    />
                    <Controller
                        name="confirmPassword"
                        control={control}
                        render={({ field, fieldState }) => (
                            <TextField
                                label="Confirm Password"
                                {...field}
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                                type="password"
                                size="small"
                                fullWidth
                                disabled={!!data}
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
                    {isCreating || isUpdating ? "Submitting..." : "Submit"}
                </Button>
            </DialogActions>
        </Dialog >
    );
};

export default UserDialog;
