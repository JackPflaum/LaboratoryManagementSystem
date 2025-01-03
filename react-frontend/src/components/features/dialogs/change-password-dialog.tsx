import { useForm, Controller } from "react-hook-form";
import { Stack, Divider, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import * as yup from "yup";
import { ref } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useUpdatePasswordMutation } from "../../../queries/useQueries";
import { ChangePasswordAttributes } from "../../../types/interfaces";
import { useAuthUser } from "../../../context/UserAuthContext";


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


interface ChangePasswordProps {
    open: boolean;
    handleClose: () => void;
    setAlert: (alert: { message: string, severity: "error" | "info" | "success" | "warning" }) => void;
};

const ChangePassword = ({ open, handleClose, setAlert }: ChangePasswordProps) => {

    const { handleSubmit, control } = useForm<ChangePasswordAttributes>({
        defaultValues: { password: "", confirmPassword: "" },
        resolver: yupResolver(updatePasswordSchema)
    });


    const { mutate: updatePassword, isPending } = useUpdatePasswordMutation();

    const { user } = useAuthUser();

    const onSubmit = (passwords: ChangePasswordAttributes) => {
        if (user?.id) {
            updatePassword({ password: passwords.password, id: user.id }, {
                onSuccess: () => {
                    setAlert({ message: "Password has been updated.", severity: "success" });
                    setTimeout(() => {
                        setAlert({ message: "", severity: "success" });
                    }, 3000);
                    handleClose();
                },
                onError: (error: Error) => {
                    setTimeout(() => {
                        setAlert({ message: error.message, severity: "warning" });
                    }, 3000);
                    handleClose();
                },
            });
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Update Password</DialogTitle>
            <DialogContent>
                <Stack spacing={2}>
                    <Divider />
                    <Controller
                        name="password"
                        control={control}
                        render={({ field, fieldState }) => (
                            <TextField
                                label="Password"
                                type="password"
                                {...field}
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
                                type="password"
                                {...field}
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                                size="small"
                            />
                        )}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="contained" onClick={handleSubmit(onSubmit)}>
                    {isPending ? "Updating Password..." : "Update"}
                </Button>
            </DialogActions>
        </Dialog>
    )
};

export default ChangePassword;