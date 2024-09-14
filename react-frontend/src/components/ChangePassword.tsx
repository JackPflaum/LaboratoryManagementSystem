import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Box, Typography, Stack, Divider, TextField, Button } from "@mui/material";
import * as yup from "yup";
import { ref } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useUpdatePasswordMutation } from "../queries/useQueries";
import { ChangePasswordAttributes } from "../types/interfaces";
import { useParams } from "react-router-dom";


const updatePasswordSchema = yup.object().shape({
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


const ChangePassword = () => {

    const [alert, setAlert] = useState({ message: "", severity: "" });


    const { handleSubmit, control } = useForm<ChangePasswordAttributes>({
        defaultValues: { password: "", confirmPassword: "" },
        resolver: yupResolver(updatePasswordSchema)
    });


    const { mutate: updatePassword, isPending } = useUpdatePasswordMutation();

    const { id } = useParams<{ id: string }>();

    const onSubmit = (passwords: ChangePasswordAttributes) => {
        if (id) {
            updatePassword({ password: passwords.password, id: id }, {
                onSuccess: () => {
                    setAlert({ message: "Password has been updated.", severity: "success" });
                    setTimeout(() => {
                        setAlert({ message: "", severity: "" });
                    }, 3000);
                },
                onError: (error: Error) => {
                    setAlert({ message: error.message, severity: "warning" });
                },
            });
        }
    };



    return (
        <Box>
            <Stack gap={2}>
                <Typography component="h2">Change Password</Typography>
                <Divider />
                <Controller
                    name="password"
                    control={control}
                    render={({ field, fieldState }) => (
                        <TextField
                            label="Password"
                            type="password"
                            value={field}
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
                    name="confirmPassword"
                    control={control}
                    render={({ field, fieldState }) => (
                        <TextField
                            label="Confirm Password"
                            type="confirmPassword"
                            value={field}
                            onChange={(e) => {
                                field.onChange(e)
                            }}
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            size="small"
                        />
                    )}
                />
                <Button variant="contained" onClick={handleSubmit(onSubmit)}>
                    {isPending ? "Changing Password..." : "Change Password"}
                </Button>
            </Stack>
        </Box>
    )
};

export default ChangePassword;