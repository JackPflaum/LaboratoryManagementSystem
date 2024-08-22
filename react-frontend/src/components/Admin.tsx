import { yupResolver } from "@hookform/resolvers/yup";
import {
    Alert,
    Box,
    Checkbox,
    Button,
    Container,
    InputLabel,
    ListItemText,
    MenuItem,
    Select,
    TextField,
    Typography,
    OutlinedInput,
    FormControl,
    Chip
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { ref } from "yup";
import { CreateUserProps } from "../types/interfaces";
import { useCreateUserMutation } from "../queries/useQueries";
import { useState } from "react";


// creating User schema
const UserSchema = yup.object().shape({
    firstName: yup.string().trim().required("First name is required"),
    lastName: yup.string().trim().required("Last name is required"),
    workEmail: yup.string()
        .required("Email is required")
        .matches(/\S+@\S+\.\S/, "Invalid email address"),
    permissions: yup.array().of(yup.string().required()).required(),
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


const Admin = () => {
    // form submission errors and success messages
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");

    const permissionOptions = [
        { name: "Add/Edit Clients", value: "add_edit_clients" },
        { name: "Add/Edit Jobs", value: "add_edit_jobs" },
        { name: "Add/Edit Results", value: "add_edit_results" },
        { name: "View Reports", value: "view_reports" }
    ];

    const { handleSubmit, control, reset } = useForm({
        resolver: yupResolver(UserSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            workEmail: "",
            permissions: [],
            password: "",
            confirmPassword: ""
        }
    });

    const { mutate: createUser, isPending } = useCreateUserMutation();

    const onSubmit = (formData: CreateUserProps) => {
        if (formData) {
            createUser(formData, {
                onSuccess: () => {
                    setSuccess("New user has been created successfully.");
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
        <Container maxWidth="xs">
            {success && <Alert severity="success" onClose={() => setSuccess("")}>{success}</Alert>}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginTop: 8,
                    "& > *:not(:last-child)": {
                        marginBottom: 2
                    }
                }}
            >
                <Typography component="h1" variant="h5">
                    Admin (Create User)
                </Typography>
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
                    name="permissions"
                    control={control}
                    render={({ field }) => (
                        <FormControl fullWidth>
                            <InputLabel id="multiple-checkbox-label">Permissions</InputLabel>
                            <Select
                                labelId="multiple-checkbox-label"
                                id="multiple-checkbox"
                                multiple
                                value={field.value || []}
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
                        />
                    )}
                />
                {error && <Alert severity="error">{error}</Alert>}
                <Button variant="contained" onClick={handleSubmit(onSubmit)}>
                    {isPending ? "Creating User..." : "Submit"}
                </Button>
            </Box>
        </Container>
    );
};

export default Admin;
