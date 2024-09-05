import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Stack, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";


// user/profile details validation schema
const ProfileDialogSchema = yup.object().shape({

});

interface ProfileDialogProps {
    data: any; // User & Profile data
    open: boolean;
    handleClose: () => void;
};

const ProfileDialog = ({ data, open, handleClose }: ProfileDialogProps) => {
    // set error messages when submitting form
    const [error, setError] = useState<string>("");

    const mapDataToForm = (data: ProfileAttributes) => {
        // TODO: map data
    };

    const { handleSubmit, control, formState: { errors } } = useForm<ProfileAttributes>({
        defaultValues: mapDataToForm(data),
        resolver: yupResolver(ProfileDialogSchema),
    });

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Edit Profile</DialogTitle>
            <Divider />
            <DialogContent>
                <Stack spacing={2}>

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
