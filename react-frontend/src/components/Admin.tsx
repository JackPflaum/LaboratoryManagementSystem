import { yupResolver } from "@hookform/resolvers/yup";
import { Alert, Box, Button, Container, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { ref } from "yup";
import { CreateUserProps } from "../types/interfaces";
import { useCreateUserMutation } from "../queries/useQueries";
import { useState } from "react";


const getValidationErrorMessage = (str: string) => {
    return `Your password must have at least ${str} character`;
};

// creating User schema
const UserSchema = yup.object().shape({
    firstName: yup.string().trim().required("First name is required"),
    lastName: yup.string().trim().required("Last name is required"),
    workEmail: yup.string()
        .required("Email is required")
        .matches(/\S+@\S+\.\S/, "Invalid email address"),
    password: yup.string()
        .required("Password is required")
        .min(8, "Must have at least 8 characters")
        .matches(/[0-9]/, getValidationErrorMessage("number"))
        .matches(/[a-z]/, getValidationErrorMessage("lowercase"))
        .matches(/[A-Z]/, getValidationErrorMessage("uppercase")),
    confirmPassword: yup.string()
        .required("Please confirm password")
        .oneOf([ref("password")], "Passwords do not match")
});


const Admin = () => {
    // form submission errors
    const [error, setError] = useState<string>("");

    const { handleSubmit, control } = useForm({ resolver: yupResolver(UserSchema) });

    const { mutate: createUser, isPending } = useCreateUserMutation();

    const onSubmit = (formData: CreateUserProps) => {
        console.log("Form Data: ", formData);
        if (formData) {
            createUser(formData, {
                onSuccess: () => {
                    // TODO: confirm user was created
                    // reset form
                },
                onError: (error) => {
                    setError(error.message);
                }
            });
        };
    };

    return (
        <Container>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginTop: 8
                }}
            >
                <Typography component="h1" variant="h5">
                    Admin
                </Typography>
                <Controller
                    name="firstName"
                    control={control}
                    defaultValue=""
                    render={({ field, fieldState }) => (
                        <TextField
                            label="First Name"
                            {...field}
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            size="small"
                        />
                    )}
                />
                <Controller
                    name="lastName"
                    control={control}
                    defaultValue=""
                    render={({ field, fieldState }) => (
                        <TextField
                            label="Last Name"
                            {...field}
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            size="small"
                        />
                    )}
                />
                <Controller
                    name="workEmail"
                    control={control}
                    defaultValue=""
                    render={({ field, fieldState }) => (
                        <TextField
                            label="Work Email"
                            {...field}
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            size="small"
                        />
                    )}
                />
                <Controller
                    name="password"
                    control={control}
                    defaultValue=""
                    render={({ field, fieldState }) => (
                        <TextField
                            label="Password"
                            {...field}
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            type="password"
                            size="small"
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
