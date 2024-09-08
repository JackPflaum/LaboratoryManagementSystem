import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Stack, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ProfileAttributes } from "../../../types/interfaces";


// user/profile details validation schema
const ProfileDialogSchema = yup.object().shape({
    personalEmail: yup.string().trim().required("Email is required.").matches(/\S+@\S+\.\S/, "Invalid email address"),
    phoneNumber: yup.string().optional(),
});

interface ProfileDialogProps {
    data: any; // User & Profile data
    open: boolean;
    handleClose: () => void;
};

const ProfileDialog = ({ data, open, handleClose }: ProfileDialogProps) => {
    // set error messages when submitting form
    const [error, setError] = useState<string>("");

    const mapDataToForm = (data?: ProfileAttributes) => {
        return {
            personalEmail: data?.personalEmail ?? "",
            phoneNumber: data?.phoneNumber ?? "",
        };
    };

    const { handleSubmit, control, reset, formState: { errors } } = useForm<ProfileAttributes>({
        defaultValues: mapDataToForm(data),
        resolver: yupResolver(ProfileDialogSchema),
    });

    const { mutate: updateProfile } = useUpdateProfileMutation();

    // handle profile form submission
    const onSubmit = (formData: ProfileAttributes) => {

        // update profile in database
        updateProfile({ data: formData, id: data.id }, {
            onSuccess: () => {
                reset();
                handleClose();
            },
            onError: (error: Error) => {
                setError(error.message);
            }
        });
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Edit Profile</DialogTitle>
            <Divider />
            <DialogContent>
                <Stack spacing={2}>
                    <Controller
                        name="personalEmail"
                        control={control}
                        render={({ field, fieldState }) => (
                            <TextField
                                label="Personal Email"
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
                        name="phoneNumber"
                        control={control}
                        render={({ field, fieldState }) => (
                            <TextField
                                label="Phone Number"
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
                </Stack>
            </DialogContent>
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

export default ProfileDialog;
